# Audit UX - /ordre/organigramme

## Score global (/20)
Score actuel estime: **14.9/20**.  
Objectif realiste: **17.8/20** en renforcant lisibilite hierarchique, accessibilite et usage mobile.

## Analyse bloc par bloc
La page repose sur deux blocs majeurs: un hero institutionnel simple, puis un grand bloc `organigramme-section` avec structure visuelle premium (noeuds, connecteurs, branches, grille de conseillers). L'intention est excellente: offrir une lecture immediate de la gouvernance. Les noeuds sont bien styles (`org-node-ordre`, `org-node-president`, `org-node-section`, `org-node-conseiller`) et les transitions rendent l'ensemble vivant.

Le hero remplit son role d'introduction, mais il est tres court et ne prepare pas assez la lecture de l'organigramme (pas de legende, pas de mode d'emploi). Le coeur de page fonctionne bien en desktop: l'axe Ordre -> Presidence -> Secretariat/Sections -> Conseillers est identifiable. Les connecteurs graphiques et les effets de profondeur donnent une perception qualitative.

Cependant, certaines informations critiques sont placeholders (`—` pour secretaire et conseillers), ce qui diminue la confiance. Les sections A/B/C/D sont nommees correctement, mais sans liens vers leurs pages detaillees. Il n'y a pas de CTA explicite en bas (ex: voir Conseil National, contacter l'Ordre, comprendre les missions). Le parcours se termine abruptement.

## Pourquoi ce n'est pas encore premium
Le design est premium, mais l'experience ne l'est pas completement. Premier frein: valeur informationnelle inegale (structure riche, donnees partielles). Deuxieme frein: manque de fonctionnalites de comprehension (legende des roles, filtre par niveau, etat "qui fait quoi"). Troisieme frein: absence de sortie actionnable en fin de page. En l'etat, la page est surtout contemplative.

## Risques UX/mobile
Sur mobile, l'organigramme peut devenir dense malgre les media queries: gros blocs successifs, forte hauteur verticale, et connecteurs moins explicites. Les effets hover ne servent presque plus sur tactile. Les animations/ombres nombreuses peuvent aussi fatiguer des appareils modestes, meme si `prefers-reduced-motion` est partiellement pris en compte. Le risque principal: comprehension partielle de la hierarchie, surtout sans legende textuelle persistante.

## Priorites
1. Completer les donnees manquantes (noms/fonctions) ou afficher clairement "poste a pourvoir".  
2. Ajouter une legende fonctionnelle (niveaux de gouvernance, role des sections, role des conseillers).  
3. Rendre les noeuds sections cliquables vers `/membres/section-a` a `/section-d`.  
4. Ajouter un bloc CTA final vers `conseil-national`, `a-propos`, `contact`.  
5. Simplifier l'affichage mobile (mode liste hierarchique en option sous 768px).  
