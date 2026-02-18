/**
 * Script de test pour insérer des données fictives via l'API admin
 * Teste l'insertion pour chaque collection Resources
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'your-admin-token-here'; // À configurer dans backend-config.env

// Données de test pour chaque collection
const testData = {
  actualites: {
    title: 'Test Actualité - Nouveau protocole de sécurité',
    excerpt: 'Ceci est une actualité de test pour vérifier le fonctionnement de l\'espace admin.',
    content: '<p>Contenu de test pour l\'actualité. Cette actualité a été créée automatiquement par le script de test.</p><p>Elle permet de vérifier que l\'espace admin fonctionne correctement pour la gestion des actualités.</p>',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
    category: 'actualites',
    pole: 'Général',
    date: new Date().toISOString().split('T')[0],
    publishedAt: new Date().toISOString(),
    readTime: 5,
    tags: ['test', 'admin', 'sécurité'],
    featured: true,
    author: {
      name: 'Admin Test',
      role: 'Équipe Technique'
    },
    isActive: true,
    order: 1
  },

  articles: {
    title: 'Test Article - Recherche pharmaceutique',
    excerpt: 'Article de test pour vérifier le fonctionnement de l\'espace admin.',
    content: '<p>Contenu de test pour l\'article. Cet article a été créé automatiquement par le script de test.</p>',
    authors: ['Dr. Test'],
    abstract: 'Résumé de test pour l\'article de recherche.',
    journal: 'Revue Test',
    year: 2024,
    keywords: ['test', 'recherche', 'pharmacie'],
    category: 'Recherche',
    downloads: 0,
    citations: 0,
    featured: false,
    language: 'fr',
    publicationType: 'article',
    isActive: true,
    order: 1
  },

  communiques: {
    title: 'Test Communiqué - Information importante',
    reference: 'CP-TEST-001',
    date: new Date().toISOString().split('T')[0],
    type: 'presse',
    category: 'Information',
    excerpt: 'Communiqué de test pour vérifier le fonctionnement de l\'espace admin.',
    content: '<p>Contenu de test pour le communiqué. Ce communiqué a été créé automatiquement par le script de test.</p>',
    urgent: false,
    featured: false,
    isActive: true,
    order: 1
  },

  decisions: {
    title: 'Test Décision - Décision administrative',
    reference: 'DEC-TEST-001',
    date: new Date().toISOString().split('T')[0],
    jurisdiction: 'Conseil National',
    category: 'Administratif',
    summary: 'Décision de test pour vérifier le fonctionnement de l\'espace admin.',
    decision: 'favorable',
    parties: ['Partie 1', 'Partie 2'],
    keywords: ['test', 'décision'],
    downloads: 0,
    citations: 0,
    featured: false,
    isActive: true,
    order: 1
  },

  decrets: {
    title: 'Test Décret - Décret administratif',
    number: 'TEST-001',
    publicationDate: new Date().toISOString().split('T')[0],
    entryDate: new Date().toISOString().split('T')[0],
    ministry: 'Ministère Test',
    category: 'Réglementation',
    summary: 'Décret de test pour vérifier le fonctionnement de l\'espace admin.',
    keyArticles: ['Article 1', 'Article 2'],
    tags: ['test', 'décret'],
    status: 'active',
    downloads: 0,
    views: 0,
    featured: false,
    language: 'fr',
    isActive: true,
    order: 1
  },

  lois: {
    title: 'Test Loi - Loi administrative',
    number: 'TEST-001',
    publicationDate: new Date().toISOString().split('T')[0],
    entryDate: new Date().toISOString().split('T')[0],
    category: 'Législation',
    summary: 'Loi de test pour vérifier le fonctionnement de l\'espace admin.',
    tableOfContents: [
      { title: 'Titre I', articles: ['Article 1'] }
    ],
    keyArticles: ['Article 1'],
    tags: ['test', 'loi'],
    status: 'active',
    downloads: 0,
    views: 0,
    featured: false,
    language: 'fr',
    isActive: true,
    order: 1
  },

  commissions: {
    title: 'Test Commission - Commission de test',
    name: 'Commission de Test',
    description: 'Commission de test pour vérifier le fonctionnement de l\'espace admin.',
    president: 'Dr. Test',
    members: ['Membre 1', 'Membre 2'],
    creationDate: new Date().toISOString().split('T')[0],
    category: 'Général',
    missions: ['Mission 1', 'Mission 2'],
    meetings: 0,
    reports: 0,
    status: 'active',
    featured: false,
    isActive: true,
    order: 1
  },

  theses: {
    title: 'Test Thèse - Thèse de recherche',
    author: 'Dr. Test',
    director: 'Pr. Test',
    university: 'Université Test',
    faculty: 'Faculté Test',
    department: 'Département Test',
    degree: 'phd',
    year: 2024,
    abstract: 'Résumé de test pour la thèse.',
    keywords: ['test', 'thèse', 'recherche'],
    pages: 100,
    language: 'fr',
    specialty: 'Pharmacie',
    defenseDate: new Date().toISOString().split('T')[0],
    juryMembers: ['Jury 1', 'Jury 2'],
    downloads: 0,
    citations: 0,
    featured: false,
    isActive: true,
    order: 1
  },

  photos: {
    title: 'Test Photo - Photo de test',
    description: 'Photo de test pour vérifier le fonctionnement de l\'espace admin.',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&h=400&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop',
    album: 'Album Test',
    date: new Date().toISOString().split('T')[0],
    tags: ['test', 'photo'],
    category: 'Événements',
    photographer: 'Photographe Test',
    location: 'Lieu Test',
    downloads: 0,
    likes: 0,
    featured: false,
    orientation: 'landscape',
    colors: [],
    isActive: true,
    order: 1
  },

  videos: {
    title: 'Test Vidéo - Vidéo de test',
    description: 'Vidéo de test pour vérifier le fonctionnement de l\'espace admin.',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    youtubeId: 'dQw4w9WgXcQ',
    duration: '10:00',
    views: 0,
    likes: 0,
    publishedDate: new Date().toISOString().split('T')[0],
    category: 'Test',
    speaker: 'Orateur Test',
    event: 'Événement Test',
    tags: ['test', 'vidéo'],
    featured: false,
    isActive: true,
    order: 1
  }
};

async function insertTestData(collection, data) {
  try {
    console.log(`\n📝 Insertion test pour: ${collection}`);
    const response = await axios.post(
      `${API_URL}/admin/${collection}`,
      data,
      {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ ${collection}: Donnée insérée avec succès (ID: ${response.data.data})`);
      return true;
    } else {
      console.error(`❌ ${collection}: Erreur - ${response.data.error}`);
      return false;
    }
  } catch (error) {
    if (error.response) {
      console.error(`❌ ${collection}: Erreur ${error.response.status} - ${error.response.data.error || error.message}`);
    } else {
      console.error(`❌ ${collection}: Erreur - ${error.message}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests d\'insertion via l\'API admin\n');
  console.log(`📍 URL API: ${API_URL}`);
  console.log(`🔑 Token Admin: ${ADMIN_TOKEN.substring(0, 10)}...\n`);

  const collections = [
    'actualites', 'articles', 'communiques', 'decisions',
    'decrets', 'lois', 'commissions', 'theses', 'photos'
  ];

  let successCount = 0;
  let failCount = 0;

  // Insérer une donnée pour chaque collection (sauf videos)
  for (const collection of collections) {
    const result = await insertTestData(collection, testData[collection]);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    // Petit délai entre les requêtes
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Pour videos, insérer plusieurs vidéos de test
  console.log(`\n📹 Insertion de 3 vidéos de test...`);
  for (let i = 1; i <= 3; i++) {
    const videoData = {
      ...testData.videos,
      title: `Test Vidéo ${i}`,
      order: i
    };
    const result = await insertTestData('videos', videoData);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Résumé des tests:');
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Échecs: ${failCount}`);
  console.log('='.repeat(50));

  if (failCount === 0) {
    console.log('\n🎉 Tous les tests sont passés avec succès !');
    process.exit(0);
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Vérifier que le backend est accessible
async function checkBackend() {
  try {
    const response = await axios.get(`${API_URL.replace('/api', '')}/health`, { timeout: 2000 });
    return true;
  } catch (error) {
    try {
      // Essayer de se connecter à l'API directement
      const response = await axios.get(`${API_URL}/public/actualites`, { timeout: 2000 });
      return true;
    } catch (e) {
      console.error('❌ Impossible de se connecter au backend.');
      console.error('   Assurez-vous que le backend est démarré sur le port 3001');
      console.error('   Commande: cd backend && npm run dev');
      return false;
    }
  }
}

// Exécution
(async () => {
  console.log('🔍 Vérification de la connexion au backend...');
  const backendAvailable = await checkBackend();
  
  if (!backendAvailable) {
    process.exit(1);
  }

  await runTests();
})();

