# Proposition UX premium - Ressources lois

## Objectif premium
Faire de `/ressources/lois` une page premium orientee resultat: comprehension immediate, action en moins de deux interactions, et experience mobile robuste. Lois.tsx affiche corpus legislatif avec statuts, sommaire tableOfContents, tags, recherche et pagination 5. La proposition vise une evolution incrementale, sans casser la base actuelle.

## Plan d amelioration par blocs
- **Hero**: condenser la promesse en une phrase actionnable et ajouter un CTA principal clair au dessus de la ligne de flottaison.
- **Filtres/recherche**: garder un niveau de base visible, placer les options avancees en panneau secondaire, memoriser les choix utilisateur.
- **Listes/cartes**: limiter les infos visibles a l essentiel, garder la profondeur dans la fiche detail, harmoniser la structure des cartes.
- **Pagination**: conserver la pagination ou introduire une segmentation progressive quand absent, avec conservation de page et scroll au retour.
- **Detail links/CTA**: normaliser les verbes (`Consulter`, `Voir le detail`, `Telecharger`) et imposer un systeme primaire secondaire tertiaire stable.
- **States empty/loading**: generaliser skeleton court, message pedagogique, et CTA de rebond (effacer filtres, revenir hub, voir contenu proche).

## Responsive mobile
1. Filtres fermes par defaut, ouverture progressive.
2. Cibles tactiles minimum 44px sur boutons et pagination.
3. Cartes simplifiees en pile courte (titre, 2 metas, CTA).
4. Stabilite de layout entre loading et contenu final.
5. Reduction des elements decoratifs non critiques.

## Accessibilite
- Verifier labels, roles et attributs aria sur recherche, filtres et CTA.
- Garantir contraste AA sur badges et textes secondaires.
- Assurer focus visible coherent sur tous les modules.
- Ajouter annonces des changements dynamiques (resultats filtres, erreurs).
- Confirmer navigation clavier complete jusqu au detail.

## Mesure de succes
- +20% de clics sur CTA principal.
- Temps au premier clic utile inferieur a 8 secondes.
- Baisse de 25% des resultats vides apres filtrage.
- +15% de consultation de fiches detail sur mobile.
- +10% de retours listing avec contexte conserve.

## Estimation impact
- Impact utilisateur: eleve.
- Impact metier: eleve.
- Complexite: moyenne, principalement front UX.
- Risque technique: faible a moyen, surtout regressions visuelles.
- ROI: rapide, car fondation deja en place.
