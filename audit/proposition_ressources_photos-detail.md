## Objectif premium
Faire de `/ressources/photos/:id` une experience galerie haut de gamme, orientee consultation continue, contextualisation et partage qualitatif.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: ajouter un hero compact avec breadcrumb (`Accueil > Ressources > Photos > Album`) et meta principale visible des l'entree: date, categorie, album, credit photographe. Garder le bouton retour mais ajouter "Retour a l'album".

Bloc lisibilite contenu: structurer la colonne infos en sections editoriales: description, contexte evenement, credits, droits d'usage. Uniformiser la longueur minimale de description pour eviter les fiches trop vides.

Bloc media/embed: conserver l'image sticky de `PhotoDetail.css` et le plein ecran, mais ajouter zoom progressif, skeleton image, et prechargement de la photo suivante. Ajouter telechargement controle (taille/format) si autorise.

Bloc sticky: conserver sticky desktop pour media, et introduire un mini panneau sticky secondaire (desktop) avec actions rapides: partager, copier lien, photo suivante.

Bloc navigation back: dupliquer un retour en bas de page et ajouter navigation precedente/suivante issue de l'album (ordre chronologique ou index).

Bloc related content: creer "Photos associees" (4 a 8 miniatures) basees sur meme album puis tags proches, avec fallback par categorie. Les tags deviennent cliquables vers une recherche filtree.

Bloc loading/error: remplacer `return null` par un composant erreur complet avec message, retry, retour album. Ajouter timeout reseau et etat vide explicite si ID inconnu.

## Responsive mobile
Prioriser le media en haut, puis fiche info en accordions (Details, Tags, Partage). Agrandir labels de boutons sociaux (icone + texte), et ajouter geste swipe gauche/droite pour precedent/suivant.

## Accessibilite
Ajouter alt enrichi (titre + lieu + date), focus visible sur tous les controles, etiquette ARIA pour plein ecran, annonces lecteur d'ecran apres copie lien, et contraste valide sur badges/couleurs de tags.

## Mesure de succes
KPI: +25% pages vues par session photo, +30% clics sur photos associees, baisse du taux de sortie immediate, +15% partages effectifs. Suivre aussi usage precedent/suivant et taux d'erreur photo introuvable.

## Estimation impact
Impact fort sur engagement media. Effort moyen (UI + logique de voisinage album + gestion etats). Gain rapide perceptible cote utilisateur, surtout sur mobile et pour parcours longues galeries.
