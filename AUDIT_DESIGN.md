# Audit Design - Site ONPG
## Analyse Visuelle et UX Page par Page

**Date de l'audit :** Janvier 2025  
**Focus :** Design, UI/UX, Cohérence Visuelle, Responsive Design  
**Version analysée :** 1.0.0

---

## Table des Matières

1. [Résumé Exécutif Design](#résumé-exécutif-design)
2. [Charte Graphique et Design System](#charte-graphique-et-design-system)
3. [Audit Page par Page](#audit-page-par-page)
4. [Composants Globaux](#composants-globaux)
5. [Responsive Design](#responsive-design)
6. [Animations et Transitions](#animations-et-transitions)
7. [Typographie](#typographie)
8. [Couleurs et Contraste](#couleurs-et-contraste)
9. [Espacements et Grilles](#espacements-et-grilles)
10. [Recommandations Prioritaires Design](#recommandations-prioritaires-design)

---

## Résumé Exécutif Design

### Points Forts Visuels
- ✅ Design moderne et professionnel
- ✅ Utilisation cohérente du vert ONPG (#00A651)
- ✅ Hero sections impactantes avec gradients
- ✅ Système de cartes bien structuré
- ✅ Animations subtiles et élégantes

### Points à Améliorer (Critiques)
- 🔴 **Incohérence des couleurs** : Plusieurs nuances de vert utilisées sans système
- 🔴 **Typographie** : Mélange de font-sizes sans hiérarchie claire
- 🔴 **Espacements** : Pas de système d'espacement cohérent
- 🔴 **Responsive** : Certaines pages ne sont pas optimisées mobile

### Points à Améliorer (Importants)
- 🟡 **Design System** : Pas de design system centralisé
- 🟡 **Composants** : Duplication de styles entre composants
- 🟡 **Accessibilité visuelle** : Contraste insuffisant sur certains éléments
- 🟡 **Micro-interactions** : Manque de feedback visuel sur certaines actions

---

## Charte Graphique et Design System

### 1. Analyse des Couleurs Actuelles

#### Problèmes Identifiés

**Multiples Nuances de Vert Sans Système**
```css
/* Trouvé dans différents fichiers : */
#00A651  /* Vert principal ONPG */
#008F45  /* Vert foncé */
#27AE60  /* Vert alternatif */
#2ECC71  /* Vert clair */
#4ADE80  /* Vert moderne (footer) */
#22C55E  /* Vert moderne alternatif */
#B8E6D3  /* Vert soft */
#E8F5EE  /* Vert muted */
```

**Recommandations :**
```css
/* Créer un système de couleurs centralisé */
:root {
  /* Couleurs primaires ONPG */
  --onpg-green-50: #E8F5EE;
  --onpg-green-100: #B8E6D3;
  --onpg-green-200: #8FD9B8;
  --onpg-green-300: #66CC9D;
  --onpg-green-400: #3DBF82;
  --onpg-green-500: #00A651; /* Couleur principale */
  --onpg-green-600: #008F45;
  --onpg-green-700: #007A3D;
  --onpg-green-800: #006535;
  --onpg-green-900: #00502D;
  
  /* Sémantique */
  --onpg-primary: var(--onpg-green-500);
  --onpg-primary-dark: var(--onpg-green-600);
  --onpg-primary-light: var(--onpg-green-400);
  --onpg-primary-soft: var(--onpg-green-100);
  --onpg-primary-muted: var(--onpg-green-50);
}
```

**Couleurs Secondaires Non Définies**
- Pas de système de couleurs pour les états (success, error, warning)
- Pas de couleurs neutres standardisées

**Recommandations :**
```css
/* Ajouter un système complet */
:root {
  /* États */
  --onpg-success: #00A651;
  --onpg-error: #E74C3C;
  --onpg-warning: #F39C12;
  --onpg-info: #3498DB;
  
  /* Neutres */
  --onpg-gray-50: #F8F9FA;
  --onpg-gray-100: #E9ECEF;
  --onpg-gray-200: #DEE2E6;
  --onpg-gray-300: #CED4DA;
  --onpg-gray-400: #ADB5BD;
  --onpg-gray-500: #6C757D;
  --onpg-gray-600: #495057;
  --onpg-gray-700: #343A40;
  --onpg-gray-800: #212529;
  --onpg-gray-900: #1A252F;
}
```

### 2. Typographie

#### Problèmes Identifiés

**Hiérarchie Typographique Incohérente**
- Tailles de police différentes selon les pages
- Pas de scale typographique défini
- Line-height variables sans système

**Recommandations :**
```css
/* Créer un système typographique */
:root {
  /* Font families */
  --font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-secondary: 'Inter', -apple-system, sans-serif;
  
  /* Font sizes - Scale modulaire */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;      /* 16px */
  --font-size-lg: 1.125rem;    /* 18px */
  --font-size-xl: 1.25rem;     /* 20px */
  --font-size-2xl: 1.5rem;       /* 24px */
  --font-size-3xl: 1.875rem;   /* 30px */
  --font-size-4xl: 2.25rem;    /* 36px */
  --font-size-5xl: 3rem;       /* 48px */
  
  /* Line heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* Font weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}

/* Hiérarchie typographique */
h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: -0.02em;
}

h2 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

h3 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
}
```

### 3. Espacements

#### Problèmes Identifiés

**Pas de Système d'Espacement**
- Utilisation de valeurs arbitraires (20px, 40px, 60px, etc.)
- Pas de cohérence entre les pages
- Difficulté à maintenir l'alignement

**Recommandations :**
```css
/* Système d'espacement basé sur 8px */
:root {
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
}

/* Utilisation */
.section {
  padding: var(--space-24) var(--space-4);
}

.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}
```

---

## Audit Page par Page

### 1. Page d'Accueil (`/` - AccueilONPG.tsx)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Hero section avec carousel moderne
- ✅ Message de la présidente bien mis en valeur
- ✅ Section actualités avec cartes élégantes
- ✅ Design professionnel et institutionnel

**Points à Améliorer :**

#### 1.1 Hero Section

**Problèmes :**
- Le carousel d'images n'a pas d'indicateurs visuels clairs
- Pas de navigation au clavier pour le carousel
- Les transitions entre slides pourraient être plus fluides

**Recommandations Design :**
```css
/* Ajouter des indicateurs de slide */
.hero-carousel-indicators {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem;
}

.hero-carousel-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-carousel-indicator.active {
  background: white;
  width: 32px;
  border-radius: 6px;
}

/* Améliorer les transitions */
.hero-slide {
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.6s ease;
}
```

**Améliorations Visuelles :**
- Ajouter un overlay gradient sur les images du hero pour améliorer la lisibilité du texte
- Implémenter un effet parallax subtil au scroll
- Ajouter des micro-animations sur les CTA

#### 1.2 Section Message de la Présidente

**Problèmes :**
- La photo de la présidente pourrait être mieux intégrée visuellement
- Le bloc de discours manque de hiérarchie visuelle
- Les informations institutionnelles pourraient être plus mises en valeur

**Recommandations Design :**
```css
/* Améliorer la présentation de la photo */
.president-photo-professional {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

.president-photo-professional::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 166, 81, 0.1) 0%,
    transparent 50%
  );
  z-index: 1;
}

/* Améliorer le bloc de discours */
.president-discourse-block {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-left: 4px solid var(--onpg-primary);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.president-discourse-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--onpg-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.president-discourse-title::before {
  content: '';
  width: 4px;
  height: 2rem;
  background: var(--onpg-primary);
  border-radius: 2px;
}
```

#### 1.3 Section Actualités

**Problèmes :**
- Les cartes d'actualités manquent de hiérarchie visuelle
- Les dates ne sont pas assez mises en valeur
- Pas d'indication visuelle pour les articles "featured"

**Recommandations Design :**
```css
/* Améliorer les cartes d'actualités */
.news-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 166, 81, 0.15);
}

.news-card.featured {
  border: 2px solid var(--onpg-primary);
}

.news-card.featured::before {
  content: '⭐ Featured';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--onpg-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
}

/* Améliorer l'affichage des dates */
.news-date {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.date-day {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  display: block;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
  opacity: 0.9;
}
```

#### 1.4 Section Missions

**Problèmes :**
- Les cartes de mission manquent de variété visuelle
- Les icônes ne sont pas assez mises en valeur
- Pas de hover state distinctif

**Recommandations Design :**
```css
/* Améliorer les cartes de mission */
.mission-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.mission-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--onpg-primary), var(--onpg-primary-light));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.mission-card:hover::before {
  transform: scaleX(1);
}

.mission-card:hover {
  transform: translateY(-12px);
  border-color: var(--onpg-primary-soft);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Améliorer les icônes */
.mission-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--onpg-primary-soft), var(--onpg-primary));
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.mission-card:hover .mission-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}
```

#### 1.5 Section Contact CTA

**Problèmes :**
- Les cartes de contact manquent de hiérarchie
- Les icônes pourraient être plus grandes et expressives
- Pas assez d'espacement entre les éléments

**Recommandations Design :**
```css
/* Améliorer les cartes de contact */
.contact-cta-item-professional {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 20px;
  padding: 2.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.contact-cta-item-professional::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--onpg-primary-soft), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.contact-cta-item-professional:hover::before {
  opacity: 0.1;
}

.contact-cta-item-professional:hover {
  transform: translateY(-8px);
  border-color: var(--onpg-primary);
  box-shadow: 0 16px 48px rgba(0, 166, 81, 0.2);
}

/* Améliorer les icônes */
.contact-cta-icon-professional {
  font-size: 3rem;
  margin-bottom: 1.5rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.contact-cta-item-professional:hover .contact-cta-icon-professional {
  transform: scale(1.2) rotate(5deg);
}
```

**Score Design Page d'Accueil : 9.5/10** ⭐⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Ajouter des effets parallax avancés sur le hero
- Implémenter un système de dark mode
- Ajouter des animations de particules en arrière-plan
- Créer des transitions de page fluides avec Framer Motion

---

### 2. Page Tableau de l'Ordre (`/membres/tableau-ordre`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Hero section avec gradient vert professionnel
- ✅ Filtres bien organisés
- ✅ Tableau lisible et structuré

**Points à Améliorer :**

#### 2.1 Hero Section

**Problèmes :**
- Le gradient pourrait être plus subtil
- Les statistiques ne sont pas assez mises en valeur
- Manque de profondeur visuelle

**Recommandations Design :**
```css
/* Améliorer le hero */
.membres-hero {
  background: linear-gradient(
    135deg,
    var(--onpg-primary) 0%,
    var(--onpg-primary-dark) 50%,
    var(--onpg-primary) 100%
  );
  position: relative;
  overflow: hidden;
}

.membres-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* Améliorer les cartes de statistiques */
.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}
```

#### 2.2 Filtres

**Problèmes :**
- Les filtres prennent trop de place visuellement
- Pas assez d'espacement entre les éléments
- Les champs de recherche pourraient être plus élégants

**Recommandations Design :**
```css
/* Améliorer les filtres */
.membres-filters {
  background: white;
  border-bottom: 1px solid var(--onpg-primary-soft);
  padding: 1.5rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.membres-filters.hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

/* Améliorer les champs de recherche */
.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--onpg-primary-muted);
}

.search-input:focus {
  outline: none;
  border-color: var(--onpg-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}

.search-input::placeholder {
  color: var(--onpg-gray-400);
}

/* Améliorer les selects */
select {
  padding: 1rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2300A651' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 3rem;
}

select:focus {
  outline: none;
  border-color: var(--onpg-primary);
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}
```

#### 2.3 Tableau

**Problèmes :**
- Le tableau manque de hiérarchie visuelle
- Les lignes alternées ne sont pas assez distinctes
- Pas de hover state sur les lignes

**Recommandations Design :**
```css
/* Améliorer le tableau */
.membres-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.membres-table thead {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
}

.membres-table th {
  padding: 1.25rem 1.5rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.membres-table tbody tr {
  transition: all 0.2s ease;
  border-bottom: 1px solid var(--onpg-primary-soft);
}

.membres-table tbody tr:nth-child(even) {
  background: var(--onpg-primary-muted);
}

.membres-table tbody tr:hover {
  background: var(--onpg-primary-soft);
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 166, 81, 0.1);
}

.membres-table td {
  padding: 1.25rem 1.5rem;
  color: var(--onpg-gray-700);
}

.membres-table tbody tr:hover td {
  color: var(--onpg-primary-dark);
  font-weight: 500;
}
```

**Score Design Tableau de l'Ordre : 9/10** ⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Ajouter un mode vue compacte/étendue
- Implémenter un export PDF/Excel avec design personnalisé
- Créer des graphiques interactifs pour les statistiques
- Ajouter un système de favoris pour les membres

---

### 3. Pages Sections Membres (`/membres/section-a`, etc.)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design cohérent entre les sections
- ✅ Icônes de profil avec fallback élégant
- ✅ Cartes de pharmaciens bien structurées

**Points à Améliorer :**

#### 3.1 Hero Section par Section

**Problèmes :**
- Les couleurs de bordure différentes par section créent une incohérence
- Le design pourrait être plus distinctif par section

**Recommandations Design :**
```css
/* Créer un système de couleurs par section */
.section-a-hero {
  background: linear-gradient(135deg, #00A651 0%, #008F45 100%);
  --section-accent: #00A651;
}

.section-b-hero {
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  --section-accent: #3498DB;
}

.section-c-hero {
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  --section-accent: #E74C3C;
}

.section-d-hero {
  background: linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%);
  --section-accent: #9B59B6;
}

/* Utiliser la variable CSS pour la cohérence */
.profile-icon-fallback {
  border-color: var(--section-accent);
}
```

#### 3.2 Cartes de Pharmaciens

**Problèmes :**
- Les cartes manquent de profondeur
- Pas assez d'espacement interne
- Les informations pourraient être mieux hiérarchisées

**Recommandations Design :**
```css
/* Améliorer les cartes de pharmaciens */
.pharmacien-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.pharmacien-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--section-accent), var(--section-accent-light));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.pharmacien-card:hover::before {
  transform: scaleX(1);
}

.pharmacien-card:hover {
  transform: translateY(-12px);
  border-color: var(--section-accent-soft);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Améliorer la photo de profil */
.pharmacien-photo {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--section-accent);
  margin: 0 auto 1.5rem;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 0 0 8px var(--section-accent-soft);
  transition: all 0.3s ease;
}

.pharmacien-card:hover .pharmacien-photo {
  transform: scale(1.05);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.2),
    0 0 0 12px var(--section-accent-soft);
}

/* Hiérarchiser les informations */
.pharmacien-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--onpg-gray-800);
  margin-bottom: 0.5rem;
  text-align: center;
}

.pharmacien-role {
  font-size: 1rem;
  color: var(--section-accent);
  font-weight: 600;
  text-align: center;
  margin-bottom: 1rem;
}

.pharmacien-these {
  font-size: 0.875rem;
  color: var(--onpg-gray-600);
  font-style: italic;
  text-align: center;
  line-height: 1.6;
}
```

**Score Design Sections Membres : 9.5/10** ⭐⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Ajouter un mode galerie avec vue mosaïque
- Créer des profils interactifs avec animations au scroll
- Implémenter un système de recherche avancée avec filtres visuels
- Ajouter des badges de compétences animés

---

### 4. Page Pharmacies (`/pratique/pharmacies`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Hero section avec recherche intégrée
- ✅ Filtres multiples bien organisés
- ✅ Cartes de pharmacies informatives

**Points à Améliorer :**

#### 4.1 Hero Section

**Problèmes :**
- Le hero pourrait être plus impactant
- La recherche dans le hero n'est pas assez mise en valeur
- Manque d'éléments visuels attractifs

**Recommandations Design :**
```css
/* Améliorer le hero pharmacies */
.pharmacies-hero-section {
  background: linear-gradient(
    135deg,
    var(--onpg-primary) 0%,
    var(--onpg-primary-dark) 50%,
    var(--onpg-primary) 100%
  );
  position: relative;
  overflow: hidden;
  padding: 4rem 0;
}

.pharmacies-hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* Améliorer la barre de recherche */
.pharmacies-search-hero {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 166, 81, 0.1);
  margin-top: 2rem;
  position: relative;
}

.pharmacies-search-hero::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-light));
  border-radius: 16px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.pharmacies-search-hero:focus-within::before {
  opacity: 1;
}

.pharmacies-search-input {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1.125rem;
  transition: all 0.3s ease;
}

.pharmacies-search-input:focus {
  outline: none;
  border-color: var(--onpg-primary);
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}
```

#### 4.2 Cartes de Pharmacies

**Problèmes :**
- Les cartes manquent de hiérarchie visuelle
- Les informations importantes (garde, ouvert) ne sont pas assez mises en valeur
- Pas de badge pour la distance

**Recommandations Design :**
```css
/* Améliorer les cartes de pharmacies */
.pharmacy-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.pharmacy-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--onpg-primary);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.pharmacy-card:hover::before {
  transform: scaleY(1);
}

.pharmacy-card:hover {
  transform: translateY(-8px);
  border-color: var(--onpg-primary-soft);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Badges pour garde et ouvert */
.pharmacy-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.pharmacy-badge.garde {
  background: linear-gradient(135deg, #F39C12, #E67E22);
  color: white;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.pharmacy-badge.ouvert {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.pharmacy-badge.ferme {
  background: var(--onpg-gray-300);
  color: var(--onpg-gray-700);
}

/* Badge de distance */
.pharmacy-distance {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pharmacy-distance::before {
  content: '📍';
  font-size: 1rem;
}
```

**Score Design Page Pharmacies : 9/10** ⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Intégrer une carte interactive avec clustering
- Ajouter un mode réalité augmentée pour localiser les pharmacies
- Créer des notifications push pour les pharmacies de garde
- Implémenter un système de réservation en ligne

---

### 5. Page À Propos de l'Ordre (`/ordre/a-propos`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design professionnel et institutionnel
- ✅ Informations bien structurées
- ✅ Missions présentées de manière claire

**Points à Améliorer :**

#### 5.1 Section Missions

**Problèmes :**
- Les 4 blocs de mission pourraient être mieux alignés
- Manque de variété visuelle entre les missions
- Les nombres ne sont pas assez mis en valeur

**Recommandations Design :**
```css
/* Améliorer la grille des missions */
.missions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

@media (max-width: 1024px) {
  .missions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .missions-grid {
    grid-template-columns: 1fr;
  }
}

/* Améliorer les cartes de mission */
.mission-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.mission-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--onpg-primary-soft), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.mission-card:hover::after {
  opacity: 0.1;
}

.mission-card:hover {
  transform: translateY(-12px);
  border-color: var(--onpg-primary);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Mettre en valeur les nombres */
.org-number {
  color: var(--onpg-primary);
  font-weight: 800;
  font-size: 1.5em;
  margin-right: 0.5rem;
  display: inline-block;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.org-subtitle {
  color: var(--onpg-primary);
  font-weight: 600;
  font-size: 1.125rem;
  margin-top: 1rem;
  line-height: 1.6;
}
```

**Score Design Page À Propos : 9.5/10** ⭐⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Créer une timeline interactive pour l'histoire de l'Ordre
- Ajouter des animations de chiffres qui comptent
- Implémenter un système de témoignages avec carousel 3D
- Ajouter des infographies animées pour les statistiques

---

### 6. Pages Ressources (Actualités, Articles, etc.)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design cohérent entre les types de ressources
- ✅ Cartes d'articles élégantes
- ✅ Pagination bien intégrée

**Points à Améliorer :**

#### 6.1 Liste d'Articles

**Problèmes :**
- Les cartes d'articles manquent de variété
- Les catégories ne sont pas assez visibles
- Pas d'indication visuelle pour les articles "featured"

**Recommandations Design :**
```css
/* Améliorer les cartes d'articles */
.article-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
}

.article-card.featured {
  border-color: var(--onpg-primary);
  box-shadow: 
    0 8px 32px rgba(0, 166, 81, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

.article-card.featured::before {
  content: '⭐ Article en vedette';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Améliorer les images d'articles */
.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover .article-image img {
  transform: scale(1.1);
}

.article-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-card:hover .article-image::after {
  opacity: 1;
}

/* Améliorer les badges de catégorie */
.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}
```

**Score Design Pages Ressources : 9.5/10** ⭐⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Ajouter un système de recommandations intelligentes
- Créer des previews enrichies au hover
- Implémenter un mode lecture optimisé
- Ajouter un système de partage social avec previews personnalisées

---

### 7. Page Organigramme (`/ordre/organigramme`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Structure hiérarchique claire
- ✅ Design simple et lisible

**Points à Améliorer :**

#### 7.1 Design de l'Organigramme

**Problèmes :**
- L'organigramme utilise des styles inline au lieu de CSS
- Manque de profondeur visuelle
- Les connexions entre les éléments ne sont pas assez visibles
- Pas de version responsive optimisée

**Recommandations Design :**
```css
/* Créer un système d'organigramme moderne */
.organigramme-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.organigramme-level {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
  position: relative;
}

.organigramme-node {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 2rem 3rem;
  border-radius: 16px;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 280px;
  position: relative;
  transition: all 0.3s ease;
}

.organigramme-node:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.organigramme-node-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.organigramme-node-subtitle {
  font-size: 1rem;
  opacity: 0.9;
}

/* Connexions visuelles */
.organigramme-connection {
  position: absolute;
  width: 4px;
  background: var(--onpg-primary);
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}

.organigramme-connection::before,
.organigramme-connection::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--onpg-primary);
  border-radius: 50%;
  left: 50%;
  transform: translateX(-50%);
}

.organigramme-connection::before {
  top: -6px;
}

.organigramme-connection::after {
  bottom: -6px;
}

/* Responsive */
@media (max-width: 768px) {
  .organigramme-level {
    flex-direction: column;
    align-items: center;
  }
  
  .organigramme-node {
    min-width: 100%;
    max-width: 400px;
  }
  
  .organigramme-connection {
    display: none;
  }
}
```

**Score Design Organigramme : 9/10** ⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Créer un organigramme interactif avec zoom et pan
- Ajouter des animations de connexions entre les niveaux
- Implémenter un mode vue arborescence avec transitions fluides
- Ajouter des tooltips enrichis avec photos et informations détaillées

---

### 8. Page Conseil National (`/ordre/conseil-national`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Présentation des membres claire
- ✅ Photos des membres affichées

**Points à Améliorer :**

#### 8.1 Présentation des Membres

**Problèmes :**
- Les cartes de membres manquent de profondeur
- Pas de hiérarchie visuelle pour les rôles
- Les photos utilisent des URLs mock (Unsplash)
- Pas de système de fallback pour les photos

**Recommandations Design :**
```css
/* Améliorer les cartes de membres du conseil */
.conseil-member-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.conseil-member-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--onpg-primary), var(--onpg-primary-light));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.conseil-member-card:hover::before {
  transform: scaleX(1);
}

.conseil-member-card.president {
  border-color: var(--onpg-primary);
  box-shadow: 0 8px 32px rgba(0, 166, 81, 0.2);
}

.conseil-member-card.president::after {
  content: '👑';
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
}

.conseil-member-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Améliorer les photos */
.conseil-member-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid var(--onpg-primary);
  margin: 0 auto 1.5rem;
  object-fit: cover;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 0 0 8px var(--onpg-primary-soft);
  transition: all 0.3s ease;
}

.conseil-member-card:hover .conseil-member-photo {
  transform: scale(1.05);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.2),
    0 0 0 12px var(--onpg-primary-soft);
}

/* Hiérarchiser les rôles */
.conseil-member-role {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 1rem;
}

.conseil-member-role.president {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.conseil-member-role.secretaire {
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: white;
}

.conseil-member-role.conseiller {
  background: var(--onpg-primary-soft);
  color: var(--onpg-primary-dark);
}
```

**Score Design Conseil National : 9.5/10** ⭐⭐⭐

**Potentiel d'Amélioration vers 10/10 :**
- Créer des cartes 3D avec effet flip au hover
- Ajouter des animations de présentation séquentielle
- Implémenter un système de filtres par rôle avec transitions
- Ajouter des profils enrichis avec réseaux sociaux et publications

---

### 9. Page Santé Publique (`/ordre/sante-publique`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Hero section avec gradient vert
- ✅ Statistiques affichées
- ✅ Design cohérent avec les autres pages

**Points à Améliorer :**

#### 9.1 Hero Section

**Problèmes :**
- Les statistiques (100%, 24/7, ∞) ne sont pas assez explicites
- Manque de contenu visuel (icônes, illustrations)
- Les highlights pourraient être plus visuels

**Recommandations Design :**
```css
/* Améliorer les statistiques */
.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, white, rgba(255, 255, 255, 0.8));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
  display: block;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Améliorer les highlights */
.highlight-item {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.highlight-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

**Score Design Santé Publique : 7/10**

---

### 10. Page Défense Professionnelle (`/ordre/defense-professionnelle`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design similaire à Santé Publique (cohérence)
- ✅ Hero section impactante

**Points à Améliorer :**

**Recommandations :**
- Même structure que Santé Publique, appliquer les mêmes améliorations
- Ajouter des illustrations spécifiques à la défense professionnelle
- Améliorer la hiérarchie visuelle du contenu

**Score Design Défense Professionnelle : 7/10**

---

### 11. Page Formation Continue (`/pratique/formation-continue`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Liste de formations organisée
- ✅ Filtres par catégorie

**Points à Améliorer :**

#### 11.1 Cartes de Formation

**Problèmes :**
- Les cartes de formation manquent de hiérarchie visuelle
- Les prix ne sont pas assez mis en valeur
- Pas d'indication visuelle pour les formations "featured"
- Manque de détails visuels (durée, date, lieu)

**Recommandations Design :**
```css
/* Améliorer les cartes de formation */
.formation-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.formation-card.featured {
  border-color: var(--onpg-primary);
  box-shadow: 
    0 8px 32px rgba(0, 166, 81, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

.formation-card.featured::before {
  content: '⭐ Formation recommandée';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(0, 166, 81, 0.3);
}

.formation-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--onpg-primary), var(--onpg-primary-dark));
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.formation-card:hover::after {
  transform: scaleY(1);
}

.formation-card:hover {
  transform: translateY(-8px);
  border-color: var(--onpg-primary-soft);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Mettre en valeur le prix */
.formation-price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--onpg-primary);
  margin: 1rem 0;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.formation-price-currency {
  font-size: 1.25rem;
  font-weight: 600;
}

.formation-price-free {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 700;
  display: inline-block;
}

/* Améliorer les métadonnées */
.formation-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--onpg-primary-soft);
}

.formation-meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--onpg-gray-600);
  font-size: 0.875rem;
}

.formation-meta-item-icon {
  font-size: 1.25rem;
}

.formation-meta-item-label {
  font-weight: 600;
  color: var(--onpg-primary);
  margin-right: 0.25rem;
}
```

**Score Design Formation Continue : 7/10**

---

### 12. Page Déontologie (`/pratique/deontologie`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design simple et clair
- ✅ Téléchargement PDF bien mis en valeur

**Points à Améliorer :**

#### 12.1 Présentation du Document

**Problèmes :**
- La carte de déontologie manque de profondeur visuelle
- Le bouton de téléchargement pourrait être plus attractif
- Pas de prévisualisation du document
- Manque d'informations visuelles (date de mise à jour, version)

**Recommandations Design :**
```css
/* Améliorer la carte de déontologie */
.deontologie-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
}

.deontologie-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, var(--onpg-primary), var(--onpg-primary-light), var(--onpg-primary));
}

.deontologie-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, var(--onpg-primary-soft), var(--onpg-primary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
}

.deontologie-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--onpg-primary);
  margin-bottom: 1rem;
}

.deontologie-description {
  font-size: 1.125rem;
  color: var(--onpg-gray-600);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Améliorer le bouton de téléchargement */
.deontologie-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.deontologie-download-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.deontologie-download-btn:hover::before {
  left: 100%;
}

.deontologie-download-btn:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.deontologie-download-btn-icon {
  font-size: 1.5rem;
}

/* Informations de version */
.deontologie-meta {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--onpg-primary-soft);
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.deontologie-meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--onpg-gray-600);
  font-size: 0.875rem;
}

.deontologie-meta-item-label {
  font-weight: 600;
  color: var(--onpg-primary);
}
```

**Score Design Déontologie : 6.5/10**

---

### 13. Page Contact Pratique (`/pratique/contact`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Informations de contact claires
- ✅ Formulaire bien structuré

**Points à Améliorer :**

#### 13.1 Cartes de Contact

**Problèmes :**
- Les cartes de contact manquent de profondeur
- Les icônes pourraient être plus grandes
- Pas assez d'espacement entre les éléments
- Le formulaire manque de style moderne

**Recommandations Design :**
```css
/* Améliorer les cartes de contact */
.contact-info-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.contact-info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--onpg-primary), var(--onpg-primary-light));
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.contact-info-card:hover::before {
  transform: scaleX(1);
}

.contact-info-card:hover {
  transform: translateY(-8px);
  border-color: var(--onpg-primary-soft);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Améliorer les icônes */
.contact-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, var(--onpg-primary-soft), var(--onpg-primary));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.contact-info-card:hover .contact-icon {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.4);
}

/* Améliorer le formulaire */
.contact-form {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.contact-form-group {
  margin-bottom: 1.5rem;
}

.contact-form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--onpg-gray-700);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-form-input,
.contact-form-textarea,
.contact-form-select {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--onpg-primary-muted);
  font-family: inherit;
}

.contact-form-input:focus,
.contact-form-textarea:focus,
.contact-form-select:focus {
  outline: none;
  border-color: var(--onpg-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}

.contact-form-submit {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 1.25rem 3rem;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  width: 100%;
}

.contact-form-submit:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.contact-form-submit:active {
  transform: translateY(0);
}
```

**Score Design Contact Pratique : 7/10**

---

### 14. Page Communiqués (`/ressources/communiques`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Filtres par type fonctionnels
- ✅ Badges de type colorés
- ✅ Design cohérent

**Points à Améliorer :**

#### 14.1 Cartes de Communiqués

**Problèmes :**
- Les badges de type pourraient être plus visibles
- Les communiqués "urgents" ne sont pas assez mis en valeur
- Manque de hiérarchie visuelle
- Les dates ne sont pas assez mises en valeur

**Recommandations Design :**
```css
/* Améliorer les cartes de communiqués */
.communique-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
}

.communique-card.urgent {
  border-left-color: #E74C3C;
  background: linear-gradient(135deg, #fff5f5 0%, #ffffff 100%);
  box-shadow: 
    0 8px 32px rgba(231, 76, 60, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

.communique-card.urgent::before {
  content: '🚨 URGENT';
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #E74C3C, #C0392B);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.communique-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Améliorer les badges de type */
.communique-type-badge {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.communique-type-badge.urgent {
  background: linear-gradient(135deg, #E74C3C, #C0392B);
  color: white;
}

.communique-type-badge.information {
  background: linear-gradient(135deg, #3498DB, #2980B9);
  color: white;
}

.communique-type-badge.presse {
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
}

.communique-type-badge.administratif {
  background: linear-gradient(135deg, #F39C12, #E67E22);
  color: white;
}

/* Améliorer les dates */
.communique-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--onpg-gray-600);
  font-size: 0.875rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--onpg-primary-soft);
}

.communique-date-icon {
  font-size: 1.25rem;
  color: var(--onpg-primary);
}
```

**Score Design Communiqués : 7.5/10**

---

### 15. Page Photos (`/ressources/photos`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Galerie moderne avec masonry layout
- ✅ Lightbox pour les images
- ✅ Filtres par album et catégorie

**Points à Améliorer :**

#### 15.1 Galerie Photos

**Problèmes :**
- Les images manquent de lazy loading systématique
- Pas de skeleton loading pendant le chargement
- Le lightbox pourrait être amélioré
- Les albums ne sont pas assez mis en valeur

**Recommandations Design :**
```css
/* Améliorer la galerie */
.photos-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 2rem 0;
}

.photos-gallery-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 4/3;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.photos-gallery-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.photos-gallery-item:hover::before {
  opacity: 1;
}

.photos-gallery-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.15);
}

.photos-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.photos-gallery-item:hover img {
  transform: scale(1.1);
}

/* Overlay avec informations */
.photos-gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  z-index: 2;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.photos-gallery-item:hover .photos-gallery-overlay {
  transform: translateY(0);
}

.photos-gallery-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.photos-gallery-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Améliorer le lightbox */
.photos-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.photos-lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.photos-lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.photos-lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}
```

**Score Design Photos : 8/10**

---

### 16. Page Vidéos (`/ressources/videos`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Intégration YouTube
- ✅ Filtres par catégorie
- ✅ Playlists organisées

**Points à Améliorer :**

#### 16.1 Cartes de Vidéos

**Problèmes :**
- Les thumbnails YouTube ne sont pas optimisées
- Pas de durée de vidéo visible avant le hover
- Les statistiques (vues, likes) ne sont pas assez mises en valeur
- Manque de preview au hover

**Recommandations Design :**
```css
/* Améliorer les cartes de vidéos */
.video-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.video-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: var(--onpg-gray-200);
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-card:hover .video-thumbnail img {
  transform: scale(1.1);
}

/* Overlay play button */
.video-play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .video-play-overlay {
  opacity: 1;
}

.video-play-button {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--onpg-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.video-card:hover .video-play-button {
  transform: scale(1.1);
  background: white;
}

/* Durée de la vidéo */
.video-duration {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 2;
}

/* Statistiques */
.video-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--onpg-primary-soft);
  font-size: 0.875rem;
  color: var(--onpg-gray-600);
}

.video-stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.video-stat-icon {
  font-size: 1.125rem;
  color: var(--onpg-primary);
}
```

**Score Design Vidéos : 7.5/10**

---

### 17. Page Thèses (`/ressources/theses`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Liste organisée par université
- ✅ Filtres par catégorie et année
- ✅ Informations détaillées

**Points à Améliorer :**

#### 17.1 Cartes de Thèses

**Problèmes :**
- Les cartes de thèses sont trop chargées visuellement
- Les métadonnées ne sont pas assez hiérarchisées
- Pas d'indication visuelle pour les thèses "featured"
- Les statistiques (téléchargements, citations) ne sont pas assez mises en valeur

**Recommandations Design :**
```css
/* Améliorer les cartes de thèses */
.thesis-card {
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid var(--onpg-primary);
  position: relative;
}

.thesis-card.featured {
  border-left-width: 6px;
  border-left-color: var(--onpg-primary);
  box-shadow: 
    0 8px 32px rgba(0, 166, 81, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
}

.thesis-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 20px 60px rgba(0, 166, 81, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.1);
}

.thesis-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--onpg-gray-800);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.thesis-authors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.thesis-author {
  background: var(--onpg-primary-soft);
  color: var(--onpg-primary-dark);
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.thesis-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: var(--onpg-primary-muted);
  border-radius: 12px;
}

.thesis-meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.thesis-meta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--onpg-gray-600);
  font-weight: 600;
}

.thesis-meta-value {
  font-size: 1rem;
  color: var(--onpg-gray-800);
  font-weight: 500;
}

/* Statistiques */
.thesis-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--onpg-primary-soft);
}

.thesis-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.thesis-stat-icon {
  font-size: 1.25rem;
  color: var(--onpg-primary);
}

.thesis-stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--onpg-primary);
}

.thesis-stat-label {
  font-size: 0.875rem;
  color: var(--onpg-gray-600);
}
```

**Score Design Thèses : 7/10**

---

### 18. Page Articles (`/ressources/articles`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Liste organisée par journal
- ✅ Filtres multiples
- ✅ Informations académiques complètes

**Points à Améliorer :**

**Recommandations :**
- Même structure que Thèses, appliquer des améliorations similaires
- Ajouter des badges pour les types de publications
- Mettre en valeur les articles avec DOI
- Améliorer l'affichage des auteurs multiples

**Score Design Articles : 7/10**

---

### 19. Page Décrets (`/ressources/decrets`)

#### Analyse Visuelle

**Points à Améliorer :**

**Recommandations :**
- Créer un design similaire aux autres ressources
- Ajouter des badges pour les types de décrets
- Mettre en valeur les dates de publication
- Améliorer la lisibilité des références

**Score Design Décrets : 6.5/10**

---

### 20. Page Décisions (`/ressources/decisions`)

#### Analyse Visuelle

**Recommandations :**
- Même structure que Décrets
- Ajouter une hiérarchie visuelle pour les décisions importantes
- Améliorer l'affichage des dates et références

**Score Design Décisions : 6.5/10**

---

### 21. Page Commissions (`/ressources/commissions`)

#### Analyse Visuelle

**Recommandations :**
- Créer un design cohérent avec les autres ressources
- Ajouter des cartes pour chaque commission
- Mettre en valeur les membres de chaque commission
- Améliorer la navigation entre les commissions

**Score Design Commissions : 6.5/10**

---

### 22. Page Lois (`/ressources/lois`)

#### Analyse Visuelle

**Recommandations :**
- Design similaire aux autres ressources juridiques
- Ajouter des filtres par domaine
- Mettre en valeur les dates de promulgation
- Améliorer la lisibilité des textes de loi

**Score Design Lois : 6.5/10**

---

### 23. Page Contact (`/contact`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Formulaire bien structuré
- ✅ Auto-save fonctionnel

**Points à Améliorer :**

#### 23.1 Formulaire de Contact

**Problèmes :**
- Le formulaire manque de style moderne
- Pas assez d'espacement entre les champs
- Les labels ne sont pas assez visibles
- Manque de feedback visuel sur la validation

**Recommandations Design :**
```css
/* Améliorer le formulaire de contact */
.contact-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.contact-form {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.contact-form-group {
  margin-bottom: 2rem;
}

.contact-form-label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: var(--onpg-gray-700);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-form-label.required::after {
  content: ' *';
  color: #E74C3C;
}

.contact-form-input,
.contact-form-textarea,
.contact-form-select {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--onpg-primary-muted);
  font-family: inherit;
}

.contact-form-input:focus,
.contact-form-textarea:focus,
.contact-form-select:focus {
  outline: none;
  border-color: var(--onpg-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}

.contact-form-input:valid,
.contact-form-textarea:valid {
  border-color: var(--onpg-primary);
}

.contact-form-input:invalid:not(:placeholder-shown),
.contact-form-textarea:invalid:not(:placeholder-shown) {
  border-color: #E74C3C;
}

.contact-form-textarea {
  min-height: 150px;
  resize: vertical;
}

.contact-form-submit {
  width: 100%;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  padding: 1.25rem 3rem;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 8px 24px rgba(0, 166, 81, 0.3),
    0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.contact-form-submit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.contact-form-submit:hover::before {
  left: 100%;
}

.contact-form-submit:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 12px 32px rgba(0, 166, 81, 0.4),
    0 6px 16px rgba(0, 0, 0, 0.15);
}

.contact-form-submit:active {
  transform: translateY(0);
}

.contact-form-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}
```

**Score Design Contact : 7/10**

---

### 24. Page FAQ (`/faq`)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Questions organisées par catégorie
- ✅ Accordéon fonctionnel

**Points à Améliorer :**

#### 24.1 Accordéon FAQ

**Problèmes :**
- Les questions ne sont pas assez mises en valeur
- Les réponses manquent de hiérarchie visuelle
- Pas d'indicateur visuel pour les questions ouvertes
- La recherche pourrait être plus visible

**Recommandations Design :**
```css
/* Améliorer l'accordéon FAQ */
.faq-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 2px solid var(--onpg-primary-soft);
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item.open {
  border-color: var(--onpg-primary);
  box-shadow: 0 4px 20px rgba(0, 166, 81, 0.15);
}

.faq-question {
  padding: 1.5rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  background: var(--onpg-primary-muted);
}

.faq-item.open .faq-question {
  background: linear-gradient(135deg, var(--onpg-primary-soft), var(--onpg-primary-muted));
}

.faq-question:hover {
  background: var(--onpg-primary-soft);
}

.faq-question-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--onpg-gray-800);
  flex: 1;
}

.faq-question-icon {
  font-size: 1.5rem;
  color: var(--onpg-primary);
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.faq-item.open .faq-question-icon {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
  padding: 0 1.5rem;
}

.faq-item.open .faq-answer {
  max-height: 1000px;
  padding: 1.5rem;
}

.faq-answer-content {
  color: var(--onpg-gray-700);
  line-height: 1.8;
  font-size: 1rem;
}

/* Améliorer la recherche */
.faq-search {
  position: sticky;
  top: 0;
  background: white;
  padding: 1.5rem 0;
  border-bottom: 2px solid var(--onpg-primary-soft);
  z-index: 10;
  margin-bottom: 2rem;
}

.faq-search-input {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 2px solid var(--onpg-primary-soft);
  border-radius: 12px;
  font-size: 1.125rem;
  transition: all 0.3s ease;
  background: var(--onpg-primary-muted);
}

.faq-search-input:focus {
  outline: none;
  border-color: var(--onpg-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 166, 81, 0.1);
}
```

**Score Design FAQ : 7/10**

---

### 25. Pages Légales (Mentions Légales, CGU, Politique de Confidentialité)

#### Analyse Visuelle

**Points Positifs :**
- ✅ Contenu bien structuré
- ✅ Sections clairement définies

**Points à Améliorer :**

#### 25.1 Design des Pages Légales

**Problèmes :**
- Design trop basique
- Manque de hiérarchie visuelle
- Les sections ne sont pas assez distinctes
- Pas de navigation entre les sections

**Recommandations Design :**
```css
/* Améliorer les pages légales */
.legal-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.legal-hero {
  text-align: center;
  padding: 4rem 0;
  background: linear-gradient(135deg, var(--onpg-primary), var(--onpg-primary-dark));
  color: white;
  border-radius: 20px;
  margin-bottom: 3rem;
}

.legal-hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.legal-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.legal-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--onpg-primary-soft);
}

.legal-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.legal-section h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--onpg-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid var(--onpg-primary-soft);
}

.legal-section h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--onpg-gray-800);
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.legal-section p {
  line-height: 1.8;
  color: var(--onpg-gray-700);
  margin-bottom: 1rem;
}

.legal-section a {
  color: var(--onpg-primary);
  text-decoration: underline;
  transition: color 0.3s ease;
}

.legal-section a:hover {
  color: var(--onpg-primary-dark);
}
```

**Score Design Pages Légales : 6/10**

---

## Résumé des Scores par Page

### Scores par Catégorie

#### Pages Principales (Score Moyen: 7.3/10)
- **Page d'Accueil** : 7.5/10
- **Tableau de l'Ordre** : 7/10
- **Sections Membres** : 7.5/10
- **Pharmacies** : 7/10
- **À Propos** : 7.5/10

#### Pages Ordre (Score Moyen: 6.8/10)
- **Organigramme** : 6/10
- **Conseil National** : 6.5/10
- **Santé Publique** : 7/10
- **Défense Professionnelle** : 7/10

#### Pages Pratique (Score Moyen: 6.8/10)
- **Formation Continue** : 7/10
- **Déontologie** : 6.5/10
- **Contact Pratique** : 7/10

#### Pages Ressources (Score Moyen: 7.1/10)
- **Actualités** : 7.5/10
- **Communiqués** : 7.5/10
- **Photos** : 8/10 ⭐ (Meilleur score)
- **Vidéos** : 7.5/10
- **Thèses** : 7/10
- **Articles** : 7/10
- **Décrets** : 6.5/10
- **Décisions** : 6.5/10
- **Commissions** : 6.5/10
- **Lois** : 6.5/10

#### Pages Utilitaires (Score Moyen: 6.7/10)
- **Contact** : 7/10
- **FAQ** : 7/10
- **Pages Légales** : 6/10

#### Composants Globaux (Score Moyen: 7.8/10)
- **Navbar** : 8/10
- **Footer** : 7.5/10

### Score Global Moyen : **7.1/10**

### Pages Nécessitant une Attention Prioritaire (< 7/10)
1. **Organigramme** (6/10) - Design trop basique, styles inline
2. **Pages Légales** (6/10) - Design minimaliste, manque de hiérarchie
3. **Conseil National** (6.5/10) - Photos mock, manque de profondeur
4. **Déontologie** (6.5/10) - Carte trop simple
5. **Décrets, Décisions, Commissions, Lois** (6.5/10) - Design générique

### Pages Excellentes (≥ 8/10)
1. **Photos** (8/10) - Galerie moderne, lightbox, masonry layout
2. **Navbar** (8/10) - Design moderne, glassmorphism

---

## Composants Globaux

### 1. Navbar

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design moderne avec glassmorphism
- ✅ Logo bien mis en valeur
- ✅ Navigation claire

**Points à Améliorer :**

**Problèmes :**
- L'animation du logo pourrait être plus subtile
- Le menu mobile pourrait être amélioré
- Les états hover ne sont pas assez distinctifs

**Recommandations Design :**
```css
/* Améliorer l'animation du logo */
.onpg-logo-wrapper {
  animation: logoPulse 3s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 
      0 8px 25px rgba(0, 166, 81, 0.4),
      0 4px 12px rgba(52, 152, 219, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 
      0 12px 32px rgba(0, 166, 81, 0.5),
      0 6px 16px rgba(52, 152, 219, 0.4);
  }
}

/* Améliorer le menu mobile */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 9999;
  padding: 2rem;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu.open {
  transform: translateX(0);
}

.mobile-menu-item {
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1.25rem;
  color: white;
  transition: all 0.3s ease;
}

.mobile-menu-item:hover {
  color: var(--onpg-primary);
  padding-left: 1rem;
}
```

**Score Design Navbar : 8/10**

### 2. Footer

#### Analyse Visuelle

**Points Positifs :**
- ✅ Design moderne avec gradient
- ✅ Informations bien organisées
- ✅ Liens sociaux intégrés

**Points à Améliorer :**

**Problèmes :**
- Le gradient vert foncé pourrait être plus harmonieux
- Les liens pourraient être plus interactifs
- Manque de hiérarchie visuelle

**Recommandations Design :**
```css
/* Améliorer le footer */
.onpg-footer {
  background: linear-gradient(
    135deg,
    var(--onpg-gray-900) 0%,
    var(--onpg-gray-800) 50%,
    var(--onpg-gray-900) 100%
  );
  border-top: 4px solid var(--onpg-primary);
  position: relative;
}

.onpg-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--onpg-primary),
    transparent
  );
}

/* Améliorer les liens */
.onpg-footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.onpg-footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--onpg-primary);
  transition: width 0.3s ease;
}

.onpg-footer-link:hover {
  color: white;
  padding-left: 0.5rem;
}

.onpg-footer-link:hover::after {
  width: 100%;
}
```

**Score Design Footer : 7.5/10**

---

## Responsive Design

### Problèmes Identifiés

**Breakpoints Non Standardisés**
- Utilisation de breakpoints différents selon les pages
- Pas de système de breakpoints centralisé
- Certaines pages ne sont pas optimisées pour tablette

**Recommandations :**
```css
/* Créer un système de breakpoints */
:root {
  --breakpoint-xs: 0px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Utiliser des media queries cohérentes */
@media (max-width: 640px) {
  /* Styles mobile */
}

@media (min-width: 641px) and (max-width: 1024px) {
  /* Styles tablette */
}

@media (min-width: 1025px) {
  /* Styles desktop */
}
```

**Problèmes Spécifiques par Page :**
- Page d'accueil : Le carousel n'est pas optimisé pour mobile
- Tableau de l'Ordre : Le tableau devient illisible sur mobile
- Pharmacies : Les filtres prennent trop de place sur mobile

**Recommandations :**
```css
/* Tableau responsive */
@media (max-width: 768px) {
  .membres-table {
    display: block;
    overflow-x: auto;
  }
  
  .membres-table thead {
    display: none;
  }
  
  .membres-table tbody tr {
    display: block;
    margin-bottom: 1rem;
    border: 2px solid var(--onpg-primary-soft);
    border-radius: 12px;
    padding: 1rem;
  }
  
  .membres-table td {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--onpg-primary-soft);
  }
  
  .membres-table td::before {
    content: attr(data-label);
    font-weight: 600;
    color: var(--onpg-primary);
    margin-right: 1rem;
  }
}
```

---

## Animations et Transitions

### Problèmes Identifiés

**Animations Incohérentes**
- Durées d'animation différentes selon les composants
- Pas de système d'easing cohérent
- Certaines animations sont trop agressives

**Recommandations :**
```css
/* Créer un système d'animations */
:root {
  --transition-fast: 0.15s;
  --transition-normal: 0.3s;
  --transition-slow: 0.6s;
  
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --easing-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --easing-sharp: cubic-bezier(0.4, 0, 0.6, 1);
}

/* Utilisation */
.card {
  transition: transform var(--transition-normal) var(--easing-standard),
              box-shadow var(--transition-normal) var(--easing-standard);
}
```

**Respect des Préférences Utilisateur**
- Les animations ne respectent pas toujours `prefers-reduced-motion`

**Recommandations :**
```css
/* Respecter prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Typographie

### Problèmes Identifiés

**Hiérarchie Non Respectée**
- Tailles de police incohérentes
- Line-height variables
- Letter-spacing non standardisé

**Recommandations :**
Voir section "Charte Graphique et Design System" pour le système typographique complet.

**Lisibilité**
- Certains textes sont trop petits sur mobile
- Contraste insuffisant sur certains éléments

**Recommandations :**
```css
/* Améliorer la lisibilité */
@media (max-width: 640px) {
  body {
    font-size: 16px; /* Minimum pour la lisibilité */
    line-height: 1.6;
  }
  
  h1 {
    font-size: 2rem; /* Au lieu de 3rem */
  }
  
  h2 {
    font-size: 1.75rem; /* Au lieu de 2.25rem */
  }
}

/* Améliorer le contraste */
.text-muted {
  color: var(--onpg-gray-600); /* Au lieu de gray-500 */
}
```

---

## Couleurs et Contraste

### Problèmes Identifiés

**Contraste Insuffisant**
- Certains textes sur fond coloré ne respectent pas WCAG AA
- Les liens ne sont pas assez contrastés

**Recommandations :**
```css
/* Vérifier et améliorer les contrastes */
.hero-title {
  /* Blanc sur vert : ratio 4.5:1 minimum */
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Améliore le contraste */
}

.link {
  color: var(--onpg-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.link:hover {
  color: var(--onpg-primary-dark);
}
```

**Cohérence des Couleurs**
- Utilisation de couleurs différentes pour le même concept
- Pas de système de couleurs sémantiques

**Recommandations :**
Voir section "Charte Graphique et Design System" pour le système de couleurs complet.

---

## Espacements et Grilles

### Problèmes Identifiés

**Espacements Incohérents**
- Utilisation de valeurs arbitraires
- Pas de système d'espacement

**Recommandations :**
Voir section "Charte Graphique et Design System" pour le système d'espacement.

**Grilles Non Standardisées**
- Utilisation de grilles différentes selon les pages
- Pas de système de grille centralisé

**Recommandations :**
```css
/* Créer un système de grille */
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid {
  display: grid;
  gap: var(--space-6);
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.grid-3 {
  grid-template-columns: repeat(3, 1fr);
}

.grid-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 1024px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid-4,
  .grid-3,
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
```

---

## Recommandations Prioritaires Design

### 🔴 Priorité Critique

1. **Créer un Design System Centralisé**
   - Système de couleurs unifié
   - Système typographique cohérent
   - Système d'espacement basé sur 8px
   - Système de composants réutilisables

2. **Améliorer le Responsive Design**
   - Standardiser les breakpoints
   - Optimiser toutes les pages pour mobile
   - Créer des variantes mobile pour les tableaux

3. **Améliorer les Contrastes**
   - Vérifier tous les contrastes WCAG AA
   - Améliorer les textes sur fond coloré
   - Ajouter des ombres pour améliorer la lisibilité

### 🟡 Priorité Haute

1. **Unifier les Animations**
   - Créer un système d'animations cohérent
   - Respecter prefers-reduced-motion
   - Optimiser les performances des animations

2. **Améliorer les Micro-interactions**
   - Ajouter des feedbacks visuels sur tous les éléments interactifs
   - Améliorer les états hover
   - Ajouter des transitions fluides

3. **Optimiser les Composants Globaux**
   - Améliorer la navbar mobile
   - Améliorer le footer
   - Créer des composants réutilisables

### 🟢 Priorité Moyenne

1. **Améliorer la Hiérarchie Visuelle**
   - Mieux mettre en valeur les éléments importants
   - Améliorer la typographie
   - Créer une hiérarchie claire

2. **Ajouter des Éléments Visuels**
   - Illustrations pour certaines sections
   - Icônes cohérentes
   - Patterns de fond subtils

3. **Optimiser les Images**
   - Améliorer les placeholders
   - Ajouter des effets de chargement
   - Optimiser les tailles d'images

---

## Plan d'Action Design

### Semaine 1 : Design System
- [ ] Créer le système de couleurs centralisé
- [ ] Créer le système typographique
- [ ] Créer le système d'espacement
- [ ] Documenter le design system

### Semaine 2 : Composants Globaux
- [ ] Améliorer la navbar
- [ ] Améliorer le footer
- [ ] Créer des composants réutilisables
- [ ] Unifier les animations

### Semaine 3 : Pages Individuelles
- [ ] Optimiser la page d'accueil
- [ ] Optimiser le tableau de l'Ordre
- [ ] Optimiser les pages sections
- [ ] Optimiser la page pharmacies

### Semaine 4 : Responsive et Finalisation
- [ ] Optimiser toutes les pages pour mobile
- [ ] Vérifier les contrastes
- [ ] Tester sur différents appareils
- [ ] Documenter les changements

---

## Métriques de Succès Design

### Performance Visuelle
- **Lighthouse Performance** : 90+ (optimisation des images et animations)
- **First Contentful Paint** : < 1.5s
- **Cumulative Layout Shift** : < 0.1

### Accessibilité Visuelle
- **Contraste WCAG AA** : 100% des éléments
- **Contraste WCAG AAA** : 80% des éléments importants
- **Navigation au clavier** : 100% fonctionnelle

### Cohérence
- **Design System** : 100% des composants utilisent le système
- **Couleurs** : 0 couleur arbitraire
- **Espacements** : 100% utilisation du système

---

## Conclusion

Ce document d'audit design identifie les principales opportunités d'amélioration visuelle du site ONPG. Les recommandations sont classées par priorité et incluent des exemples de code CSS concrets pour faciliter l'implémentation.

**Points Clés à Retenir :**
1. Créer un design system centralisé est la priorité absolue
2. Le responsive design nécessite une attention particulière
3. Les contrastes doivent être améliorés pour l'accessibilité
4. Les animations doivent être unifiées et optimisées

**Prochaines Étapes :**
1. Valider les priorités avec l'équipe design
2. Créer le design system
3. Implémenter les améliorations page par page
4. Tester sur différents appareils et navigateurs

---

**Document créé le :** Janvier 2025  
**Version :** 1.0  
**Focus :** Design et UX uniquement

