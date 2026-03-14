# Audit UX visiteur - Ressources decrets

## Score global (/20)
**14/20** - La page `/ressources/decrets` est deja solide visuellement, avec une base premium issue des styles partages (`src/modules/Pratique/Pratique.css`, `src/modules/Ressources/Ressources.css`, `src/styles/index.css`). Decrets.tsx gere recherche, statuts juridiques active modified abrogated, cartes detaillees et pagination 8. La coherence visuelle hero -> contenu -> cartes est bonne, mais la profondeur fonctionnelle et la standardisation cross page restent inegales.

## Analyse bloc par bloc
- **Hero**: Hero present et globalement convaincant. Il contextualise bien la page, mais la promesse et le premier geste utilisateur peuvent encore etre plus directs.
- **Filtres/recherche**: Le bloc filtres/recherche existe selon le type de page. Sur les pages riches il est utile, mais parfois dense; sur les pages detail il est absent, ce qui simplifie mais limite la navigation transversale.
- **Listes/cartes**: Les listes/cartes sont visibles et lisibles, avec une bonne hierarchie titre -> metadonnees -> action. Le niveau de densite varie toutefois selon les modules.
- **Pagination**: La pagination est presente sur plusieurs pages documentaires (decrets, decisions, lois, commissions, theses, articles, pharmacies, communiques). Quand elle est absente, le rendu complet peut devenir long sur mobile.
- **Detail links/CTA**: Les detail links et CTA sont en place (consulter, lire, voir, telecharger, appeler selon contexte). L harmonisation des labels et du poids visuel n est pas encore uniforme.
- **States empty/loading**: Les states empty/loading existent dans la majorite des pages. Certains ecrans sont exemplaires (double etat vide + reset), d autres restent minimalistes.

## Pourquoi ce n est pas encore premium
Le niveau premium implique une execution UX homogène de bout en bout, pas seulement un bon design. Ici, la qualite visuelle est deja forte, mais l experience utilisateur reste heterogene selon la page: parcours detail/listing pas toujours continu, filtrage parfois limite a la recherche texte alors que les donnees permettraient plus, et differences de comportement entre modules voisins. Sur mobile, les blocs riches peuvent creer une fatigue de scan. Enfin, la mesure d usage n est pas explicite dans l interface, donc l iteration produit est moins pilotée par la preuve.

## Risques UX/mobile
1. Charge cognitive elevee quand beaucoup de filtres et badges cohabitent.
2. Scroll long sur pages sans pagination ou sans synthese par defaut.
3. Perte de contexte lors du retour depuis une fiche detail.
4. CTA non completement standardises entre pages visiteurs.
5. Etats vides parfois informatifs mais pas assez orientants.

## Priorites
1. Standardiser un pattern visiteur commun (hero court, recherche prioritaire, cartes, CTA principal).
2. Consolider le parcours listing vers detail puis retour conserve.
3. Renforcer mobile first: filtres progressifs, densite reduite, actions principales visibles.
4. Uniformiser labels CTA et hierarchie visuelle des actions.
5. Instrumenter clics CTA, usage filtres, temps au premier clic utile, taux de vide.
