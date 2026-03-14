## Score global (/20)
12/20. La page `/ressources/communiques/:id` repose sur le template `ResourceDetail.tsx`: base propre, SEO/social present, mais experience encore standard et peu differenciante.

## Analyse bloc par bloc
Le bloc hero est complet: breadcrumb, badge categorie, titre, meta date/temps de lecture, image hero. Ce socle est cohérent et lisible. Toutefois, pour un communique officiel, il manque des meta institutionnelles attendues (emetteur, reference, niveau de priorite, date de publication officielle).

Le bloc contenu utilise `dangerouslySetInnerHTML` dans `.article-body` (`Ressources.css`). La lisibilite generale est bonne grace au style typographique, mais la qualite depend fortement du HTML source et il n'existe pas de garde pour des structures longues ou mal formees.

Media/doc embed: image hero presente, mais pas de bloc document officiel (PDF), ni telechargement natif, alors que c'est critique pour des communiques. Les boutons ShareButtons sont utiles mais davantage orientes diffusion que consultation de source.

Sticky elements: pas de sidebar sticky sur cette variante `ResourceDetail`, donc lecture lineaire simple. C'est sobre, mais moins premium en accompagnement de lecture.

Navigation retour: correcte via breadcrumb et lien de retour en etat erreur; en page normale il manque un bloc retour explicite en bas.

Related content: absent. Les tags existent visuellement mais ne sont pas des liens vers des communiques similaires.

Loading/error states: skeleton present, etat erreur present. En revanche, le comportement de redirection auto vers `backPath` peut masquer l'erreur reelle cote utilisateur.

## Pourquoi ce n'est pas encore premium
Le template est polyvalent mais pas specialise "communique officiel". Il manque la couche institutionnelle (source PDF, references, pieces jointes), le rebond contextualise et une navigation continue. Premium ne veut pas seulement dire beau; il faut aussi un cadre documentaire fiable.

## Risques UX/mobile
Sur mobile, le hero peut occuper trop de hauteur avant le message principal. L'absence de CTA telechargement officiel peut frustrer les visiteurs cherchant un document exploitable. Sans related content, sortie rapide probable apres lecture unique.

## Priorites
1. Ajouter bloc "Document officiel" (PDF/annexes) au-dessus du corps.
2. Ajouter metadonnees institutionnelles de communique.
3. Activer tags cliquables + contenus lies.
4. Ajouter bouton retour bas de page et preced/suiv.
5. Rendre les erreurs plus explicites avec option retry.

### Cadre complementaire de validation
Le niveau premium doit etre verifie sur des scenarios reels de consultation institutionnelle: lecture rapide d'un communique urgent, recherche d'une source officielle, partage du lien et retour vers la liste thematique. La page doit rester robuste quand des champs sont absents (image, tags, extrait) et quand la ressource est retiree. Une recette UX ciblee doit mesurer la capacite a identifier l'emetteur et la date officielle sans effort, puis a acceder au document associe en un clic. Enfin, un monitoring des erreurs front (chargement, redirection, liens casses) est indispensable pour garantir une experience fiable sur mobile comme sur desktop.
