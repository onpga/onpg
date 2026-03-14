# Audit UX - /membres/section-a

## Score global (/20)
Score actuel estime: **14.7/20**.  
Objectif explicite: **17.5/20** en renforcant robustesse data et homogenisation des interactions.

## Analyse bloc par bloc
La page comporte les blocs attendus: hero de section (Officinaux), filtre de recherche simple, grille de cartes pharmacien, et etats de chargement/vide. Le hero est lisible et la stat "Pharmaciens" donne un repere immediat. La recherche par nom/prenom est pratique et rapide pour une liste de taille moderee.

La grille cartes fonctionne correctement: photo de profil, nom, role, these. Le style `pharmacien-card` et les animations de survol donnent une impression qualitative. La section est globalement coherente avec l'univers visuel membres.

Le principal point faible est la fiabilite des contenus et des fallback: la page peut injecter des `mockPharmaciens` si la section est vide ou en erreur. C'est utile en phase de dev, mais problematique pour un espace visiteur officiel car l'utilisateur ne distingue pas donnees reelles et donnees de demonstration.  
Autre limite: la page est moins riche que `tableau-ordre` (pas de tri, pas de filtres multi-criteres, pas de pagination, pas de changement de vue). Elle ressemble donc a une sous-version fonctionnelle.

## Pourquoi ce n'est pas encore premium
L'esthetique est bonne, mais l'experience premium exige la meme exigence fonctionnelle que le tableau principal: transparence data, controles avancés, et parcours complet. La page actuelle est "propre" mais minimaliste. L'usage professionnel (recherche rapide, comparaison, navigation vers details) reste partiellement servi.

## Risques UX/mobile
Sur mobile, la page reste lisible car la grille se replie en colonne. Risque principal: scroll long sans pagination si le volume augmente. Les styles inline de la grille peuvent compliquer la maintenance responsive. La barre de recherche unique est insuffisante pour des utilisateurs qui ne connaissent pas exactement le nom recherche.

## Priorites
1. Supprimer/masquer les mocks en prod et afficher un etat "aucune donnee officielle".  
2. Aligner les controles UX sur `tableau-ordre` (tri, filtres, pagination).  
3. Ajouter liens directs vers fiche detail pharmacien ou tableau complet prefiltre section A.  
4. Afficher date de mise a jour et source des donnees section.  
5. Harmoniser le responsive sans dependre d'attributs style inline.  
