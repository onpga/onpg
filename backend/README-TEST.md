# Scripts de Test pour l'Espace Admin

## Script de test d'insertion de données

Le script `test-insert-data.js` permet de tester l'insertion de données fictives via l'API admin pour chaque collection Resources.

### Prérequis

1. Le backend doit être démarré sur le port 3001
2. MongoDB doit être accessible
3. Le token admin doit être configuré dans `backend-config.env`

### Configuration

1. Ouvrir `backend/backend-config.env`
2. Définir `ADMIN_TOKEN` avec votre token admin (ex: `ADMIN_TOKEN=mon-token-secret`)

### Utilisation

```bash
cd backend
npm run test-insert
```

### Ce que fait le script

Le script va :
1. Vérifier que le backend est accessible
2. Insérer une donnée de test pour chaque collection :
   - actualites
   - articles
   - communiques
   - decisions
   - decrets
   - lois
   - commissions
   - theses
   - photos
3. Insérer 3 vidéos de test dans la collection `videos`
4. Afficher un résumé des succès/échecs

### Résultat attendu

```
🚀 Démarrage des tests d'insertion via l'API admin
📍 URL API: http://localhost:3001/api
🔑 Token Admin: mon-token-...

📝 Insertion test pour: actualites
✅ actualites: Donnée insérée avec succès (ID: ...)
...
📊 Résumé des tests:
✅ Succès: 12
❌ Échecs: 0
🎉 Tous les tests sont passés avec succès !
```

### Dépannage

Si le script échoue :
- Vérifier que le backend est démarré : `cd backend && npm run dev`
- Vérifier que MongoDB est accessible
- Vérifier que le token admin est correct dans `backend-config.env`
- Vérifier les logs du backend pour voir les erreurs détaillées






