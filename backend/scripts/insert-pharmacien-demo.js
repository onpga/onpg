/**
 * Script pour créer le compte pharmacien démo et insérer des pharmacies mock
 */

const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// URI MongoDB
const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';

// Données mock pour les pharmacies
const mockPharmacies = [
  {
    nom: 'Pharmacie Centrale de Libreville',
    ville: 'Libreville',
    quartier: 'Centre-ville',
    adresse: 'Boulevard du Bord de Mer, BP 1234',
    telephone: '+241 01 44 55 66',
    email: 'pharmacie.centrale@onpg.ga',
    photo: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
    latitude: 0.4162,
    longitude: 9.4673,
    horaires: {
      lundi: '8h-20h',
      mardi: '8h-20h',
      mercredi: '8h-20h',
      jeudi: '8h-20h',
      vendredi: '8h-20h',
      samedi: '8h-18h',
      dimanche: 'Fermé'
    },
    messages: [
      {
        _id: new ObjectId(),
        type: 'visiteur',
        titre: 'Rupture de stock Doliprane 1000mg',
        contenu: 'Nous sommes actuellement en rupture de stock pour le Doliprane 1000mg. Réapprovisionnement prévu dans 3 jours.',
        visibleVisiteurs: true,
        visibleOrdre: false,
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Pharmacie du Bien-être',
    ville: 'Libreville',
    quartier: 'Plateau',
    adresse: 'Avenue du Général de Gaulle, Immeuble ABC',
    telephone: '+241 01 77 88 99',
    email: 'bienetre@onpg.ga',
    photo: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop',
    latitude: 0.3901,
    longitude: 9.4544,
    horaires: {
      lundi: '8h-20h',
      mardi: '8h-20h',
      mercredi: '8h-20h',
      jeudi: '8h-20h',
      vendredi: '8h-20h',
      samedi: '8h-18h',
      dimanche: 'Fermé'
    },
    messages: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Pharmacie Moderne Port-Gentil',
    ville: 'Port-Gentil',
    quartier: 'Centre',
    adresse: 'Rue de la République, Quartier des Affaires',
    telephone: '+241 05 22 33 44',
    email: 'moderne.pg@onpg.ga',
    photo: 'https://images.unsplash.com/photo-1585435557343-3b092031e2bb?w=400&h=300&fit=crop',
    latitude: -0.7193,
    longitude: 8.7815,
    horaires: {
      lundi: '7h-22h',
      mardi: '7h-22h',
      mercredi: '7h-22h',
      jeudi: '7h-22h',
      vendredi: '7h-22h',
      samedi: '8h-20h',
      dimanche: '10h-18h'
    },
    messages: [
      {
        _id: new ObjectId(),
        type: 'ordre',
        titre: 'Risque d\'épidémie - Forte grippe observée',
        contenu: 'Nous observons une augmentation significative des cas de grippe dans notre zone. Recommandation de vigilance accrue.',
        visibleVisiteurs: false,
        visibleOrdre: true,
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Pharmacie Familiale Franceville',
    ville: 'Franceville',
    quartier: 'Centre-ville',
    adresse: 'Boulevard de la Paix, BP 567',
    telephone: '+241 04 11 22 33',
    email: 'familiale.fv@onpg.ga',
    photo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    latitude: -1.6333,
    longitude: 13.5833,
    horaires: {
      lundi: '7h-22h',
      mardi: '7h-22h',
      mercredi: '7h-22h',
      jeudi: '7h-22h',
      vendredi: '7h-22h',
      samedi: '8h-20h',
      dimanche: 'Fermé'
    },
    messages: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    nom: 'Pharmacie Express Owendo',
    ville: 'Owendo',
    quartier: 'Zone Industrielle',
    adresse: 'Route de l\'Aéroport, Zone Franche',
    telephone: '+241 06 55 66 77',
    email: 'express.owendo@onpg.ga',
    photo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
    latitude: 0.2833,
    longitude: 9.5000,
    horaires: {
      lundi: '24h/24',
      mardi: '24h/24',
      mercredi: '24h/24',
      jeudi: '24h/24',
      vendredi: '24h/24',
      samedi: '24h/24',
      dimanche: '24h/24'
    },
    messages: [
      {
        _id: new ObjectId(),
        type: 'visiteur',
        titre: 'Promotion spéciale',
        contenu: 'Réduction de 15% sur tous les produits de parapharmacie jusqu\'à la fin du mois.',
        visibleVisiteurs: true,
        visibleOrdre: false,
        createdAt: new Date()
      }
    ],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);

    // 1. Créer ou mettre à jour le compte pharmacien
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const pharmacienUser = {
      username: 'pharmacien',
      password: hashedPassword,
      email: 'pharmacien@onpg.ga',
      role: 'pharmacien',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };

    const existingUser = await db.collection('users').findOne({ username: 'pharmacien' });
    let pharmacienId;

    if (existingUser) {
      await db.collection('users').updateOne(
        { username: 'pharmacien' },
        { $set: { ...pharmacienUser, _id: existingUser._id } }
      );
      pharmacienId = existingUser._id;
      console.log('✅ Compte pharmacien mis à jour');
    } else {
      const result = await db.collection('users').insertOne(pharmacienUser);
      pharmacienId = result.insertedId;
      console.log('✅ Compte pharmacien créé');
    }

    console.log('📋 ID Pharmacien:', pharmacienId);

    // 2. Insérer les pharmacies mock (associées au pharmacien)
    console.log('\n📦 Insertion des pharmacies mock...');
    
    for (const pharmacie of mockPharmacies) {
      // Vérifier si la pharmacie existe déjà
      const existing = await db.collection('pharmacies').findOne({
        nom: pharmacie.nom,
        ville: pharmacie.ville,
        adresse: pharmacie.adresse
      });

      if (existing) {
        // Mettre à jour et associer au pharmacien
        await db.collection('pharmacies').updateOne(
          { _id: existing._id },
          { 
            $set: { 
              ...pharmacie,
              pharmacienId: String(pharmacienId),
              location: pharmacie.latitude && pharmacie.longitude ? {
                type: 'Point',
                coordinates: [pharmacie.longitude, pharmacie.latitude]
              } : null,
              updatedAt: new Date()
            }
          }
        );
        console.log(`  ✅ Pharmacie "${pharmacie.nom}" mise à jour`);
      } else {
        // Créer nouvelle pharmacie
        const result = await db.collection('pharmacies').insertOne({
          ...pharmacie,
          pharmacienId: String(pharmacienId),
          location: pharmacie.latitude && pharmacie.longitude ? {
            type: 'Point',
            coordinates: [pharmacie.longitude, pharmacie.latitude]
          } : null
        });
        console.log(`  ✅ Pharmacie "${pharmacie.nom}" créée (ID: ${result.insertedId})`);
      }
    }

    console.log('\n✅ Script terminé avec succès !');
    console.log('\n📝 Compte pharmacien:');
    console.log('   Username: pharmacien');
    console.log('   Password: admin123');
    console.log(`   ID: ${pharmacienId}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();






