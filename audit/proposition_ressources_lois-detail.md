## Objectif premium
Faire de `/ressources/lois/:id` une reference legal premium combinant consultation rapide, acces document officiel et navigation inter-textes.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: conserver le hero actuel (deja tres bon) et y ajouter version du texte, date de derniere consolidation, et indicateur de validite.

Bloc lisibilite contenu: garder resume/articles cles, ajouter bloc "Texte integral" (ou extraits structurants), et section "Points de vigilance" pour interpretation pratique.

Bloc media/document: renforcer le CTA PDF (ouvrir, telecharger, copier lien), ajouter fallback de lien casse avec alternatives et date de dernier controle du document.

Bloc sticky: mettre en place une barre sticky d'actions (document officiel, partager, imprimer, retour haut) pour desktop et mobile.

Bloc navigation back: conserver retour haut/bas et ajouter loi precedente/suivante.

Bloc related content: ajouter modules "Lois associees", "Decrets d'application", "Decisions reliees". Les tags deviennent filtres actifs.

Bloc loading/error: remplacer redirection silencieuse par ecran d'erreur clair, avec retry et chemin de secours vers liste.

## Responsive mobile
Compacter badges/meta en chips scrollables, maintenir CTA PDF visible en permanence, et transformer sections longues en accordions pour lecture progressive.

## Accessibilite
Securiser contrastes dans hero gradient, labels ARIA pour CTA document, navigation clavier complete, et annonces d'etat lors des actions de telechargement.

## Mesure de succes
KPI: +35% clics vers PDF, +20% profondeur de navigation legal (vers textes lies), +15% retention mobile, baisse des abandons apres erreur document.

## Estimation impact
Impact tres eleve sur la valeur percue du portail juridique. Effort moyen a eleve (maillage legal + fallback doc + UX actions). Retour important sur confiance et usage recurrent.
