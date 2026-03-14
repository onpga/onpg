## Objectif premium
Elever `/ressources/videos/:id` au niveau d'une page media premium orientee visionnage continu, credibilite institutionnelle et engagement post-lecture.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: ajouter un hero court avec breadcrumb et metadonnees essentielles visibles immediatement: categorie, date de publication, duree, intervenant. Conserver le bouton retour et ajouter un CTA "Voir toutes les videos de cette categorie".

Bloc lisibilite contenu: structurer la description en paragraphes courts avec sous-titres (contexte, points cles, public cible). Ajouter un resume de 2 lignes au-dessus du detail.

Bloc media/embed: garder le player sticky desktop de `VideoDetail.css`, mais ajouter poster fallback si `youtubeId` absent, gestion des erreurs d'embed, et etiquette "Source YouTube". Ajouter chapter markers quand disponibles.

Bloc sticky: enrichir la zone sticky avec actions rapides (plein ecran, partager, video suivante). Sur desktop, garder la logique actuelle; sur mobile, passer en actions flottantes compactes.

Bloc navigation back: dupliquer un retour en bas de page, et introduire precedent/suivant selon date ou playlist.

Bloc related content: ajouter deux blocs: "Videos associees" (meme tags/categorie) et "Interventions du meme speaker". Cartes avec miniature, duree, date et lien direct.

Bloc loading/error: remplacer retour vide par composant erreur complet avec retry, fallback vers liste, et message detaille (video supprimee, indisponible, ID invalide).

## Responsive mobile
Simplifier les metadonnees en chips, passer la section details en accordions, afficher boutons partage avec texte, et proposer un carrousel horizontal de videos liees juste sous le player.

## Accessibilite
Verifier contraste des controles sur video, ajouter labels ARIA complets pour boutons de partage/plein ecran, support clavier sur toutes actions, et texte alternatif explicite pour miniatures des contenus lies.

## Mesure de succes
KPI: +20% taux de completion video, +25% clics vers videos associees, baisse du taux d'abandon apres 1 vue, reduction des erreurs non recuperees. Suivre aussi temps actif sur page et usage du plein ecran.

## Estimation impact
Impact eleve sur retention. Effort moyen (UI + logique recommendations + fallback embed). Le gain sera visible rapidement sur engagement et perception de qualite.
