# Proposition UX premium - /ordre/organigramme

## Objectif premium
Transformer la page en **organigramme institutionnel interactif et fiable**, lisible en 30 secondes sur mobile comme desktop, avec sorties claires vers les pages de contexte. Cible: **17.8 a 18.3/20**.

## Plan d'amelioration par blocs
Conserver le hero mais y ajouter un sous-bloc utile: "Comment lire cet organigramme" (3 lignes max) + deux boutons: `Voir le Conseil National` et `Voir les sections membres`.  

Dans le bloc principal, enrichir chaque noeud avec metadonnees minimales: statut du poste, date de mise a jour, lien vers fiche detaillee si disponible. Pour les noeuds actuellement vides (`—`), afficher des etiquettes explicites: "Nom non publie" ou "Poste vacant", afin d'eviter l'impression d'erreur.

Rendre les sections A/B/C/D actionnables (liens directs). Ajouter des info-bulles accessibles sur icones (couronne, plume, personne) pour expliquer la fonction institutionnelle. Introduire un toggle de vue: `Schema` (actuel) / `Liste` (hierarchie textuelle compacte).

Ajouter un bloc final "Aller plus loin" avec trois CTA: `Conseil National`, `A propos de l'ONPG`, `Contact institutionnel`. Cette fin de page est necessaire pour convertir une visite informative en action concrete.

## Responsive mobile
Sous 768px, activer par defaut la vue `Liste` avec indentation claire (Ordre > Presidence > Secretariat/Sections > Conseillers). Proposer le schema graphique en mode optionnel. Reduire ombres/animations et paddings verticaux pour accelerer le scroll. Conserver des cibles tactiles larges pour chaque noeud cliquable.

## Accessibilite
Donner des labels ARIA sur les noeuds cliquables et sur les connecteurs decoratifs (ou `aria-hidden` pour ceux purement visuels). Verifier contrastes des textes dans les badges/fonds verts. Ajouter styles `focus-visible` evidents pour navigation clavier. Fournir un ordre de tabulation coherent du haut vers le bas de la hierarchie.

## Mesure de succes
KPI: taux de clic vers sections A/B/C/D, clic vers `conseil-national`, part des utilisateurs mobile qui atteignent le bas de page, temps moyen de comprehension (proxy: interaction avec toggle schema/liste). Cible: +30% de clics sortants utiles et baisse des sorties immediates.

## Estimation impact
Impact eleve sur la confiance institutionnelle: la page deviendra non seulement elegante mais exploitable. Effort moyen a eleve (donnees + UX + logique de vue alternative). Retour attendu important pour la lisibilite publique et la navigation inter-pages.
