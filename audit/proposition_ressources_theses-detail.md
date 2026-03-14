## Objectif premium
Transformer `/ressources/theses/:id` en fiche academique premium qui prepare la lecture du document complet et facilite la decouverte de travaux connexes.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: enrichir `ResourceDetail.tsx` pour la collection `theses` avec auteur, annee, specialite, institution et niveau. Garder breadcrumb mais ajouter badge "These scientifique".

Bloc lisibilite contenu: structurer le contenu en modules standards: Resume, Problematique, Methodologie, Resultats cles, Mots cles. Ajouter un encadre "Contribution principale" en tete.

Bloc media/document: ajouter un CTA principal vers `/ressources/theses/:id/pdf`, plus boutons "Ouvrir PDF" et "Telecharger". Si miniature disponible, afficher preview de premiere page.

Bloc sticky: ajouter panneau sticky desktop avec actions (ouvrir PDF, telecharger, partager, theses liees). Sur mobile, convertir en barre d'actions fixe.

Bloc navigation back: ajouter retour bas de page et navigation these precedente/suivante (meme discipline ou annee).

Bloc related content: section "Theses associees" (3-6 cartes) basee sur tags, domaine, auteur ou proximit e temporelle. Tags cliquables vers listing filtre.

Bloc loading/error: conserver skeleton, mais afficher erreurs recouvrables avec retry et message explicite (ID invalide, these non publiee, reseau).

## Responsive mobile
Hero compact, CTA PDF immediat apres titre, sections en accordions pour eviter surcharge, et boutons pleine largeur pour actions documentaires.

## Accessibilite
Balises de titre ordonnees, liens explicites ("Ouvrir le PDF de la these"), contraste valide, focus clavier visible, et annonces d'etat pour telechargement/copie de lien.

## Mesure de succes
KPI: +30% clics vers PDF, +20% temps sur fiche these, +15% navigation vers theses associees, baisse du rebond mobile. Mesurer aussi taux de completion du parcours fiche -> PDF.

## Estimation impact
Impact fort pour l'image academique du portail. Effort moyen (donnees metiers + UI CTA + recommandations). Rendement eleve sur utilite et perception premium.
