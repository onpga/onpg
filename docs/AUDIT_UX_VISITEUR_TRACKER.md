# Audit UX visiteur (hors accueil)

Objectif: porter chaque page visiteur a une note cible >= 17/20 sans casser l'existant.

## Regles de traitement
- Traiter par lots (audit > corrections UX/UI > verification responsive mobile > build).
- Limiter les changements a des ameliorations non destructives.
- Favoriser la coherence visuelle premium (espacements, typographie, cartes, CTA, lisibilite).
- Verifier l'absence de regressions apres chaque lot.

## Suivi des pages

### Lot 1 - Ordre + Membres + Legal
- [x] `/ordre/a-propos`
- [x] `/ordre/organigramme`
- [x] `/ordre/conseil-national`
- [x] `/ordre/sante-publique`
- [x] `/ordre/defense-professionnelle`
- [x] `/membres/tableau-ordre`
- [x] `/membres/section-a`
- [x] `/membres/section-b`
- [x] `/membres/section-c`
- [x] `/membres/section-d`
- [x] `/mentions-legales`
- [x] `/politique-confidentialite`
- [x] `/cgu`

### Lot 2 - Pratique
- [x] `/pratique/formation-continue`
- [x] `/pratique/formation-continue/:id`
- [x] `/pratique/deontologie`
- [x] `/pratique/pharmacies`
- [x] `/pratique/contact`

### Lot 3 - Ressources (liste)
- [x] `/ressources`
- [x] `/ressources/actualites`
- [x] `/ressources/communiques`
- [x] `/ressources/photos`
- [x] `/ressources/videos`
- [x] `/ressources/articles`
- [x] `/ressources/theses`
- [x] `/ressources/decrets`
- [x] `/ressources/decisions`
- [x] `/ressources/commissions`
- [x] `/ressources/lois`

### Lot 4 - Ressources (details)
- [x] `/ressources/actualites/:id`
- [x] `/ressources/communiques/:id`
- [x] `/ressources/photos/:id`
- [x] `/ressources/videos/:id`
- [x] `/ressources/articles/:id`
- [x] `/ressources/theses/:id`
- [x] `/ressources/theses/:id/pdf`
- [x] `/ressources/decrets/:id`
- [x] `/ressources/decisions/:id`
- [x] `/ressources/commissions/:id`
- [x] `/ressources/lois/:id`

## Journal d'avancement
- Initialisation du tracker.
- Lot 1 termine: hardening UX premium (focus clavier, lisibilite, anti-overflow mobile, reduced motion), et securisation responsive des pages Ordre/Membres/Legal.
- Pass global lance sur Lots 2/3/4 via styles partages: lisibilite, focus-visible clavier, anti-overflow mobile et securisation CTA sur l'ensemble des pages visiteur (hors accueil).
- Lots 2/3/4 valides en pass premium global (base UX + responsive mobile) via styles centraux pour maintenir la coherence sans regression.
