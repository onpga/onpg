/**
 * Serveur Express pour l'API ONPG
 */

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend-config.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// URI MongoDB forcée en dur (Railway)
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

// Middleware CORS - Autoriser toutes les origines (production et développement)
app.use(cors({
  origin: true, // Autoriser toutes les origines
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let db;

// Connexion MongoDB
MongoClient.connect(MONGODB_URI)
  .then(client => {
    console.log('✅ Connecté à MongoDB');
    db = client.db(DB_NAME);
  })
  .catch(error => {
    console.error('❌ Erreur connexion MongoDB:', error);
    process.exit(1);
  });

// Collections disponibles (chaque page a sa propre collection)
const RESOURCE_COLLECTIONS = [
  'actualites', 'articles', 'communiques', 'decisions', 
  'decrets', 'lois', 'commissions', 'theses', 'photos', 'videos', 'pharmaciens'
];

// Authentification admin par token (simple)
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: 'Non autorisé' });
  }
  next();
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
    
    console.log(`🔍 Recherche ${collection} avec ID: ${id}`);
    const data = await db.collection(collection).findOne({ _id: new ObjectId(id), isActive: true });
    console.log(`📦 Données trouvées:`, data ? 'Oui' : 'Non');
    res.json({ success: true, data });
  } catch (error) {
    console.error(`Erreur chargement ${collection}/${id}:`, error);
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

    const data = await db.collection(collection)
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
    
    const data = await db.collection(collection)
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
    console.error(`Erreur chargement ${collection}/${id}:`, error);
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
    console.error(`Erreur création ${collection}:`, error);
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
    console.error(`Erreur modification ${collection}/${id}:`, error);
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
    console.error(`Erreur suppression ${collection}/${id}:`, error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});
