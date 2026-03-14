## Objectif premium
Transformer `/ressources/actualites/:id` en page editoriale institutionnelle premium: lecture confortable, navigation contextuelle forte, robustesse mobile, et parcours de rebond mesure.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: conserver la richesse de `ArticleDetail.tsx` mais appliquer une hierarchie stricte. Afficher titre + categorie + date en priorite, puis deplacer vues/temps de lecture dans un sous-bloc compact. Sur mobile, reduire la hauteur hero et limiter les meta a 2 informations cles.

Bloc lisibilite contenu: dans `.article-body` (`Ressources.css`), fixer un rythme editorial (taille, interlignage, largeur de ligne max), inserer un chapo obligatoire en haut, et ajouter style uniforme pour listes/citations/tableaux. Construire un sommaire dynamique en parsant les `h2/h3` reels, puis lier les ancres pour remplacer le sommaire statique.

Bloc media/document: maintenir image hero, ajouter mode "zoom image" et placeholders progressifs. Si un article contient un document externe, ajouter un bloc "Consulter la source" standardise.

Bloc sticky: garder la sidebar sticky desktop (`Actualites.css`) mais la simplifier: Sommaire + Articles lies + CTA unique. Supprimer ou de-prioriser les widgets faibles (stats fictives).

Bloc navigation retour: conserver breadcrumb + retour bas de page, ajouter "Article precedent/suivant" base sur date/categorie.

Bloc related content: remplacer la section tags par 3 a 6 cartes "A lire aussi" chargees depuis la meme collection (`actualites`) avec exclusion de l'ID courant.

Bloc loading/error: enrichir le skeleton avec blocs representatifs (titre, meta, image, paragraphe), et en erreur afficher un panneau avec bouton retry, lien retour, et message explicite.

## Responsive mobile
Passer en mode lecture d'abord: hero compact, sommaire collapsible, boutons de partage avec labels texte, espacements reduits. Verifier que les ancres de sommaire ne cachent pas les titres sous un header sticky futur.

## Accessibilite
Ajouter verification contraste sur badges/texte, focus visible sur tous les boutons, labels explicites pour partage, region ARIA pour progression de lecture, et structure semantique stable (un seul `h1`, progression `h2/h3`).

## Mesure de succes
KPI cibles: +20% temps de lecture median, +15% clics vers contenus lies, baisse du taux de retour immediat vers la liste, taux d'erreur non recuperable < 1%. Suivre aussi profondeur de scroll et clic sur sommaire dynamique.

## Estimation impact
Impact eleve. Effort moyen a eleve (UI + logique de parsing headings + fetch related). Retour attendu fort sur perception premium, SEO de longue traine et engagement editorial.
