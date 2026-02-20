/**
 * Serveur Express pour l'API ONPG
 */

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend-config.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// URI MongoDB forcée en dur (Railway)
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

// Middleware CORS très permissif - en-têtes ajoutés manuellement
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
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
  'decrets', 'lois', 'commissions', 'theses', 'photos', 'videos', 'pharmaciens',
  'formations', 'deontologie'
];

// Authentification admin par token (simple)
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, error: 'Non autorisé' });
  }
  next();
};

// Authentification pharmacien (vérifie le rôle et le token)
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
    console.error('Erreur authentification pharmacien:', error);
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

    // Retourner le token admin actuel pour les routes /api/admin/* ou /api/pharmacien/*
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

// ============================================
// ROUTE SPÉCIFIQUE POUR LES PHARMACIES (DOIT ÊTRE AVANT /api/public/:collection)
// ============================================
// GET toutes les pharmacies publiques (avec filtres et géolocalisation)
app.get('/api/public/pharmacies', async (req, res) => {
  try {
    const { ville, quartier, latitude, longitude, search, garde } = req.query;
    
    let query = { isActive: true };
    
    if (ville) {
      query.ville = new RegExp(ville, 'i');
    }
    
    if (quartier) {
      query.quartier = new RegExp(quartier, 'i');
    }
    
    if (garde === 'true') {
      query.garde = true;
    }
    
    if (search) {
      query.$or = [
        { nom: new RegExp(search, 'i') },
        { ville: new RegExp(search, 'i') },
        { quartier: new RegExp(search, 'i') },
        { adresse: new RegExp(search, 'i') }
      ];
    }

    let pharmacies = await db.collection('pharmacies')
      .find(query)
      .toArray();

    // Filtrer les messages pour ne garder que ceux visibles aux visiteurs
    pharmacies = pharmacies.map(ph => ({
      ...ph,
      messages: (ph.messages || []).filter(m => m.visibleVisiteurs === true)
    }));

    // Si géolocalisation fournie, calculer les distances et trier
    if (latitude && longitude) {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      
      pharmacies = pharmacies
        .filter(p => p.latitude && p.longitude)
        .map(p => {
          const distance = calculateDistance(
            userLat,
            userLng,
            p.latitude,
            p.longitude
          );
          return { ...p, distance };
        })
        .sort((a, b) => a.distance - b.distance);
    } else {
      pharmacies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({ success: true, data: pharmacies });
  } catch (error) {
    console.error('Erreur chargement pharmacies publiques:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

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

// ============================================
// ROUTES PHARMACIEN (gestion de ses pharmacies)
// ============================================

// GET toutes les pharmacies d'un pharmacien
app.get('/api/pharmacien/pharmacies', authenticatePharmacien, async (req, res) => {
  try {
    const pharmacies = await db.collection('pharmacies')
      .find({ pharmacienId: req.pharmacienId, isActive: true })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: pharmacies });
  } catch (error) {
    console.error('Erreur chargement pharmacies pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET une pharmacie spécifique
app.get('/api/pharmacien/pharmacies/:id', authenticatePharmacien, async (req, res) => {
  try {
    const pharmacie = await db.collection('pharmacies').findOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: req.pharmacienId
    });
    if (!pharmacie) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }
    res.json({ success: true, data: pharmacie });
  } catch (error) {
    console.error('Erreur chargement pharmacie:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST créer une nouvelle pharmacie
app.post('/api/pharmacien/pharmacies', authenticatePharmacien, async (req, res) => {
  try {
    const { nom, ville, quartier, adresse, photo, latitude, longitude, telephone, email, horaires, garde } = req.body;
    
    if (!nom || !ville || !adresse) {
      return res.status(400).json({ success: false, error: 'Nom, ville et adresse requis' });
    }

    const result = await db.collection('pharmacies').insertOne({
      nom,
      ville,
      quartier: quartier || '',
      adresse,
      photo: photo || '',
      location: latitude && longitude ? {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      } : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      telephone: telephone || '',
      email: email || '',
      horaires: horaires || {},
      garde: garde === true || garde === 'true',
      pharmacienId: req.pharmacienId,
      messages: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ success: true, data: result.insertedId });
  } catch (error) {
    console.error('Erreur création pharmacie:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT modifier une pharmacie
app.put('/api/pharmacien/pharmacies/:id', authenticatePharmacien, async (req, res) => {
  try {
    const { nom, ville, quartier, adresse, photo, latitude, longitude, telephone, email, horaires, garde } = req.body;
    
    // Vérifier que la pharmacie appartient au pharmacien
    const existing = await db.collection('pharmacies').findOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: req.pharmacienId
    });
    
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }

    const updateData = {
      ...(nom && { nom }),
      ...(ville && { ville }),
      ...(quartier !== undefined && { quartier }),
      ...(adresse && { adresse }),
      ...(photo !== undefined && { photo }),
      ...(latitude && longitude && {
        location: {
          type: 'Point',
          coordinates: [parseFloat(longitude), parseFloat(latitude)]
        },
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }),
      ...(telephone !== undefined && { telephone }),
      ...(email !== undefined && { email }),
      ...(horaires && { horaires }),
      ...(garde !== undefined && { garde: garde === true || garde === 'true' }),
      updatedAt: new Date()
    };

    await db.collection('pharmacies').updateOne(
      { _id: new ObjectId(req.params.id), pharmacienId: req.pharmacienId },
      { $set: updateData }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur modification pharmacie:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE supprimer une pharmacie
app.delete('/api/pharmacien/pharmacies/:id', authenticatePharmacien, async (req, res) => {
  try {
    const result = await db.collection('pharmacies').deleteOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: req.pharmacienId
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression pharmacie:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST ajouter un message/alerte à une pharmacie
app.post('/api/pharmacien/pharmacies/:id/messages', authenticatePharmacien, async (req, res) => {
  try {
    const { type, titre, contenu, visibleVisiteurs, visibleOrdre } = req.body;
    
    if (!type || !titre || !contenu) {
      return res.status(400).json({ success: false, error: 'Type, titre et contenu requis' });
    }

    // Vérifier que la pharmacie appartient au pharmacien
    const pharmacie = await db.collection('pharmacies').findOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: req.pharmacienId
    });
    
    if (!pharmacie) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }

    const message = {
      _id: new ObjectId(),
      type, // 'visiteur', 'ordre', 'autre'
      titre,
      contenu,
      visibleVisiteurs: visibleVisiteurs !== undefined ? visibleVisiteurs : type === 'visiteur',
      visibleOrdre: visibleOrdre !== undefined ? visibleOrdre : type === 'ordre',
      createdAt: new Date()
    };

    await db.collection('pharmacies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { messages: message }, $set: { updatedAt: new Date() } }
    );

    res.json({ success: true, data: message });
  } catch (error) {
    console.error('Erreur ajout message:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE supprimer un message
app.delete('/api/pharmacien/pharmacies/:id/messages/:messageId', authenticatePharmacien, async (req, res) => {
  try {
    const pharmacie = await db.collection('pharmacies').findOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: req.pharmacienId
    });
    
    if (!pharmacie) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }

    await db.collection('pharmacies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $pull: { messages: { _id: new ObjectId(req.params.messageId) } },
        $set: { updatedAt: new Date() }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Fonction pour calculer la distance entre deux points (formule Haversine)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance en mètres
}

// ============================================
// ROUTES ADMIN (pour associer pharmacies aux pharmaciens)
// ============================================

// GET toutes les pharmacies (admin)
app.get('/api/admin/pharmacies', authenticateAdmin, async (req, res) => {
  try {
    const pharmacies = await db.collection('pharmacies')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, data: pharmacies });
  } catch (error) {
    console.error('Erreur chargement pharmacies admin:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT associer une pharmacie à un pharmacien (admin)
app.put('/api/admin/pharmacies/:id/pharmacien', authenticateAdmin, async (req, res) => {
  try {
    const { pharmacienId } = req.body;
    
    if (!pharmacienId) {
      return res.status(400).json({ success: false, error: 'pharmacienId requis' });
    }

    await db.collection('pharmacies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { pharmacienId: new ObjectId(pharmacienId), updatedAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur association pharmacie:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
});
