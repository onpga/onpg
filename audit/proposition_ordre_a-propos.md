# Proposition UX premium - /ordre/a-propos

## Objectif premium
Faire de cette page une **porte d'entree institutionnelle de reference**: comprehension immediate de la mission ONPG, navigation fluide vers les pages filles (organigramme, conseil, sections membres), et conversion vers les CTA prioritaires. Cible: passer de 15.8/20 a **18.5/20** avec une experience plus guidee et plus probante.

## Plan d'amelioration par blocs
Pour le hero, conserver le style mais ajouter deux actions visibles sous les highlights: `Comprendre nos missions` (ancre mission) et `Voir l'organisation` (ancre organisation). Integrer un court indicateur "Derniere mise a jour institutionnelle" pour credibilite.  

Sur la navigation interne, introduire un etat actif dynamique (mission/valeurs/organisation) et un bouton "Retour en haut". Sur desktop, garder la barre compacte; sur mobile, basculer en tabs horizontaux scrollables.

Dans les cartes mission, ajouter un micro-CTA par carte ("En savoir plus") vers pages connexes (`/ordre/sante-publique`, `/ordre/defense-professionnelle`, ressources deontologie/formation). Pour les valeurs, introduire un niveau de preuve: exemple concret ou engagement observable par valeur.

Dans le bloc organisation, transformer les liens existants en mini-hub: cartes courtes pour `Organigramme`, `Conseil National`, `Sections A/B/C/D`, `Tableau de l'Ordre`. Ajouter un texte explicite sur la provenance du nombre de pharmaciens afin d'eviter toute ambiguite.

Enfin, dans la section CTA, prioriser un bouton primaire unique selon l'objectif principal (ex: Tableau), puis un secondaire (Contact), avec labels orientes resultat.

## Responsive mobile
Reduire les marges verticales de section et la taille des effets decoratifs sous 768px pour limiter la fatigue de scroll. Passer les grilles mission/valeurs en cartes plus compactes avec titre + resume + action. Ajouter une ancre flottante discrete "Sommaire" et corriger les offsets de scroll pour les sections ciblees.

## Accessibilite
Verifier les contrastes sur tous les textes verts et overlays. Ajouter des styles `focus-visible` explicites sur liens de navigation interne et boutons CTA. S'assurer que les icones decoratives ne perturbent pas les lecteurs d'ecran (aria-hidden). Fournir des intitulés de liens plus explicites ("Voir l'organigramme institutionnel ONPG").

## Mesure de succes
Mesurer: taux de clic vers `organigramme`/`conseil-national`, profondeur de scroll jusqu'au CTA final, temps moyen sur page et taux d'utilisation des ancres. Succès attendu: +25% de clics vers pages institutionnelles et +15% d'atteinte du bloc CTA final.

## Estimation impact
Impact fort sur la comprehension de l'ONPG et la fluidite du parcours visiteur. Effort moyen (UX/UI + front), car la structure existe deja. Gain attendu: perception plus premium, meilleure orientation inter-pages, diminution des sorties sans action.
