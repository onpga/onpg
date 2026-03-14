## Score global (/20)
12/20. La page `/ressources/theses/:id` est basee sur `ResourceDetail.tsx` et offre un rendu propre, mais elle n'est pas encore adaptee aux attentes d'une fiche academique premium.

## Analyse bloc par bloc
Le bloc hero/meta/date/categorie est standard (breadcrumb, categorie, titre, date, image), mais pas specialise these: il manque auteur universitaire, annee, discipline, encadrant, et statut (soutenue, publiee, archivee).

La lisibilite du contenu est correcte dans `.article-body`, toutefois la structure academique n'est pas guidee. Sans sections normalisees (resume, mots cles, contribution), le visiteur peine a evaluer rapidement l'interet du document.

Media/doc embed: sur cette page detail, pas de viewer PDF natif ni CTA fort vers `/ressources/theses/:id/pdf`. C'est une faiblesse majeure pour une ressource documentaire.

Sticky elements: absents. Le parcours reste lineaire sans aide de navigation interne ou actions persistantes.

Navigation retour: fil d'Ariane present, mais pas de retour bas de page ni navigation these suivante/precedente.

Related content: non implemente; tags visuels sans liens operationnels.

Loading/error states: skeleton et etat erreur existent, ce qui est positif. La redirection automatique peut cependant cacher la cause exacte de l'echec.

## Pourquoi ce n'est pas encore premium
Le template generic ne couvre pas les usages académiques: consultation du PDF, tri par thematique, comparaison rapide entre theses, et transparence de metadonnees scientifiques. Le rendu est bon mais pas specialise.

## Risques UX/mobile
Sur mobile, la lecture textuelle est possible mais sans CTA clair vers document complet, ce qui peut reduire l'utilite. L'absence de related theses limite le temps de session. Les contenus longs sans structure peuvent provoquer abandon.

## Priorites
1. Ajouter metadonnees academiques au hero (auteur, annee, discipline).
2. Integrer CTA prioritaire vers viewer PDF.
3. Ajouter section theses similaires par mots cles.
4. Structurer le corps en blocs academiques standards.
5. Ajouter navigation retour + precedent/suivant.
