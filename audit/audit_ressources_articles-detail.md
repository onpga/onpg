## Score global (/20)
12/20. La page `/ressources/articles/:id` utilise `ResourceDetail.tsx` (via `ArticleDetailPage.tsx`) et propose un socle solide, mais l'experience reste generic et peu orientee magazine premium.

## Analyse bloc par bloc
Le bloc hero est structure: breadcrumb, categorie, titre, meta date/temps de lecture et image principale. C'est clair et coherent visuellement avec `Ressources.css`. En revanche, contrairement a la page actualites dediee, cette variante n'a pas de sidebar editoriale ni barre de progression de lecture.

La lisibilite du contenu est correcte grace aux styles `.article-body` (paragraphes, listes, intertitres). Le risque principal vient du rendu HTML injecte (`dangerouslySetInnerHTML`) sans normalisation avancée: qualite variable selon les donnees.

Media/doc embed: image hero oui, document embed non. Pour des articles longs ou techniques, absence de media complementaire (annexes, schema, references telechargeables) limite la valeur.

Sticky elements: quasi absents sur cette page. Le parcours est lineaire, simple, mais moins "assisté" que la page actualites enrichie.

Navigation back: le fil d'Ariane fonctionne bien; toutefois pas de bloc retour explicite en bas ni de precedent/suivant.

Related content: aucun module "A lire aussi"; seuls des tags decoratifs sans liens actionnables.

Loading/error states: skeleton et erreur existent (point positif). Cependant, la redirection vers `backPath` en cas d'echec peut masquer l'explication de panne.

## Pourquoi ce n'est pas encore premium
Le template est propre mais minimal pour un format article editorial. Il manque les mecanismes premium attendus: guidage de lecture, recommandations contextuelles, navigation serie, et enrichissements de contenu (sources, annexes, auteurs).

## Risques UX/mobile
Sur mobile, l'experience est simple mais potentiellement monotone: long scroll sans points de rebond, pas d'outils de lecture, et partage peu contextualise. Les articles longs risquent une sortie precoce.

## Priorites
1. Ajouter module "A lire aussi" reel (meme thematique).
2. Ajouter bloc retour + precedent/suivant.
3. Rendre tags cliquables avec filtrage.
4. Ajouter chapo editorial et references en fin d'article.
5. Clarifier les etats d'erreur avec action retry.
