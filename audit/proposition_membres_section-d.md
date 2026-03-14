# Proposition UX premium - /membres/section-d

## Objectif premium
Faire de la Section D une **interface de consultation metier robuste** pour fabricants, grossistes et repartiteurs, avec navigation approfondie et confiance institutionnelle elevee. Cible: **18/20**.

## Plan d'amelioration par blocs
Hero: conserver la signature visuelle Section D et ajouter un sous-bloc de contexte ("perimetre Section D", date MAJ, lien vers tableau complet). Ajouter un CTA secondaire vers ressources reglementaires pertinentes.

Filtres: faire evoluer la recherche actuelle vers un panneau complet repliable comprenant tri (nom/prenom), filtre role (fabricant/grossiste/repartiteur), reset global et resume des filtres actifs.

Cartes profils: supprimer styles inline pour standardiser l'apparence via CSS. Ajouter un bouton `Voir la fiche` avec details institutionnels. Afficher un indicateur de complétude de profil pour guider la qualite des donnees. Mettre en place pagination pour maintenir performance et confort de scan.

Bloc de fin de page: ajouter une section `Continuer` avec liens vers `tableau-ordre`, `section-a`, `section-b`, `section-c` et `contact`.

## Responsive mobile
Concevoir une version mobile compacte: carte reduite, infos essentielles en premier, action fiche immediate. Limiter ombres/animations, maintenir targets tactiles >44px. Placer la recherche sticky legere sans reduire excessivement la hauteur utile de contenu.

## Accessibilite
Renforcer contrastes sur texte secondaire. Ajouter et tester `focus-visible` sur tous les controles. S'assurer que les boutons ont des labels explicites ("Voir la fiche du pharmacien"). Structurer les titres pour une lecture claire au lecteur d'ecran.

## Mesure de succes
KPI: taux de clic vers fiches, usage des filtres, temps moyen pour trouver un profil Section D, clics de navigation inter-sections. Cibles: +30% de clics utiles et baisse du rebond mobile.

## Estimation impact
Impact moyen a fort: la page passera d'une vitrine de profils a un outil de consultation professionnelle. Effort moyen (refonte filtres + normalisation styles + navigation). Le gain premium est tangible, surtout en cohérence transversale avec `tableau-ordre`.
