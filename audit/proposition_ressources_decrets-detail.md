## Objectif premium
Faire de `/ressources/decrets/:id` une fiche reglementaire premium, fiable et exploitable juridiquement par les visiteurs.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: conserver l'excellent hero actuel de `DecretDetailPage.tsx` et y ajouter numero officiel complet, autorite signataire, date de derniere mise a jour, et indicateur de version.

Bloc lisibilite contenu: garder les cartes resume/articles cles, mais ajouter un onglet "Texte integral" (ou extrait structure) pour ne pas limiter la page a une synthese.

Bloc media/document: ajouter un bloc prioritaire "Document officiel" avec actions ouvrir/telecharger PDF et verification d'integrite du lien. Ajouter annexes si disponibles.

Bloc sticky: introduire barre sticky discre te avec actions: telecharger, partager, imprimer, retour haut. Sur mobile, transformer en barre basse compacte.

Bloc navigation back: garder les deux retours existants, ajouter navigation decret precedent/suivant.

Bloc related content: creer sections "Decrets associes", "Lois impactees" et "Decisions reliees". Les tags deviennent filtres interactifs.

Bloc loading/error: remplacer la redirection silencieuse par un ecran d'erreur clair (ID invalide, reseau, contenu retire) avec bouton retry.

## Responsive mobile
Compacter le hero en cartes meta horizontales scrollables, prioriser CTA document officiel, et reduire les marges pour garder les informations critiques above the fold.

## Accessibilite
Ajouter labels ARIA pour badges statut, contrastes renforces, focus visible sur liens de navigation, et textes alternatifs sur icones juridiques.

## Mesure de succes
KPI: +35% clics sur document officiel, +20% navigation vers decrets lies, baisse du rebond mobile, reduction des sorties apres erreur. Mesurer aussi temps moyen sur sections "articles cles".

## Estimation impact
Impact tres fort sur confiance et utilite legal. Effort moyen a eleve (data doc + maillage legal + etats d'erreur). Retour significatif pour usagers institutionnels.
