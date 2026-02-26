/**
 * Serveur Express pour l'API ONPG
 */

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuration multer pour les uploads de fichiers
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 } // 20 Mo max
});

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
  'deontologie',
  'pharmacies' // permet aussi de gérer les pharmacies via les routes génériques admin
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
        role: user.role,
        nom: user.nom || null,
        prenoms: user.prenoms || null
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

// ============================================
// FORMULAIRE DE CONTACT PUBLIC
// ============================================

// POST /api/public/contact - enregistrement d'un message de contact simple
app.post('/api/public/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ success: false, error: 'Nom, email, sujet et message sont requis' });
    }

    const doc = {
      name,
      email,
      phone: phone || '',
      subject,
      message,
      source: 'site-public',
      status: 'new', // new, read, archived
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('contact_messages').insertOne(doc);

    res.json({ success: true, data: { _id: result.insertedId, ...doc } });
  } catch (error) {
    console.error('Erreur enregistrement message de contact:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET une donnée spécifique par ID (route publique) - DOIT ÊTRE AVANT /api/public/:collection
app.get('/api/public/:collection/:id', async (req, res) => {
  try {
    const { collection, id } = req.params;

    // Cas particulier pour les thèses : on lit dans la collection pharmacien_theses
    if (collection === 'theses') {
      try {
        const thesis = await db.collection('pharmacien_theses').findOne({ _id: new ObjectId(id) });
        if (!thesis) {
          return res.json({ success: true, data: null });
        }

        // Récupérer les infos du pharmacien auteur
        let author = 'Pharmacien';
        try {
          const pharmacien = await db.collection('users').findOne({ _id: thesis.pharmacienId });
          if (pharmacien) {
            const prenoms = pharmacien.prenoms || '';
            const nom = pharmacien.nom || '';
            author = (prenoms || nom) ? `${prenoms} ${nom}`.trim() : (pharmacien.username || 'Pharmacien');
          }
        } catch {
          // En cas d'erreur, on garde l'auteur par défaut
        }

        const mapped = {
          _id: thesis._id,
          title: thesis.titre || '',
          author,
          abstract: thesis.resume || '',
          year: thesis.annee || '',
          pdfUrl: thesis.fichierUrl || ''
        };

        return res.json({ success: true, data: mapped });
      } catch (err) {
        console.error(`Erreur chargement thèse publique/${id}:`, err);
        return res.status(500).json({ success: false, error: 'Erreur serveur' });
      }
    }
    
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

// Route publique pour récupérer les paramètres du site (photos d'accueil)
app.get('/api/public/site-settings', async (req, res) => {
  try {
    const settings = await db.collection('site_settings').findOne({ _id: 'main' });
    res.json({ 
      success: true, 
      data: settings || { 
        presidentPhoto: '', 
        heroImage: '' 
      } 
    });
  } catch (error) {
    console.error('Erreur chargement site-settings:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Routes publiques pour récupérer TOUTES les données actives d'une collection
app.get('/api/public/:collection', async (req, res) => {
  try {
    const { collection } = req.params;

    // Cas particulier pour les thèses publiques : on expose les thèses des pharmaciens
    if (collection === 'theses') {
      try {
        const theses = await db.collection('pharmacien_theses')
          .find({})
          .sort({ createdAt: -1 })
          .toArray();

        const pharmacienIds = [
          ...new Set(
            theses
              .map(t => t.pharmacienId)
              .filter(Boolean)
              .map(id => String(id))
          )
        ];

        let usersById = new Map();
        if (pharmacienIds.length > 0) {
          const objectIds = pharmacienIds.map(id => {
            try {
              return new ObjectId(id);
            } catch {
              return null;
            }
          }).filter(Boolean);

          const users = await db.collection('users')
            .find({ _id: { $in: objectIds } })
            .toArray();

          usersById = new Map(users.map(u => [String(u._id), u]));
        }

        const data = theses.map(t => {
          const user = usersById.get(String(t.pharmacienId));
          let author = 'Pharmacien';
          if (user) {
            const prenoms = user.prenoms || '';
            const nom = user.nom || '';
            author = (prenoms || nom) ? `${prenoms} ${nom}`.trim() : (user.username || 'Pharmacien');
          }

          const currentYear = new Date().getFullYear();
          const parsedYear = t.annee ? parseInt(String(t.annee), 10) : currentYear;
          
          // Convertir mots-clés string en array si nécessaire
          let keywords = [];
          if (t.motsCles) {
            keywords = typeof t.motsCles === 'string' 
              ? t.motsCles.split(',').map(k => k.trim()).filter(k => k)
              : Array.isArray(t.motsCles) ? t.motsCles : [];
          }

          return {
            _id: t._id,
            title: t.titre || '',
            author,
            director: t.directeur || '',
            university: t.universite || '',
            faculty: '',
            department: '',
            degree: 'phd',
            year: Number.isNaN(parsedYear) ? currentYear : parsedYear,
            abstract: t.resume || '',
            keywords: keywords,
            pages: 0,
            language: 'fr',
            specialty: 'Pharmacie',
            defenseDate: '', // Ne pas mettre de date si on a juste l'année
            juryMembers: [],
            downloads: 0,
            citations: 0,
            featured: false,
            pdfUrl: t.fichierUrl || ''
          };
        });

        return res.json({ success: true, data });
      } catch (err) {
        console.error('Erreur chargement thèses publiques:', err);
        return res.status(500).json({ success: false, error: 'Erreur serveur' });
      }
    }
    
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

// ============================================
// ADMIN - MESSAGES DE CONTACT
// ============================================

// Liste des messages de contact récents
app.get('/api/admin/contact-messages', authenticateAdmin, async (req, res) => {
  try {
    const data = await db
      .collection('contact_messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    res.json({ success: true, data });
  } catch (error) {
    console.error('Erreur chargement contact_messages:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'un message de contact (new, read, archived)
app.put('/api/admin/contact-messages/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['new', 'read', 'archived'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }

    const result = await db.collection('contact_messages').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour statut message de contact:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Routes admin pour gérer les collections

// GET toutes les données d'une collection
app.get('/api/admin/:collection', authenticateAdmin, async (req, res) => {
  try {
    const { collection } = req.params;
    
    // Cas très spécifique : paramètres du site (photos d'accueil)
    // Cette "collection" n'est pas une vraie collection déclarée dans RESOURCE_COLLECTIONS
    // mais un document unique dans site_settings avec _id = 'main'.
    if (collection === 'site-settings') {
      try {
        const settings = await db.collection('site_settings').findOne({ _id: 'main' });
        return res.json({
          success: true,
          data: settings || {
            presidentPhoto: '',
            heroImage: ''
          }
        });
      } catch (err) {
        console.error('Erreur chargement admin site-settings via route générique:', err);
        return res.status(500).json({ success: false, error: 'Erreur serveur' });
      }
    }
    
    if (!RESOURCE_COLLECTIONS.includes(collection)) {
      return res.status(400).json({ success: false, error: 'Collection invalide' });
    }
    
    // Cas particulier pour les thèses : on lit depuis pharmacien_theses
    // et on enrichit avec le nom/prénom du pharmacien auteur
    if (collection === 'theses') {
      const theses = await db.collection('pharmacien_theses')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      const pharmacienIds = [
        ...new Set(
          theses
            .map(t => t.pharmacienId)
            .filter(Boolean)
            .map(id => String(id))
        )
      ];

      let usersById = new Map();
      if (pharmacienIds.length > 0) {
        const objectIds = pharmacienIds.map(id => {
          try {
            return new ObjectId(id);
          } catch {
            return null;
          }
        }).filter(Boolean);

        const users = await db.collection('users')
          .find({ _id: { $in: objectIds } })
          .toArray();

        usersById = new Map(users.map(u => [String(u._id), u]));
      }

      const data = theses.map(t => {
        const user = usersById.get(String(t.pharmacienId));
        let pharmacienNomComplet = 'Pharmacien';
        if (user) {
          const prenoms = user.prenoms || '';
          const nom = user.nom || '';
          pharmacienNomComplet = (prenoms || nom)
            ? `${prenoms} ${nom}`.trim()
            : (user.username || 'Pharmacien');
        }

        return {
          ...t,
          pharmacienNomComplet
        };
      });

      return res.json({ success: true, data });
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

// ============================================
// ADMIN - MESSAGES DE CONTACT
// ============================================

// Liste des messages de contact récents
app.get('/api/admin/contact-messages', authenticateAdmin, async (req, res) => {
  try {
    const data = await db
      .collection('contact_messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    res.json({ success: true, data });
  } catch (error) {
    console.error('Erreur chargement contact_messages:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'un message de contact (new, read, archived)
app.put('/api/admin/contact-messages/:id/status', authenticateAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['new', 'read', 'archived'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Statut invalide' });
    }

    const result = await db.collection('contact_messages').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour statut message de contact:', error);
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
      .find({ 
        pharmacienId: { 
          $in: [
            req.pharmacienId, 
            (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
          ].filter(Boolean)
        }, 
        isActive: true 
      })
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
      pharmacienId: (() => { 
        try { 
          return new ObjectId(req.pharmacienId); 
        } catch { 
          return req.pharmacienId; 
        } 
      })(),
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
      pharmacienId: { 
        $in: [
          req.pharmacienId, 
          (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
        ].filter(Boolean)
      }
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
      { 
        _id: new ObjectId(req.params.id), 
        pharmacienId: { 
          $in: [
            req.pharmacienId, 
            (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
          ].filter(Boolean)
        }
      },
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
      pharmacienId: { 
        $in: [
          req.pharmacienId, 
          (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
        ].filter(Boolean)
      }
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
      pharmacienId: { 
        $in: [
          req.pharmacienId, 
          (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
        ].filter(Boolean)
      }
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
      pharmacienId: { 
        $in: [
          req.pharmacienId, 
          (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
        ].filter(Boolean)
      }
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

// PUT mettre à jour le profil pharmacien
app.put('/api/pharmacien/profile', authenticatePharmacien, async (req, res) => {
  try {
    const { email, telephone, adresse, photo } = req.body;
    
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (telephone !== undefined) updateData.telephone = telephone;
    if (adresse !== undefined) updateData.adresse = adresse;
    if (photo !== undefined) updateData.photo = photo;
    
    updateData.updatedAt = new Date();

    await db.collection('users').updateOne(
      { _id: new ObjectId(req.pharmacienId) },
      { $set: updateData }
    );

    // Mettre à jour aussi dans la collection pharmaciens si elle existe
    await db.collection('pharmaciens').updateOne(
      { _id: new ObjectId(req.pharmacienId) },
      { $set: { ...updateData, photo: photo || updateData.photo } },
      { upsert: false }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour profil pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT mettre à jour le mot de passe du pharmacien
app.put('/api/pharmacien/password', authenticatePharmacien, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Mot de passe actuel et nouveau mot de passe requis' });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(req.pharmacienId), isActive: true });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Mot de passe actuel incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection('users').updateOne(
      { _id: new ObjectId(req.pharmacienId) },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour mot de passe pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// GET mini tableau de bord pharmacien (stats)
app.get('/api/pharmacien/stats', authenticatePharmacien, async (req, res) => {
  try {
    const pharmacienFilter = {
      $in: [
        req.pharmacienId,
        (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
      ].filter(Boolean)
    };

    const [pharmaciesCount, thesesCount, messagesCount] = await Promise.all([
      db.collection('pharmacies').countDocuments({ pharmacienId: pharmacienFilter, isActive: true }),
      db.collection('pharmacien_theses').countDocuments({ pharmacienId: pharmacienFilter }),
      db.collection('contact_messages').countDocuments({ source: 'pharmacien', pharmacienId: pharmacienFilter })
    ]);

    res.json({
      success: true,
      data: {
        totalPharmacies: pharmaciesCount,
        totalTheses: thesesCount,
        totalMessages: messagesCount
      }
    });
  } catch (error) {
    console.error('Erreur chargement stats pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST upload PDF thèse - SIMPLE : reçoit le fichier, upload vers Cloudinary, retourne l'URL
app.post('/api/pharmacien/theses/upload-pdf', authenticatePharmacien, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Fichier PDF requis' });
    }

    // Vérifier que c'est un PDF
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ success: false, error: 'Le fichier doit être un PDF' });
    }

    // Ancien comportement : on renvoie toujours un data:URL base64
    // pour garantir la compatibilité même si Cloudinary pose problème.
    console.log('[UPLOAD PDF] 📦 MODE BASE64 UNIQUEMENT (sans Cloudinary)');
    console.log('[UPLOAD PDF] 📋 Informations fichier:', {
      fileNameOriginal: req.file.originalname,
      fileSize: `${(req.file.size / 1024 / 1024).toFixed(2)} Mo`,
      mimeType: req.file.mimetype,
      bufferLength: req.file.buffer.length
    });

    // Génération de l'URL base64
    const base64Data = req.file.buffer.toString('base64');
    const base64Size = (base64Data.length / 1024 / 1024).toFixed(2);
    console.log('[UPLOAD PDF] 📊 Taille base64:', `${base64Size} Mo`);
    const dataUrl = `data:application/pdf;base64,${base64Data}`;
    console.log('[UPLOAD PDF] ✅ Base64 généré avec succès');
    console.log('[UPLOAD PDF] ============================================');
    
    return res.json({ 
      success: true, 
      url: dataUrl,
      method: 'base64'
    });
  } catch (error) {
    console.error('[UPLOAD PDF] ❌ Erreur:', error.message);
    res.status(500).json({ success: false, error: error.message || 'Erreur serveur' });
  }
});

// Routes thèses pharmacien
app.get('/api/pharmacien/theses', authenticatePharmacien, async (req, res) => {
  try {
    const theses = await db.collection('pharmacien_theses')
      .find({
        pharmacienId: {
          $in: [
            req.pharmacienId,
            (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
          ].filter(Boolean)
        }
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({ success: true, data: theses });
  } catch (error) {
    console.error('Erreur chargement thèses pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

app.post('/api/pharmacien/theses', authenticatePharmacien, async (req, res) => {
  try {
    const { titre, resume, annee, universite, motsCles, directeur, fichierUrl } = req.body;

    if (!fichierUrl || !titre || !annee || !universite) {
      return res.status(400).json({ success: false, error: 'Titre, année, université et fichier PDF requis' });
    }

    const pharmacienId =
      (() => { try { return new ObjectId(req.pharmacienId); } catch { return req.pharmacienId; } })();

    // Récupérer les infos du pharmacien
    const pharmacien = await db.collection('users').findOne({ _id: new ObjectId(req.pharmacienId) });

    const doc = {
      pharmacienId,
      titre,
      resume: resume || '',
      annee,
      universite,
      directeur: directeur || '',
      motsCles: motsCles || '',
      fichierUrl,
      pharmacienNom: pharmacien?.nom || '',
      pharmacienPrenoms: pharmacien?.prenoms || '',
      pharmacienUsername: pharmacien?.username || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('pharmacien_theses').insertOne(doc);

    res.json({ success: true, data: { _id: result.insertedId, ...doc } });
  } catch (error) {
    console.error('Erreur création thèse pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

app.delete('/api/pharmacien/theses/:id', authenticatePharmacien, async (req, res) => {
  try {
    const result = await db.collection('pharmacien_theses').deleteOne({
      _id: new ObjectId(req.params.id),
      pharmacienId: {
        $in: [
          req.pharmacienId,
          (() => { try { return new ObjectId(req.pharmacienId); } catch { return null; } })()
        ].filter(Boolean)
      }
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Thèse non trouvée' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression thèse pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

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
    console.error('Erreur envoi message pharmacien:', error);
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
    console.error('Erreur chargement messages pharmacien:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// POST réponse de l'Ordre à un message de contact (admin)
app.post('/api/admin/contact-messages/:id/reply', authenticateAdmin, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ success: false, error: 'Réponse requise' });
    }

    const messageId = req.params.id;

    const result = await db.collection('contact_messages').updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          reply,
          replyAt: new Date(),
          replyBy: 'ordre',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Message non trouvé' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur enregistrement réponse message:', error);
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

// POST créer une nouvelle pharmacie (admin)
app.post('/api/admin/pharmacies', authenticateAdmin, async (req, res) => {
  try {
    const {
      nom,
      ville,
      quartier,
      adresse,
      photo,
      latitude,
      longitude,
      telephone,
      email,
      horaires,
      garde,
      pharmacienId
    } = req.body;

    if (!nom || !ville || !adresse) {
      return res.status(400).json({ success: false, error: 'Nom, ville et adresse requis' });
    }

    const doc = {
      nom,
      ville,
      quartier: quartier || '',
      adresse,
      photo: photo || '',
      location:
        latitude && longitude
          ? {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
          : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      telephone: telephone || '',
      email: email || '',
      horaires: horaires || {},
      garde: garde === true || garde === 'true',
      pharmacienId: pharmacienId
        ? (() => {
            try {
              return new ObjectId(pharmacienId);
            } catch {
              return pharmacienId;
            }
          })()
        : null,
      messages: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('pharmacies').insertOne(doc);
    res.json({ success: true, data: { _id: result.insertedId, ...doc } });
  } catch (error) {
    console.error('Erreur création pharmacie admin:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT modifier une pharmacie (admin)
app.put('/api/admin/pharmacies/:id', authenticateAdmin, async (req, res) => {
  try {
    const {
      nom,
      ville,
      quartier,
      adresse,
      photo,
      latitude,
      longitude,
      telephone,
      email,
      horaires,
      garde,
      pharmacienId
    } = req.body;

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

    if (pharmacienId !== undefined) {
      updateData.pharmacienId = pharmacienId
        ? (() => {
            try {
              return new ObjectId(pharmacienId);
            } catch {
              return pharmacienId;
            }
          })()
        : null;
    }

    await db.collection('pharmacies').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur modification pharmacie admin:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// DELETE supprimer une pharmacie (admin)
app.delete('/api/admin/pharmacies/:id', authenticateAdmin, async (req, res) => {
  try {
    const result = await db.collection('pharmacies').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Pharmacie non trouvée' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur suppression pharmacie admin:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT associer une pharmacie à un pharmacien (admin) - raccourci dédié
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

// ============================================
// ROUTES ADMIN - PARAMÈTRES DU SITE
// ============================================

// GET paramètres du site (photos d'accueil)
app.get('/api/admin/site-settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await db.collection('site_settings').findOne({ _id: 'main' });
    res.json({ 
      success: true, 
      data: settings || { 
        presidentPhoto: '', 
        heroImage: '' 
      } 
    });
  } catch (error) {
    console.error('Erreur chargement site-settings:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// PUT mettre à jour les paramètres du site
app.put('/api/admin/site-settings', authenticateAdmin, async (req, res) => {
  try {
    const { presidentPhoto, heroImage } = req.body;
    
    await db.collection('site_settings').updateOne(
      { _id: 'main' },
      { 
        $set: { 
          presidentPhoto: presidentPhoto || '',
          heroImage: heroImage || '',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur sauvegarde site-settings:', error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

// Fonction pour vérifier/créer le preset Cloudinary
async function ensureCloudinaryPreset() {
  const CLOUDINARY_CLOUD_NAME = 'dduvinjnu';
  const CLOUDINARY_API_KEY = '311692364197472';
  const CLOUDINARY_API_SECRET = 'YlKz6EoFE2hiETe6hH3H2lTsvlk';
  const PRESET_NAME = 'onpg_uploads';

  try {
    const axios = require('axios');
    const crypto = require('crypto');
    
    // Vérifier si le preset existe en essayant de le lister
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash('sha1').update(paramsToSign).digest('hex');
    
    const listUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload_presets?api_key=${CLOUDINARY_API_KEY}&timestamp=${timestamp}&signature=${signature}`;
    
    try {
      const listRes = await axios.get(listUrl);
      const presets = listRes.data || [];
      const presetExists = presets.some(p => p.name === PRESET_NAME);
      
      if (presetExists) {
        console.log('✅ Preset Cloudinary existe déjà:', PRESET_NAME);
        return;
      }
    } catch (listError) {
      console.log('⚠️  Impossible de vérifier les presets (permissions insuffisantes)');
    }

    // Essayer de créer le preset
    const createTimestamp = Math.round(Date.now() / 1000);
    const createParams = {
      name: PRESET_NAME,
      unsigned: 'true',
      resource_type: 'raw',
      folder: '',
      timestamp: createTimestamp.toString()
    };
    
    const createSignatureString = Object.keys(createParams)
      .sort()
      .map(key => `${key}=${createParams[key]}`)
      .join('&') + CLOUDINARY_API_SECRET;
    
    const createSignature = crypto.createHash('sha1').update(createSignatureString).digest('hex');

    const formData = new (require('form-data'))();
    formData.append('name', PRESET_NAME);
    formData.append('unsigned', 'true');
    formData.append('resource_type', 'raw');
    formData.append('api_key', CLOUDINARY_API_KEY);
    formData.append('timestamp', createTimestamp.toString());
    formData.append('signature', createSignature);

    await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload_presets`,
      formData,
      { headers: formData.getHeaders() }
    );
    
    console.log('✅ Preset Cloudinary créé:', PRESET_NAME);
  } catch (error) {
    console.log('⚠️  Preset Cloudinary non créé automatiquement. Pour le créer manuellement:');
    console.log('   1. Va sur https://cloudinary.com/console');
    console.log('   2. Settings → Upload → Add upload preset');
    console.log('   3. Nom: onpg_uploads | Signing mode: Unsigned | Resource type: Raw');
    console.log('   Le fallback base64 fonctionne en attendant.');
  }
}

// Démarrage serveur
app.listen(PORT, async () => {
  console.log(`🚀 Serveur backend démarré sur le port ${PORT}`);
  // Créer le preset Cloudinary au démarrage
  await ensureCloudinaryPreset();
});
