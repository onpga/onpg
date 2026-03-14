# Proposition UX premium - /ordre/conseil-national

## Objectif premium
Faire de la page Conseil National un **repertoire officiel fiable et consultable rapidement**, avec des fiches membres utiles et un pont naturel vers le reste de l'ecosysteme ONPG. Cible: passer de 16.2 a **18.4/20**.

## Plan d'amelioration par blocs
Conserver le hero et ses statistiques, mais ajouter une precision contextuelle: "Composition du mandat en cours" + date de reference. Ajouter un CTA secondaire dans le hero vers `/ordre/organigramme` pour relier vision macro et fiches individuelles.

Dans la grille de cartes, afficher un resume standardise: role, commission principale, ville/zone d'exercice (si public). Ajouter un tri simple (`Presidence`, `Conseillers`, `Alphabetique`) et un filtre textuel si le volume augmente.

Pour la modal, passer d'une simple carte agrandie a une fiche institutionnelle utile: mandat, missions, domaines de contribution, canal de contact institutionnel (pas personnel), et liens vers pages connexes. Integrer un bouton `Membre precedent/suivant` pour une lecture continue sans retour a la grille.

Ajouter en fin de page un bloc "Continuer votre parcours" avec 3 CTA: `Organigramme`, `A propos de l'Ordre`, `Tableau de l'Ordre`.

## Responsive mobile
Sur mobile, limiter la hauteur de modal et autoriser un scroll interne confortable. Rendre le bouton de fermeture plus visible (zone tactile minimum 44px). Optimiser la grille pour eviter les sauts de layout (hauteurs de cartes harmonisees). Ajouter un mini-filtre compact en haut de liste.

## Accessibilite
Ajouter labels explicites aux boutons de fermeture et de navigation modal. Verifier l'ordre focus (carte > modal > fermeture > retour). Garantir contraste suffisant des badges de role president/conseiller. Fournir textes alternatifs pertinents pour photos officielles et fallback accessible si image absente.

## Mesure de succes
KPI proposes: taux d'ouverture modal par carte, temps moyen dans modal, taux de clic vers `organigramme`, part des utilisateurs atteignant le bloc final CTA. Cibles: +20% d'interactions qualifiees et +15% de navigation vers pages institutionnelles associees.

## Estimation impact
Impact eleve sur la confiance publique et la transparence institutionnelle. Effort moyen (data + UI modal + filtres legers). Le gain percu est fort: la page devient un outil d'information officiel, pas seulement une galerie.
