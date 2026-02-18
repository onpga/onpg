const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './backend-config.env' });

const MONGODB_URI = 'mongodb://mongo:PUnGGIpyAbMtWoQohyXGFpMjVkAWTYXJ@trolley.proxy.rlwy.net:38507';
const DB_NAME = 'onpg';
const fs = require('fs');
const path = require('path');

// Sections possibles (à assigner aléatoirement ou selon logique métier)
const SECTIONS = ['Section A', 'Section B', 'Section C', 'Section D'];

function parsePharmaciensFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const allLines = content.split('\n').map(l => l.trim()).filter(l => l);
  
  const pharmaciens = [];
  let i = 2; // Skip les 2 premières lignes (en-tête)
  
  while (i < allLines.length) {
    const line = allLines[i];
    
    // Ignorer les lignes qui ne commencent pas par Dr ou Pr
    if (!line.startsWith('Dr ') && !line.startsWith('Pr ')) {
      i++;
      continue;
    }
    
    // Extraire le titre
    const titre = line.startsWith('Pr ') ? 'Pr' : 'Dr';
    let nomComplet = line.replace(/^(Dr|Pr)\s+/, '').trim();
    let numeroOrdre = null;
    let nationalite = null;
    let j = i + 1;
    
    // Chercher le numéro d'ordre et la nationalité
    // Pattern 1: tout sur une ligne "Dr NOM PRENOM NUMERO Gabon/ETRANGER"
    const singleLineMatch = line.match(/^(Dr|Pr)\s+(.+?)\s+(\d+)\s+(Gabon|ETRANGER)$/);
    if (singleLineMatch) {
      const [, , nomCompletFull, num, nat] = singleLineMatch;
      nomComplet = nomCompletFull.trim();
      numeroOrdre = parseInt(num);
      nationalite = nat;
      i++;
    } else {
      // Pattern 2: sur plusieurs lignes
      // Ligne actuelle: "Dr NOM PRENOM"
      // Ligne suivante: NUMERO
      // Ligne d'après: Gabon/ETRANGER
      
      // Chercher le numéro dans les lignes suivantes
      while (j < allLines.length && j < i + 4) {
        const nextLine = allLines[j];
        
        // Si c'est un nombre seul, c'est le numéro d'ordre
        if (/^\d+$/.test(nextLine)) {
          numeroOrdre = parseInt(nextLine);
          j++;
          // La ligne suivante devrait être la nationalité
          if (j < allLines.length) {
            const natLine = allLines[j];
            if (natLine === 'Gabon' || natLine === 'ETRANGER') {
              nationalite = natLine;
              j++;
              break;
            }
            // Si la ligne suivante est un nouveau Dr/Pr, la nationalité manque peut-être
            if (natLine.startsWith('Dr ') || natLine.startsWith('Pr ')) {
              // Pas de nationalité trouvée, on essaie de deviner ou on skip
              break;
            }
          }
          break;
        }
        
        // Si on trouve directement la nationalité
        if (nextLine === 'Gabon' || nextLine === 'ETRANGER') {
          nationalite = nextLine;
          // Chercher le numéro dans nomComplet ou ligne précédente
          const numMatch = nomComplet.match(/\s+(\d+)\s*$/);
          if (numMatch) {
            numeroOrdre = parseInt(numMatch[1]);
            nomComplet = nomComplet.replace(/\s+\d+\s*$/, '').trim();
          } else if (j > i + 1 && /^\d+$/.test(allLines[j - 1])) {
            numeroOrdre = parseInt(allLines[j - 1]);
          }
          j++;
          break;
        }
        
        // Si on trouve un nouveau Dr/Pr, on s'arrête
        if (nextLine.startsWith('Dr ') || nextLine.startsWith('Pr ')) {
          break;
        }
        
        // Sinon, c'est probablement la suite du nom
        nomComplet += ' ' + nextLine;
        j++;
      }
      
      i = j;
    }
    
    // Si on a trouvé toutes les infos, créer l'entrée
    if (numeroOrdre && nationalite && nomComplet) {
      // Séparer nom et prénom
      const nameParts = nomComplet.trim().split(/\s+/).filter(p => p);
      let nom = '';
      let prenom = '';
      
      if (nameParts.length === 1) {
        nom = nameParts[0];
      } else if (nameParts.length === 2) {
        nom = nameParts[0];
        prenom = nameParts[1];
      } else {
        // Prendre les 2-3 premiers mots comme nom, le reste comme prénom
        const nomParts = nameParts.slice(0, Math.min(3, Math.floor(nameParts.length / 2)));
        nom = nomParts.join(' ');
        prenom = nameParts.slice(nomParts.length).join(' ');
      }
      
      // Section vide pour le moment (sera remplie via l'admin)
      const section = '';
      
      pharmaciens.push({
        titre: titre,
        nom: nom,
        prenom: prenom,
        nomComplet: nomComplet.trim(),
        numeroOrdre: numeroOrdre,
        nationalite: nationalite,
        section: section,
        cotisationsAJour: true,
        dateRetardCotisations: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else {
      // Si on n'a pas trouvé toutes les infos, on passe à la ligne suivante
      i++;
    }
  }
  
  return pharmaciens;
}

async function insertPharmaciens() {
  let client;
  try {
    console.log('🔌 Connexion à MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connecté à MongoDB');

    const db = client.db(DB_NAME);
    const pharmaciensCollection = db.collection('pharmaciens');

    // Parser le fichier
    const filePath = path.join(__dirname, '../public/liste_pharmaciens.txt');
    console.log('📖 Lecture du fichier:', filePath);
    const pharmaciens = parsePharmaciensFile(filePath);
    console.log(`📋 ${pharmaciens.length} pharmaciens parsés`);

    if (pharmaciens.length === 0) {
      console.log('⚠️  Aucun pharmacien à insérer');
      process.exit(0);
    }

    // Créer un index unique sur numeroOrdre pour éviter les doublons
    try {
      await pharmaciensCollection.createIndex({ numeroOrdre: 1 }, { unique: true });
      console.log('✅ Index unique créé sur numeroOrdre');
    } catch (e) {
      // Index existe déjà, c'est OK
    }

    // Utiliser bulkWrite pour insérer/mettre à jour en une seule opération (beaucoup plus rapide)
    const operations = pharmaciens.map(p => ({
      updateOne: {
        filter: { numeroOrdre: p.numeroOrdre },
        update: { $set: p },
        upsert: true
      }
    }));

    console.log('💾 Insertion/Mise à jour en cours...');
    const result = await pharmaciensCollection.bulkWrite(operations, { ordered: false });
    
    console.log(`✅ ${result.upsertedCount} pharmaciens insérés, ${result.modifiedCount} mis à jour`);
    console.log(`📊 Total dans la collection: ${await pharmaciensCollection.countDocuments()}`);

    console.log('\n🎉 Insertion terminée !');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Connexion fermée');
    }
  }
}

insertPharmaciens();
