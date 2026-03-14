# Proposition UX premium - /membres/tableau-ordre

## Objectif premium
Consolider cette page comme **registre public de reference**, rapide a filtrer, fiable et exploitable sur mobile. Cible: faire evoluer la note vers **19/20**.

## Plan d'amelioration par blocs
Dans le hero, ajouter un sous-texte de confiance: "registre mis a jour le ...", et un lien `Comprendre les sections` ouvrant une aide concise.  

Dans le bloc filtres, conserver la structure actuelle mais ajouter:
- chips de filtres actifs visibles,
- aide contextuelle A/B/C/D,
- mode "recherche avancee" (nom exact, section, ordre alphabétique).  
Ajouter aussi un comportement persistant de filtres via URL (`?q=&section=&sort=`) pour partage et reprise de session.

Dans le bloc resultats, proposer une ligne d'actions premium: export CSV (si autorise), copie lien filtre, et tri secondaire. Conserver le toggle tableau/cartes, mais memoriser la preference utilisateur localement.

Pour la vue table, ajouter colonnes optionnelles (role, ville) et un clic ligne pour ouvrir une fiche detail. Pour la vue cartes, harmoniser hauteur des cartes et afficher un tag "profil complet/incomplet".  

En pagination, conserver le systeme intelligent mais ajouter un select "resultats/page" (12/24/48) pour les usages pros.

## Responsive mobile
Revoir la pile sticky: fusionner toggle + resume filtres dans une seule barre compacte. Sur <=480px, privilegier la vue cartes par defaut avec bascule rapide vers table simplifiee. Eviter que les controles occupent plus de 25% de la hauteur visible.

## Accessibilite
Verifier contrastes des badges section et boutons actifs/inactifs. Renforcer `focus-visible` sur controles de filtre, pagination, toggle de vue. Ajouter labels ARIA clairs sur boutons icones (table/cartes, recherche, effacer). Garantir navigation clavier complete y compris dans sticky.

## Mesure de succes
KPI: temps moyen pour trouver un profil, taux d'utilisation filtres, conversion table/cartes, taux de clic sur fiches detail, abandon mobile. Cibles: -20% temps de recherche, +30% interactions utiles, +15% satisfaction mobile.

## Estimation impact
Impact eleve et rapide: la base UX est deja solide, les gains viennent de la couche confiance + personnalisation + detail fiche. Effort moyen (front + quelques evolutions data). Le retour se verra immediatement sur l'usage pro quotidien.
