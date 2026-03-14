# Audit UX - /membres/section-b

## Score global (/20)
Score actuel estime: **15.0/20**.  
Cible explicite: **17.6/20** avec renforcement fonctionnel et confiance des donnees.

## Analyse bloc par bloc
La page Section B (Biologistes) est claire: hero de presentation, recherche textuelle, grille de cartes avec photo/nom/role/these, et etats chargement ou vide. Le hero fonctionne bien avec son positionnement metier et le compteur de biologistes. La lecture initiale est rapide et conforme a l'objectif.

Le bloc de recherche est simple et efficace pour des besoins basiques. La grille `pharmaciens-grid` apporte une experience visuelle agreable; les cartes ont une animation legere et un style coherent avec la charte membres. Les contenus role + these donnent un minimum de contexte professionnel.

Comme pour d'autres sections, la page est freinee par la logique de fallback mock en cas d'absence de donnees reelles. C'est utile techniquement mais risqué pour une page publique, car la distinction entre donnees officielles et demonstration n'est pas visible. De plus, la recherche seule ne suffit pas quand la liste s'etoffe: pas de tri, pas de filtre secondaire, pas de pagination, pas de vue alternative.

Enfin, il manque un bloc de navigation croisee (vers Section A/C/D ou tableau global). L'utilisateur peut consulter la liste mais sans parcours riche.

## Pourquoi ce n'est pas encore premium
Le design est propre, mais l'experience premium exige robustesse informationnelle et productivite de consultation. Ici, l'experience reste minimaliste: une liste jolie, peu d'outils d'exploration, peu de transparence sur la fraicheur des donnees. La valeur "institutionnelle" n'est pas encore pleinement tangible.

## Risques UX/mobile
En mobile, la grille se simplifie bien mais cree un scroll potentiellement long sans pagination. Les effets hover sont peu utiles en tactile. Le champ recherche unique peut devenir frustrant si l'utilisateur ne connait pas exactement le profil cherche. Risque de sortie precoce faute de guidage.

## Priorites
1. Afficher clairement l'etat des donnees (officielles/mise a jour) et desactiver mocks en prod.  
2. Ajouter tri, filtres role et pagination legere.  
3. Integrer un lien vers `tableau-ordre` prefiltre Section B pour parcours complet.  
4. Ajouter navigation inter-sections en bas de page.  
5. Standardiser les etats vide/erreur avec message institutionnel explicite.  
