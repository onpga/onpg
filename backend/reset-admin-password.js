/**
 * Script pour réinitialiser le mot de passe de l'utilisateur admin
 * Nouveau mot de passe: admin123
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './backend-config.env' });

// Même URI/DB que le serveur
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

async function resetAdminPassword() {
  let client;
  try {
    console.log('🔌 Connexion à MongoDB pour réinitialiser le mot de passe admin...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);

    // Utiliser l'_id fourni dans ta question pour cibler exactement le bon user
    const adminId = '698627dd231d3fc4b2170c09';
    const newPassword = 'admin123';

    const hash = await bcrypt.hash(newPassword, 10);

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new (require('mongodb').ObjectId)(adminId) },
      {
        $set: {
          password: hash,
          isActive: true,
          updatedAt: new Date()
        }
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      console.log(`❌ Aucun utilisateur trouvé avec _id="${adminId}"`);
      process.exit(1);
    }

    console.log('✅ Mot de passe réinitialisé pour:');
    console.log(`   username: ${result.value.username}`);
    console.log(`   email   : ${result.value.email}`);
    console.log('\n🔐 Nouveau mot de passe: admin123');
    console.log('⚠️ Pensez à le changer en production.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation du mot de passe:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

resetAdminPassword();


