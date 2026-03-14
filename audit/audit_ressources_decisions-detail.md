## Score global (/20)
14/20. La page `/ressources/decisions/:id` est bien orientee metier avec resultat de decision, parties, mots-cles et partage. Elle reste non premium sur la profondeur documentaire et les parcours connexes.

## Analyse bloc par bloc
Le hero/meta/date/categorie est solide dans `DecisionDetailPage.tsx`: breadcrumb, reference, outcome badge, titre, date, juridiction, categorie. Le premier ecran transmet rapidement la nature de la decision.

La lisibilite du contenu est bonne grace aux sections cartees: resume, parties concernees, mots-cles. Cela facilite le scan. En revanche, il manque des blocs fondamentaux pour decision: motifs, base legale citee, impacts pratiques.

Media/doc embed: pas de document source (jugement/decision PDF), ni timeline de procedure. Le partage existe via `ShareButtons` mais sans ancrage sur source officielle.

Sticky elements: non utilises; acceptable mais prive l'utilisateur d'actions constantes pour des pages juridiques longues.

Navigation back: double retour (haut et bas) bien execute, point positif.

Related content: absent. Pas de decisions similaires, ni renvoi vers decrets/lois correlés. Les mots-cles ne sont pas interactifs.

Loading/error states: loader present, mais redirection silencieuse en echec. Aucun etat "decision introuvable" contextualise.

## Pourquoi ce n'est pas encore premium
La presentation est deja au-dessus de la moyenne, mais un standard premium juridique exige transparence documentaire, parcours inter-textes et capacite d'exploration (filtres, precedents). Ici, on reste sur une fiche statique.

## Risques UX/mobile
Sur mobile, les badges et metadonnees peuvent saturer la zone hero. Sans source telechargeable et sans contenus lies, la page risque d'etre consultee puis quittee rapidement. Les erreurs silencieuses fragilisent la confiance.

## Priorites
1. Ajouter document source + references legals citees.
2. Rendre mots-cles cliquables et exploiter decisions similaires.
3. Ajouter bloc impact pratique (profession/pharmaciens).
4. Mettre un etat erreur explicite avec recovery.
5. Recomposer le hero mobile plus compact.
