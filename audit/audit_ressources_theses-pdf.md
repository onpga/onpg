## Score global (/20)
11/20. La page `/ressources/theses/:id/pdf` remplit sa fonction principale (afficher un PDF en iframe) mais reste tres utilitaire, avec une experience peu premium sur navigation, resilience et accompagnement de lecture.

## Analyse bloc par bloc
Le hero reprend les classes de `Ressources.css` (`article-header`, breadcrumb, titre, meta auteur/id) et un bouton retour. C'est correct mais minimal: pas de date, pas de categorie, peu de contexte scientifique (ecole, specialite, resume).

La lisibilite textuelle est limitee car le coeur est un document embarque. Aucun bloc de synthese n'encadre la lecture avant l'iframe. Pour un usage visiteur, l'absence de resume nuit a la comprehension rapide.

Le media/doc embed est central: `iframe` pleine largeur avec hauteur `calc(100vh - 200px)`. C'est pratique sur desktop, mais fragile selon navigateurs, policies PDF, et tailles mobiles. Pas de bouton "ouvrir dans un nouvel onglet", "telecharger", ni fallback si embed bloque.

Sticky elements: absent, ce qui est acceptable. Cependant, la page n'offre pas d'actions persistantes (retour, telechargement, partage) pendant le scroll du document.

Navigation back: presente via bouton retour historique (`navigate(-1)`) et lien vers `/ressources/theses`. Bonne redondance.

Related content: inexistant (pas de theses similaires, meme auteur, meme thematique).

Loading/error: l'erreur `pdfUrl` manquant est geree avec un message. En revanche, aucun etat de chargement du PDF, ni detection d'echec d'affichage de l'iframe.

## Pourquoi ce n'est pas encore premium
L'interface est fonctionnelle mais pas editoriale. Une page premium de consultation documentaire doit offrir contexte, outils de lecture, fallback multiplateforme et continuation de parcours. Ici, on obtient surtout un conteneur iframe.

## Risques UX/mobile
Sur mobile, la hauteur fixe peut produire une zone inconfortable et des comportements varies selon navigateur. Le retour historique peut echouer si acces direct. Sans actions persistantes, l'utilisateur peut sortir sans explorer d'autres theses.

## Priorites
1. Ajouter bloc contexte these (auteur, annee, mots cles, resume).
2. Ajouter boutons ouvrir/telecharger PDF + fallback si iframe echoue.
3. Ajouter theses liees en bas de page.
4. Ajouter barre d'actions compacte mobile (retour, partager, telecharger).
5. Instrumenter etat de chargement/erreur du document embarque.
