/**
 * Serveur Express pour l'API ONPG - backend dédié (pharmacie)
 * Copie du backend actuel, isolée pour un déploiement séparé.
 */

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend-config.env') });

const app = express();
// En déploiement conteneur (Docker / Railway), PORT sera fourni par l'env
const PORT = process.env.PORT || 3001;

// URI MongoDB forcée en dur (Railway) – identique au backend actuel
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

// Middleware CORS très permissif - en-têtes ajoutés manuellement
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  // On autorise aussi les en-têtes utilisés par l'espace pharmacien (x-user-id, x-user-data)
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id, x-user-data');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});
app.use(express.json());

let db;

// Connexion MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Connecté à MongoDB (backend_pharmacie)');
    db = client.db(DB_NAME);
  })
  .catch(error => {
    console.error('❌ Erreur connexion MongoDB (backend_pharmacie):', error);
    process.exit(1);
  });

// Collections disponibles (chaque page a sa propre collection)
const RESOURCE_COLLECTIONS = [
  'actualites',
  'articles',
  'communiques',
  'decisions',
  'decrets',
  'lois',
  'commissions',
  'theses',
  'photos',
  'videos',
  'pharmaciens',
  'formations',
  'deontologie'
];

// Authentification admin par token (simple)
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: 'Non autorisé' });
  }
  next();
};

// Authentification pharmacien (vérifie le rôle et le token) – utilisée pour les routes /api/pharmacien/*
const authenticatePharmacien = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ success: false, error: 'Non autorisé' });
    }

    // Récupérer l'utilisateur depuis le header x-user-id (envoyé par le frontend après login)
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Utilisateur non identifié' });
    }

    let user;
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(userId), isActive: true });
    } catch (err) {
      // Si userId n'est pas un ObjectId valide, essayer de le trouver par username
      const storedUser = req.headers['x-user-data'];
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          user = await db.collection('users').findOne({ username: userData.username, isActive: true });
        } catch (e) {
          return res.status(401).json({ success: false, error: 'Utilisateur non identifié' });
        }
      } else {
        return res.status(401).json({ success: false, error: 'Utilisateur non identifié' });
      }
    }

    if (!user || user.role !== 'pharmacien') {
      return res.status(403).json({ success: false, error: 'Accès réservé aux pharmaciens' });
    }

    req.pharmacienId = String(user._id);
    next();
  } catch (error) {
    console.error('[backend_pharmacie] Erreur authentification pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
};

// Route d'authentification admin (login) basée sur la collection users
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Identifiants manquants' });
    }

    const user = await db.collection('users').findOne({ username, isActive: true });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Identifiants invalides' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Identifiants invalides' });
    }

    // Mettre à jour lastLogin
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // Retourner le token admin actuel pour les routes /api/admin/*
    const token = process.env.ADMIN_TOKEN;

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erreur login admin:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Routes publiques - IMPORTANT: Les routes les plus spécifiques doivent être définies EN PREMIER

// GET une donnée spécifique par ID (route publique) - DOIT ÊTRE AVANT /api/public/:collection
app.get('/api/public/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    console.log(`🔍 [backend_pharmacie] Recherche ${collection} avec ID: ${id}`);
    const data = await db
      .collection(collection)
      .findOne({ _id: new ObjectId(id), isActive: true });
    console.log(`📦 [backend_pharmacie] Données trouvées:`, data ? 'Oui' : 'Non');
    res.json({ success: true, data });
  } catch (error) {
    console.error(`Erreur chargement ${req.params.collection}/${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Routes publiques pour récupérer TOUTES les données actives d'une collection
app.get('/api/public/:collection', async (req, res) => {
  try {
    const { collection } = req.params;

    // Vérifier que la collection existe
    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    const data = await db
      .collection(collection)
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, data });
  } catch (error) {
    console.error(`Erreur chargement ${req.params.collection}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Routes admin pour gérer les collections

// GET toutes les données d'une collection
app.get('/api/admin/:collection', authenticateAdmin, async (req, res) => {
  try {
    const { collection } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    const data = await db
      .collection(collection)
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    res.json({ success: true, data });
  } catch (error) {
    console.error(`Erreur chargement ${req.params.collection}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET une donnée spécifique (route admin)
app.get('/api/admin/:collection/:id', authenticateAdmin, async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    const data = await db.collection(collection).findOne({ _id: new ObjectId(id) });
    res.json({ success: true, data });
  } catch (error) {
    console.error(`Erreur chargement ${req.params.collection}/${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST créer une donnée
app.post('/api/admin/:collection', authenticateAdmin, async (req, res) => {
  try {
    const { collection } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    const result = await db.collection(collection).insertOne({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true
    });
    res.json({ success: true, data: result.insertedId });
  } catch (error) {
    console.error(`Erreur création ${req.params.collection}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT modifier une donnée
app.put('/api/admin/:collection/:id', authenticateAdmin, async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    await db.collection(collection).updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error(`Erreur modification ${req.params.collection}/${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE supprimer une donnée
app.delete('/api/admin/:collection/:id', authenticateAdmin, async (req, res) => {
  try {
    const { collection, id } = req.params;

    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }

    await db.collection(collection).deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true });
  } catch (error) {
    console.error(`Erreur suppression ${req.params.collection}/${req.params.id}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// ============================================================
// ROUTES PHARMACIEN - MESSAGES AVEC L'ORDRE
// ============================================================

// POST message vers l'Ordre depuis l'espace pharmacien
app.post('/api/pharmacien/messages', authenticatePharmacien, async (req, res) => {
  try {
    const { sujet, message } = req.body;

    if (!sujet || !message) {
      return res.status(400).json({ success: false, error: 'Sujet et message requis' });
    }

    const pharmacienId =
      (() => { try { return new ObjectId(req.pharmacienId); } catch { return req.pharmacienId; } })();

    const user = await db.collection('users').findOne({ _id: new ObjectId(req.pharmacienId) });

    const doc = {
      name: user?.username || 'Pharmacien',
      email: user?.email || '',
      phone: user?.telephone || '',
      subject: sujet,
      message,
      source: 'pharmacien',
      pharmacienId,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('contact_messages').insertOne(doc);

    res.json({ success: true, data: { _id: result.insertedId, ...doc } });
  } catch (error) {
    console.error('[backend_pharmacie] Erreur envoi message pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET liste des messages envoyés par un pharmacien (avec éventuelle réponse de l'Ordre)
app.get('/api/pharmacien/messages', authenticatePharmacien, async (req, res) => {
  try {
    const pharmacienFilter = {
      $in: [
        req.pharmacienId,
        (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
      ].filter(Boolean)
    };

    const messages = await db.collection('contact_messages')
      .find({ source: 'pharmacien', pharmacienId: pharmacienFilter })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('[backend_pharmacie] Erreur chargement messages pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Route de healthcheck simple pour Railway / monitoring
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend_pharmacie',
    mongoConnected: !!db
  });
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 backend_pharmacie démarré sur le port ${PORT}`);
});


