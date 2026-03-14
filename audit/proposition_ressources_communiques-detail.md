## Objectif premium
Positionner `/ressources/communiques/:id` comme une page officielle de reference: claire, telechargeable, partageable, et riche en contexte institutionnel.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: a partir de `ResourceDetail.tsx`, ajouter des champs metiers communique: numero de reference, emetteur, date officielle, statut (nouveau, archive). Garder breadcrumb et titre, mais afficher une bande "Information officielle ONPG" pour renforcer la confiance.

Bloc lisibilite contenu: normaliser le rendu `article-body` (paragraphes, intertitres, listes), imposer un chapo de synthese et un bloc "A retenir" en debut de page.

Bloc media/document: introduire un bloc "Document officiel" avec boutons "Consulter PDF", "Telecharger", "Copier reference". Garder image hero facultative mais secondaire par rapport au document source.

Bloc sticky: ajouter une mini colonne sticky desktop (actions rapides: telecharger, partager, imprimer). Sur mobile, transformer en barre d'actions fixe en bas.

Bloc navigation back: ajouter un vrai bouton retour en bas + navigation communique precedent/suivant.

Bloc related content: afficher 3 a 5 communiques proches (meme categorie/date). Les tags deviennent cliquables et ouvrent une liste filtree.

Bloc loading/error: enrichir le skeleton avec squelette document + metadonnees. En erreur, afficher motif et actions: recharger, revenir liste, contacter support si besoin.

## Responsive mobile
Hero condense, priorite au bloc document officiel. Boutons actions pleine largeur, police corps optimisee lecture, espacement accru des zones tactiles, et suppression des elements decoratifs non essentiels.

## Accessibilite
Respect contraste WCAG, labels explicites sur tous les CTAs, structure de titres logique, alternatives texte pour icones statut, et notifications accessibles apres copie de reference/lien.

## Mesure de succes
KPI: +30% taux d'ouverture/telechargement de document officiel, +20% rebond vers communiques lies, baisse des abandons mobiles. Suivre aussi taux de clic sur tags filtres et taux de recovery apres erreur.

## Estimation impact
Impact eleve en credibilite institutionnelle. Effort moyen (UI + donnees metiers + parcours related). Retour direct sur confiance usager et utilite des communiques.
