# Audit UX - /ordre/conseil-national

## Score global (/20)
Score actuel estime: **16.2/20**.  
Objectif explicite atteignable: **18/20** avec fiabilisation des contenus et meilleure profondeur d'information.

## Analyse bloc par bloc
La page est structuree en trois blocs visibles: hero avec statistiques, grille de cartes membres, puis modal de detail au clic. Le hero est efficace: titre clair, description concise, et trois `stat-card` qui orientent la lecture (membres, presidence, conseillers).  

La grille (`conseil-members-grid`) fonctionne tres bien visuellement. Les cartes mettent en avant photo, nom et role avec une distinction president/conseiller. L'interaction au clic vers modal est simple et intuitive. Le modal est propre (overlay, fermeture, photo, nom, role) et reste coherent avec la charte.

La limite principale vient du contenu: les photos sont des URLs Unsplash et plusieurs noms paraissent placeholders. Cela reduit la credibilite d'une page institutionnelle qui devrait etre la source officielle. De plus, la modal n'apporte presque pas d'information supplementaire (pas de mandat, pas de biographie courte, pas de contact institutionnel, pas de periode de fonction). Enfin, il manque un bloc de sortie type CTA (`Voir organigramme`, `Comprendre les missions de l'Ordre`) ou un mini-footer de navigation contextuelle.

## Pourquoi ce n'est pas encore premium
L'interface est proche du premium, mais le premium exige une triple qualite: **justesse des donnees**, **profondeur utile**, **parcours complet**. Ici, le design est bon, mais les donnees semblent demonstratives et la modal reste trop "vitrine". La page est donc jolie, mais pas encore assez robuste pour une consultation institutionnelle de reference.

## Risques UX/mobile
Sur mobile, la grille passe en mono-colonne, ce qui preserve la lisibilite. En revanche, la repetition de cartes peut allonger fortement la page. Le modal peut occuper presque tout l'ecran et rendre la fermeture moins evidente si le bouton est trop petit. Les animations de carte et zoom photo peuvent ajouter de la charge cognitive sur de vieux appareils.

## Priorites
1. Remplacer toutes les donnees demonstratives par des donnees institutionnelles verifiees.  
2. Enrichir la modal (mandat, commission, responsabilites, date de mise a jour).  
3. Ajouter un bloc CTA de fin vers `organigramme`, `a-propos`, `contact`.  
4. Introduire recherche/filtre leger (role ou commission) si la liste grandit.  
5. Renforcer les indices de fermeture modal et le confort clavier/mobile.  
