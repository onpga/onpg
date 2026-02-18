/**
 * Script pour réinitialiser complètement la collection `users`
 * - Supprime tous les utilisateurs existants
 * - Crée un seul utilisateur admin avec :
 *   username: admin
 *   email: admin@onpg.ga
 *   password: admin123
 */

const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './backend-config.env' });

// Même URI/DB que le serveur (Railway forcé en dur dans server.js)
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

async function resetUsers() {
  let client;
  try {
    console.log('🔌 Connexion à MongoDB pour réinitialiser la collection users...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);
    const users = db.collection('users');

    console.log('🗑️  Suppression de tous les utilisateurs existants...');
    await users.deleteMany({});
    console.log('✅ Collection `users` vidée');

    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);

    const now = new Date();

    const newUser = {
      username: 'admin',
      email: 'admin@onpg.ga',
      password: hash,
      role: 'superadmin',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLogin: null
    };

    const result = await users.insertOne(newUser);

    console.log('✅ Nouvel utilisateur admin créé:');
    console.log(`   _id     : ${result.insertedId}`);
    console.log(`   username: ${newUser.username}`);
    console.log(`   email   : ${newUser.email}`);
    console.log('\n🔐 Identifiants de connexion:');
    console.log('   Nom d\'utilisateur : admin');
    console.log('   Mot de passe      : admin123');
    console.log('\n⚠️ Pensez à changer ce mot de passe en production.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation de users:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

resetUsers();


