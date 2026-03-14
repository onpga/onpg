## Objectif premium
Faire de `/ressources/theses/:id/pdf` une experience documentaire premium: consultation stable, contexte scientifique immediat et rebond vers contenus proches.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: enrichir l'en-tete existant de `ThesePdfViewer.tsx` avec annee, domaine, categorie, etablissement et niveau (doctorat/master). Conserver breadcrumb et retour, mais remplacer l'ID technique visible par une reference lisible.

Bloc lisibilite contenu: avant l'iframe, ajouter un resume executive (5-7 lignes), mots cles et points a retenir. Cela permet une comprehension rapide sans lire tout le PDF.

Bloc media/doc embed: garder l'iframe mais ajouter actions explicites: "Ouvrir dans un nouvel onglet", "Telecharger PDF", "Copier lien". Implementer fallback automatique si embed refuse: afficher une carte d'erreur avec bouton d'ouverture externe.

Bloc sticky: ajouter une barre sticky discrete (desktop et mobile) avec retour, telechargement, partage. Cette barre remplace la perte de controle pendant le scroll long du document.

Bloc navigation back: conserver retour historique et lien theses; ajouter un retour explicite a la fiche detail these (`/ressources/theses/:id`) quand elle existe.

Bloc related content: inserer "Theses associees" basees sur tags, domaine et annee proche. 3 a 5 cartes suffisent pour prolonger la session.

Bloc loading/error: ajouter spinner de chargement du PDF, timeout reseau, et etat d'erreur differencie (URL invalide, contenu bloque, document absent).

## Responsive mobile
Adapter la hauteur du lecteur avec breakpoints (`100dvh` - offsets), placer les actions dans une barre fixe basse, et proposer une action prioritaire "Ouvrir dans le navigateur PDF".

## Accessibilite
Ajouter titre de document explicite, labels ARIA sur boutons d'action, ordre de tabulation coherent entre hero et lecteur, et messages d'etat annoncables pour succes/erreur.

## Mesure de succes
KPI: +20% taux de consultation effective PDF (>30s), +15% clics telechargement/ouverture externe, +20% clics theses associees, baisse des sorties immediates sur erreur d'embed.

## Estimation impact
Impact eleve sur la qualite percue des ressources academiques. Effort moyen (UI action bar + gestion fallback iframe + recommandations). Benefice rapide pour mobile et navigateurs heterogenes.
