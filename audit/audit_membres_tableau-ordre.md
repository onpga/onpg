# Audit UX - /membres/tableau-ordre

## Score global (/20)
Score actuel estime: **17.1/20**.  
Objectif explicite: **18.8/20** avec optimisation mobile, clarte de filtres et confiance data.

## Analyse bloc par bloc
La page est deja tres aboutie: hero simple et clair, bloc filtres riche (recherche, section, tri, effacement), toggle d'affichage tableau/cartes, resultats pagines, et etats vides bien traites. C'est l'une des experiences les plus fonctionnelles du lot visiteur.

Le hero installe bien le contexte avec compteur de membres. Le bloc filtres est solide: barre de recherche, select section, select tri, bouton effacer, plus un mecanisme de masquage/affichage des filtres. Le fait que le conteneur de filtres soit sticky facilite la consultation longue.  

Le bloc resultats est exemplaire: titre dynamique avec nombre de resultats, tag de recherche, meta pagination, puis choix entre table et cards. La vue table est performante pour lecture dense (colonnes photo/nom/prenom/section, thead sticky). La vue cartes est utile sur petits ecrans ou pour lecture plus visuelle. Les etats sans resultat sont bien realises, avec icones et action de reinitialisation.

Les limites actuelles concernent surtout la confiance et la comprehension fine: absence de "derniere mise a jour du registre", pas d'indicateur de qualite des donnees (profil complet/incomplet), et peu d'aide contextuelle sur le sens des sections. Le scroll long avec sticky multiples peut aussi devenir encombrant.

## Pourquoi ce n'est pas encore premium
L'UX est tres bonne, mais le niveau premium demande une couche supplementaire de guidance et de transparence: provenance des donnees, pedagogie sur les filtres, personnalisation de la restitution. Aujourd'hui, la page est "efficace"; pour etre premium, elle doit devenir "efficace + explicative + rassurante".

## Risques UX/mobile
Le principal risque mobile est l'occupation de l'espace par les zones sticky (filtres + bouton toggle + entetes), qui peut compresser la zone utile des resultats. Le tableau reste difficile sur tres petits ecrans malgre la responsivite. Les transitions de masquage filtres peuvent aussi surprendre certains utilisateurs.

## Priorites
1. Ajouter metadonnees de confiance (date MAJ, source, nombre de profils incomplets).  
2. Afficher une aide rapide sur sections A/B/C/D directement dans l'interface filtres.  
3. Optimiser l'empilement sticky mobile pour maximiser l'espace de lecture.  
4. Ajouter export/partage filtre (URL query params) pour usage professionnel.  
5. Enrichir la fiche membre (modal ou page detail) pour sortir d'une simple liste.  
