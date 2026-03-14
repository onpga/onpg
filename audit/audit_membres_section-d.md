# Audit UX - /membres/section-d

## Score global (/20)
Score actuel estime: **14.8/20**.  
Cible explicite: **17.5/20** apres renforcement fonctionnel et clarte des donnees.

## Analyse bloc par bloc
La page Section D (Fabricants & Grossistes) est bien structuree: hero de positionnement, recherche rapide, grille de cartes profils, etat de chargement/vide. Le hero est efficace et le compteur "Membres" donne un signal utile. Le design visuel est coherent avec les autres sections membres.

La grille de cartes est simple a parcourir: photo, nom, role, these. L'utilisation de `ProfileImage` et d'un style carte avec survol apporte une impression de qualite. L'ensemble est lisible et propre.

Les points faibles sont proches de Section C: styles inline importants dans les cartes, ce qui fragilise la cohesion avec le CSS dedie et complexifie la maintenance. La recherche unique limite l'exploration avancee quand la base grandit. L'absence de tri, pagination et fiche detail empeche une experience vraiment professionnelle. Enfin, l'usage de donnees mock en fallback peut brouiller la fiabilite percue.

La page ne propose pas non plus de navigation de sortie riche (vers tableau complet, autres sections, contenus reglementaires lies aux fabricants/grossistes). Le parcours visiteur reste donc incomplet.

## Pourquoi ce n'est pas encore premium
Le rendu visuel est bon, mais le premium repose sur la combinaison design + precision + productivite. Ici, la precision data et la profondeur de consultation sont encore limitees. L'utilisateur trouve des profils, mais ne dispose pas d'un cadre complet pour rechercher, comparer et poursuivre son action.

## Risques UX/mobile
Sur mobile, la lisibilite de carte est correcte mais le scroll peut vite s'allonger. Les interactions hover ne sont pas exploitables au tactile. Les styles inline peuvent rendre les ajustements device-specific plus difficiles. En cas de grande volumetrie, le confort diminue faute de pagination.

## Priorites
1. Migrer les styles inline vers CSS pour une base UI stable.  
2. Introduire tri + pagination + filtres role/metier.  
3. Ajouter navigation vers tableau global et autres sections.  
4. Afficher clairement l'origine et la date de mise a jour des donnees.  
5. Supprimer les mocks en public au profit d'etats vides institutionnels.  
