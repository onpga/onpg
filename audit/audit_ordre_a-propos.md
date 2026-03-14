# Audit UX - /ordre/a-propos

## Score global (/20)
Score actuel estime: **15.8/20**.  
Cible realiste a court terme: **18/20** si les optimisations de structure mobile, de lisibilite et de parcours CTA sont appliquees.

## Analyse bloc par bloc
La page est riche et bien decoupee: hero institutionnel avec highlights, navigation interne par ancres, section mission (cards interactives), section valeurs (cards), section organisation (texte + visualisation), puis CTA final. La hierarchie visuelle est claire et la promesse de page est comprise en quelques secondes. Le hero fonctionne bien avec un titre en deux niveaux et des points d'identite ("Institution Officielle", "Excellence Professionnelle", "Service Public").  

Le bloc `ordre-nav` aide la lecture longue en proposant des sauts vers mission/valeurs/organisation. Les missions sont bien articulees en grille, avec effets hover et accent couleur par carte, ce qui facilite le balayage. Les valeurs poursuivent la logique, mais leur densite textuelle reste assez uniforme: on lit tout au meme rythme, sans vrai niveau de priorite. Le bloc organisation est utile, notamment avec les liens vers `organigramme` et `conseil-national`, ainsi que le sous-bloc visuel des niveaux de gouvernance. Enfin, le CTA de fin oriente vers `tableau-ordre` et `contact`, ce qui donne une sortie claire.

## Pourquoi ce n'est pas encore premium
Le niveau premium n'est pas atteint pour trois raisons principales. D'abord, l'interaction est surtout cosmetique (hover) et peu orientee "action": les cartes ne debouchent pas vers des contenus detailes ou preuves concretes. Ensuite, la navigation interne est utile mais manque de feedback de progression (section active, lecture terminee, retour en haut). Enfin, la credibilite peut etre renforcee: l'organisation visuelle annonce "25 membres elus" et "4 sections", mais la page ne met pas encore assez de preuves contextuelles (date de mise a jour, source des chiffres, liens profonds vers pages de reference).

## Risques UX/mobile
Sur mobile, la page concentre beaucoup d'effets visuels, de grandes paddings et de blocs successifs. Le risque principal est une fatigue de scroll avant d'atteindre le CTA final. Les ancres internes peuvent manquer de precision si un header fixe masque le debut de section. Les cartes mission/valeurs restent lisibles, mais la densite cumulative (plusieurs grilles + visualisation organisation) peut donner une sensation de repetitivite. Les interactions `hover` perdent aussi de leur valeur sur tactile.

## Priorites
1. Mettre en avant des CTA intermediaires dans mission/valeurs (ex: "Voir la section associee", "Consulter un texte de reference").  
2. Ajouter un etat de progression dans la nav interne (section active + retour haut).  
3. Renforcer la preuve institutionnelle: timestamp de mise a jour, source des donnees affichees, liens profonds documentaires.  
4. Reduire la fatigue mobile: espacement adaptatif plus agressif sous 768px et simplification des effets decoratifs.  
5. Transformer la section organisation en bloc plus actionnable (raccourcis vers sections A/B/C/D, Conseil, Tableau).  
