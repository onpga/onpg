## Objectif premium
Faire de `/ressources/articles/:id` une page article premium orientee lecture longue, expertise et rebond editorial.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: conserver le hero de `ResourceDetail.tsx`, mais ajouter auteur, date de mise a jour, niveau de lecture et temps estime plus fiable. Rendre la categorie cliquable vers la liste filtree.

Bloc lisibilite contenu: imposer un format editorial stable (chapo, intertitres, citations, callout "point cle"), ajuster largeur de ligne, et normaliser les styles injectes dans `.article-body`. Ajouter estimation de progression de lecture.

Bloc media/document: ajouter support de blocs medias internes (image legendee, video, document source) et section references telechargeables.

Bloc sticky: introduire une sidebar sticky desktop legere (sommaire dynamique + actions partage + print). Sur mobile, passer en sommaire repliable.

Bloc navigation back: ajouter un retour bas de page et un duo "Article precedent / suivant" selon date ou categorie.

Bloc related content: creer une section "A lire aussi" (4 cartes) issue de la meme collection `articles`, avec fallback sur tags communs. Rendre tags interactifs.

Bloc loading/error: enrichir le skeleton avec placeholders de vrai contenu; en erreur, proposer rechargement et message explicite selon cause.

## Responsive mobile
Compacter hero et meta, augmenter contraste du texte, activer un mode lecture confortable (taille police + line-height), et proposer actions rapides flottantes non intrusives.

## Accessibilite
Verifier hierarchie des titres, focus clavier complet, etiquettes ARIA sur boutons de partage, contraste des badges/tags, et textes alternatifs pertinents sur image hero.

## Mesure de succes
KPI: +18% temps moyen de lecture, +22% clics vers articles lies, +10% partage, baisse du taux de rebond article. Suivre profondeur de scroll et interactions sommaire/tags.

## Estimation impact
Impact moyen a fort. Effort moyen (UI + logique recommandations + sommaire dynamique). Benefice rapide sur engagement et perception qualitative de la rubrique articles.
