## Objectif premium
Faire de `/ressources/commissions/:id` une fiche institutionnelle premium orientee transparence, gouvernance et navigation transverse.

## Plan d'amelioration par blocs
Bloc hero/meta/date/categorie: conserver le hero qualitatif actuel, ajouter mandat, perimetre, et indicateur d'activite recente. Rendre le statut plus explicite (active, suspendue, archivee).

Bloc lisibilite contenu: enrichir les sections existantes avec sous-blocs standards: objectifs, livrables, calendrier de reunions, resultats clefs.

Bloc media/document: ajouter un bloc "Documents de la commission" (reglement interne, comptes rendus, rapports), avec ouverture/telechargement.

Bloc sticky: introduire mini-nav sticky desktop vers sections (Presentation, Missions, Membres, Documents). Sur mobile, transformer en sommaire repliable.

Bloc navigation back: conserver bouton retour, ajouter commission precedente/suivante et lien explicite vers la liste des commissions hors contexte tab.

Bloc related content: ajouter "Ressources associees" (decisions, decrets, lois) selon categorie/missions. Rendre membres cliquables vers leurs fiches si disponibles.

Bloc loading/error: remplacer transitions silencieuses par etat erreur clair avec retry, lien liste, et message cause probable.

## Responsive mobile
Mettre les sections en accordions, optimiser grille membres en cartes simples, et fournir actions fixes (retour, documents, partager) en bas d'ecran.

## Accessibilite
Ajouter labels ARIA aux actions, verifier contrastes des badges statut/categorie, focus visible sur cartes membres et liens documents, et structure semantique claire des titres.

## Mesure de succes
KPI: +25% clics sur documents de commission, +20% navigation vers ressources associees, hausse du temps moyen de consultation, reduction des sorties apres visite unique.

## Estimation impact
Impact fort sur perception de transparence. Effort moyen (donnees doc + maillage + navigation). Retour attendu eleve pour usagers institutionnels et professionnels.
