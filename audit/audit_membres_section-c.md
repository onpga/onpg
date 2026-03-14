# Audit UX - /membres/section-c

## Score global (/20)
Score actuel estime: **14.6/20**.  
Cible explicite: **17.4/20** avec uniformisation UI, fiabilite data et parcours plus actionnable.

## Analyse bloc par bloc
La page Section C (Fonctionnaires) reprend la structure standard: hero, recherche, grille de cartes. Le hero est lisible, avec compteur et promesse claire. La recherche textuelle couvre les besoins de base et le rendu general reste coherent avec la famille membres.

Le coeur de la page est une grille de profils alimentee par donnees API, avec fallback mock. Les cartes affichent photo, nom, role et these. Le contenu est utile, mais la page presente une heterogeneite technique: une part importante du style des cartes est geree inline dans le TSX (couleurs, ombres, hover, layout), alors qu'un CSS dedie existe aussi. Cette double logique peut creer des divergences visuelles et compliquer la maintenance premium.

Autre limite: absence de tri, pagination et navigation detaillee vers fiche pharmacien. Quand la section grandira, l'exploration deviendra moins efficace. Enfin, les fallback mocks restent un point de confiance fragile sur une page institutionnelle publique.

## Pourquoi ce n'est pas encore premium
Le rendu est plaisant, mais l'experience premium demande coherence systemique. Ici, on ressent encore une page "intermediaire": bonne presentation, mais mecanismes fonctionnels incomplets et architecture de style partiellement dupliquee. Le premium exige une base robuste, previsible et transparence sur la source des informations.

## Risques UX/mobile
Sur mobile, la lecture carte par carte fonctionne bien, mais le scroll peut devenir long sans pagination. Les effets hover inline n'apportent pas de valeur tactile. Le style inline peut aussi rendre les ajustements responsives moins fins qu'un pilotage CSS centralise. Risque de disparites entre devices.

## Priorites
1. Centraliser le style des cartes dans le CSS (reduire les styles inline).  
2. Supprimer les mocks en environnement public et afficher un etat vide officiel.  
3. Ajouter tri, pagination et lien vers fiche detail / tableau complet.  
4. Afficher date de mise a jour des profils Section C.  
5. Ajouter navigation inter-sections pour eviter la page en cul-de-sac.  
