/* eslint-disable no-console */
const { MongoClient } = require('mongodb');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = process.env.DB_NAME || 'onpg';

async function main() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const users = await db
    .collection('users')
    .find(
      {
        role: 'pharmacien',
        $or: [{ nom: /ABBO/i }, { prenoms: /ADJI|Farida|Yasmine/i }, { email: /tizi/i }]
      },
      { projection: { nom: 1, prenoms: 1, email: 1, telephone: 1, photo: 1 } }
    )
    .limit(10)
    .toArray();

  const pharmaciens = await db
    .collection('pharmaciens')
    .find(
      {
        $or: [
          { nom: /ABBO/i },
          { prenom: /Farida|Yasmine/i },
          { nomComplet: /ABBO|ADJI|Farida|Yasmine/i },
          { email: /tizi/i }
        ]
      },
      { projection: { nom: 1, prenom: 1, nomComplet: 1, email: 1, telephone: 1, photo: 1 } }
    )
    .limit(10)
    .toArray();

  console.log(
    JSON.stringify(
      {
        users,
        pharmaciens
      },
      null,
      2
    )
  );

  await client.close();
}

main().catch((error) => {
  console.error('db-check-sample failed:', error);
  process.exit(1);
});
