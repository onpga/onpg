# Proposition UX premium - /membres/section-c

## Objectif premium
Faire de la Section C une page **fiable, homogène et facilement exploitable** pour identifier les pharmaciens fonctionnaires, avec une UX stable sur tous supports. Cible: **17.8 a 18/20**.

## Plan d'amelioration par blocs
Dans le hero, conserver l'identite Section C et ajouter un repere institutionnel: date de mise a jour, definition courte de la section et lien vers le cadre reglementaire.  

Dans le bloc recherche, introduire un pack de filtres legers: tri, role, eventuelle zone d'exercice si disponible. Ajouter un reset et des chips de filtre actifs.

Dans la grille, supprimer les styles inline et basculer vers classes CSS unifiees (etat normal, hover, focus, compact mobile). Ajouter un bouton `Voir la fiche` par carte et uniformiser la longueur des these affichees. Introduire une pagination simple pour maintenir des temps de chargement et un confort de lecture constants.

Ajouter un bloc de navigation final: `Retour Tableau de l'Ordre` + `Aller a Section A/B/D`. Cela transforme la page en noeud de parcours plutot qu'en destination isolee.

## Responsive mobile
Appliquer un mode mobile-first avec cartes plus courtes, titre/role prioritaires et action fiche immediate. Reduire les effets d'ombre et transitions pour fluidite. Garder la recherche accessible en haut avec option de filtres repliables.

## Accessibilite
Ajouter `focus-visible` sur cartes cliquables et controles. Verifier contrastes des textes gris (role/these) sur fond blanc. Maintenir un ordre de titres semantique stable. Garantir des alternatives textuelles robustes pour images profil.

## Mesure de succes
KPI: clic fiche par profil, taux d'usage filtres, profondeur de scroll, temps de localisation d'un pharmacien. Cibles: +30% clics utiles et reduction du temps moyen de recherche.

## Estimation impact
Impact moyen a fort, avec effort technique raisonnable (refactor CSS + filtres + pagination). Le benefice principal est la coherence premium avec les autres pages membres et une meilleure confiance d'usage institutionnel.
