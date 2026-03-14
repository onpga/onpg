/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = process.env.DB_NAME || 'onpg';
const APPLY = process.argv.includes('--apply');

const normalizeIdentityKey = (...parts) => {
  return String(parts.filter(Boolean).join(' '))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
};

const identityTokensKey = (...parts) => {
  const stopwords = new Set(['dr', 'docteur', 'pharmacien', 'pharmacienne']);
  const tokens = String(parts.filter(Boolean).join(' '))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .map((t) => t.trim())
    .filter((t) => t && !stopwords.has(t));
  return tokens.sort().join('|');
};

const nonEmpty = (v) => String(v || '').trim();
const normalizeEmail = (v) => nonEmpty(v).toLowerCase();

function buildUserMatch(user) {
  return {
    email: normalizeEmail(user.email),
    normalizedNameKey: normalizeIdentityKey(user.nom || '', user.prenoms || user.prenom || ''),
    tokensKey: identityTokensKey(user.nom || '', user.prenoms || user.prenom || '')
  };
}

function buildPharmacienMatch(pharmacien) {
  return {
    email: normalizeEmail(pharmacien.email),
    normalizedNameKey: normalizeIdentityKey(pharmacien.nom || '', pharmacien.prenom || ''),
    normalizedFullKey: normalizeIdentityKey(pharmacien.nomComplet || ''),
    tokensNameKey: identityTokensKey(pharmacien.nom || '', pharmacien.prenom || ''),
    tokensFullKey: identityTokensKey(pharmacien.nomComplet || '')
  };
}

function scorePair(user, pharmacien) {
  const u = buildUserMatch(user);
  const p = buildPharmacienMatch(pharmacien);

  if (u.email && p.email && u.email === p.email) return 100;
  if (u.normalizedNameKey && p.normalizedNameKey && u.normalizedNameKey === p.normalizedNameKey) return 80;
  if (u.normalizedNameKey && p.normalizedFullKey && u.normalizedNameKey === p.normalizedFullKey) return 70;
  if (u.tokensKey && p.tokensNameKey && u.tokensKey === p.tokensNameKey) return 60;
  if (u.tokensKey && p.tokensFullKey && u.tokensKey === p.tokensFullKey) return 50;
  return 0;
}

function chooseValue(left, right) {
  const l = nonEmpty(left);
  const r = nonEmpty(right);
  if (l && r) return r;
  return r || l || '';
}

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const users = await db.collection('users').find({ role: 'pharmacien', isActive: true }).toArray();
  const pharmaciens = await db.collection('pharmaciens').find({}).toArray();

  let matched = 0;
  let ambiguous = 0;
  let userUpdates = 0;
  let pharmacienUpdates = 0;

  for (const user of users) {
    let bestScore = 0;
    let best = null;
    let tie = false;

    for (const pharmacien of pharmaciens) {
      const score = scorePair(user, pharmacien);
      if (score > bestScore) {
        bestScore = score;
        best = pharmacien;
        tie = false;
      } else if (score > 0 && score === bestScore) {
        tie = true;
      }
    }

    if (!bestScore || !best) continue;
    if (tie) {
      ambiguous += 1;
      continue;
    }

    matched += 1;

    const mergedEmail = chooseValue(user.email, best.email);
    const mergedTelephone = chooseValue(user.telephone, best.telephone);
    const mergedPhoto = chooseValue(user.photo, best.photo);

    const userSet = {};
    const pharmacienSet = {};

    if (nonEmpty(user.email) !== nonEmpty(mergedEmail)) userSet.email = mergedEmail;
    if (nonEmpty(user.telephone) !== nonEmpty(mergedTelephone)) userSet.telephone = mergedTelephone;
    if (nonEmpty(user.photo) !== nonEmpty(mergedPhoto)) userSet.photo = mergedPhoto;

    if (nonEmpty(best.email) !== nonEmpty(mergedEmail)) pharmacienSet.email = mergedEmail;
    if (nonEmpty(best.telephone) !== nonEmpty(mergedTelephone)) pharmacienSet.telephone = mergedTelephone;
    if (nonEmpty(best.photo) !== nonEmpty(mergedPhoto)) pharmacienSet.photo = mergedPhoto;

    if (Object.keys(userSet).length > 0) {
      userSet.updatedAt = new Date();
      if (APPLY) {
        await db.collection('users').updateOne({ _id: user._id }, { $set: userSet });
      }
      userUpdates += 1;
    }

    if (Object.keys(pharmacienSet).length > 0) {
      pharmacienSet.updatedAt = new Date();
      if (APPLY) {
        await db.collection('pharmaciens').updateOne({ _id: best._id }, { $set: pharmacienSet });
      }
      pharmacienUpdates += 1;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: APPLY ? 'apply' : 'dry-run',
        usersTotal: users.length,
        pharmaciensTotal: pharmaciens.length,
        matched,
        ambiguousSkipped: ambiguous,
        usersToUpdate: userUpdates,
        pharmaciensToUpdate: pharmacienUpdates
      },
      null,
      2
    )
  );

  await client.close();
}

main().catch((error) => {
  console.error('db-direct-sync-recover failed:', error);
  process.exit(1);
});
