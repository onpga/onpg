import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import './AProposOrdrePremium.css';

const IcoShield = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-3.6 7-9.2V5.2L12 2.5 5 5.2v6.6C5 17.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m9.5 11.8 1.7 1.7 3.3-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoScales = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3v18M5 21h14M12 6 4 8m8-2 8 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="m4 8 2.7 5.2a2.4 2.4 0 0 1-2.2 1.6 2.4 2.4 0 0 1-2.2-1.6L4 8Zm16 0 2.7 5.2a2.4 2.4 0 0 1-2.2 1.6 2.4 2.4 0 0 1-2.2-1.6L20 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const IcoBook = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5.5 4h11.8A1.7 1.7 0 0 1 19 5.7V20H6.2A2.2 2.2 0 0 1 4 17.8V5.5A1.5 1.5 0 0 1 5.5 4Z" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 8.5h7M8 12h5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IcoLightbulb = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9.2 18h5.6M10 21h4M12 3.2a6.2 6.2 0 0 1 3.8 11v2.4a1 1 0 0 1-1 1h-5.6a1 1 0 0 1-1-1v-2.4a6.2 6.2 0 0 1 3.8-11Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoStar = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m12 3.3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9L6.6 20l1-6-4.4-4.3 6.1-.9L12 3.3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const IcoShieldSmall = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 21s7-3.6 7-9.2V5.2L12 2.5 5 5.2v6.6C5 17.4 12 21 12 21Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoHandshake = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m8.5 12.5 1.8 1.8a2.4 2.4 0 0 0 3.4 0l4.8-4.8a2.2 2.2 0 0 0-3.1-3.1L13 8.8a2 2 0 0 1-2.8 0l-.4-.4a2.2 2.2 0 0 0-3.1 3.1l1.8 1.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="m2.8 11.4 2.3 2.3M18.9 4.9l2.3 2.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IcoBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M9 21v-6h6v6M8 8h1m6 0h1M8 12h1m6 0h1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IcoTarget = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="12" r="1.8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IcoFlag = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 20V4m0 0c2-1.2 4.3-1.2 6.3 0 2 1.2 4.3 1.2 6.4 0 2-1.2 4.2-1.2 6.3 0v8.2c-2 1.2-4.2 1.2-6.3 0-2-1.2-4.3-1.2-6.4 0-2 1.2-4.3 1.2-6.3 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcoChart = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 20h14M7 20v-6m5 6V8m5 12v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IcoUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="9" cy="8" r="3.3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.5 18.2c0-2.8 2.3-5.1 5.1-5.1h.8c2.8 0 5.1 2.3 5.1 5.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15.6 13.3c2.3 0 4.1 1.8 4.1 4.1M15.8 5.4a2.8 2.8 0 0 1 0 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

type Mission = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Valeur = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const missions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Protection de la Santé Publique',
    description: 'Garantir la qualité, la sécurité et la disponibilité des médicaments et produits de santé.',
    icon: <IcoShield />
  },
  {
    id: 'mission-2',
    title: 'Défense de la Profession',
    description: 'Représenter les pharmaciens gabonais et défendre leurs intérêts légitimes.',
    icon: <IcoScales />
  },
  {
    id: 'mission-3',
    title: 'Formation Continue',
    description: 'Accompagner l’évolution des compétences et des pratiques professionnelles.',
    icon: <IcoBook />
  },
  {
    id: 'mission-4',
    title: 'Innovation et Modernisation',
    description: 'Promouvoir une pharmacie moderne, numérique et orientée qualité de service.',
    icon: <IcoLightbulb />
  }
];

const valeurs: Valeur[] = [
  {
    id: 'valeur-1',
    title: 'Excellence',
    description: 'Exigence de qualité dans les pratiques, les services et la gouvernance.',
    icon: <IcoStar />
  },
  {
    id: 'valeur-2',
    title: 'Éthique',
    description: 'Respect strict du code de déontologie et des principes professionnels.',
    icon: <IcoShieldSmall />
  },
  {
    id: 'valeur-3',
    title: 'Solidarité',
    description: 'Cohésion entre les sections, soutien entre confrères et esprit d’intérêt général.',
    icon: <IcoHandshake />
  },
  {
    id: 'valeur-4',
    title: 'Responsabilité',
    description: 'Engagement permanent vis-à-vis des patients, des autorités et de la société.',
    icon: <IcoBuilding />
  }
];

const sections = [
  { id: 'mission', label: 'Notre mission' },
  { id: 'valeurs', label: 'Nos valeurs' },
  { id: 'organisation', label: 'Organisation' }
] as const;

const APropos = () => {
  const [activeSection, setActiveSection] = useState<string>('mission');
  const [nombrePharmaciens, setNombrePharmaciens] = useState<number | null>(null);

  useEffect(() => {
    const loadNombrePharmaciens = async () => {
      try {
        const data = await fetchResourceData('pharmaciens');
        if (data) {
          const raw = Array.isArray(data) ? data : [data];
          const actifs = raw.filter((p: any) => p?.isActive !== false);
          setNombrePharmaciens(actifs.length);
        }
      } catch {
        setNombrePharmaciens(null);
      }
    };

    loadNombrePharmaciens();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: '-80px 0px -45% 0px'
      }
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="ordre-page apropos-premium-page">
      <section className="apropos-hero" aria-labelledby="apropos-title">
        <div className="apropos-container">
          <div className="apropos-hero-content">
            <span className="apropos-eyebrow">Ordre National des Pharmaciens du Gabon</span>
            <h1 id="apropos-title" className="apropos-title">
              À propos de l&apos;ONPG
            </h1>
            <p className="apropos-lead">
              Institution officielle de régulation, de représentation et de protection de la profession pharmaceutique
              au Gabon, au service de la santé publique.
            </p>

            <div className="apropos-highlight-list" role="list">
              <span className="apropos-highlight-item" role="listitem"><IcoBuilding /> Institution officielle</span>
              <span className="apropos-highlight-item" role="listitem"><IcoTarget /> Exigence de qualité</span>
              <span className="apropos-highlight-item" role="listitem"><IcoFlag /> Mission de service public</span>
            </div>

            <div className="apropos-kpi-grid" aria-label="Indicateurs">
              <article className="apropos-kpi-card">
                <strong>{nombrePharmaciens ?? '—'}</strong>
                <span>Pharmaciens inscrits</span>
              </article>
              <article className="apropos-kpi-card">
                <strong>4</strong>
                <span>Sections professionnelles</span>
              </article>
              <article className="apropos-kpi-card">
                <strong>100%</strong>
                <span>Engagement santé publique</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <nav className="apropos-anchor-nav" aria-label="Navigation de page">
        <div className="apropos-container">
          <div className="apropos-anchor-nav-inner">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`apropos-anchor-link ${activeSection === section.id ? 'is-active' : ''}`}
              >
                {section.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="mission" className="apropos-section">
        <div className="apropos-container">
          <header className="apropos-section-header">
            <h2>Notre mission</h2>
            <p>Structurer, accompagner et protéger la pratique pharmaceutique dans l’intérêt de la population.</p>
          </header>
          <div className="apropos-card-grid">
            {missions.map((mission, index) => (
              <article key={mission.id} className="apropos-card mission-card">
                <span className="apropos-card-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="apropos-card-icon">{mission.icon}</div>
                <h3>{mission.title}</h3>
                <p>{mission.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="valeurs" className="apropos-section apropos-section-alt">
        <div className="apropos-container">
          <header className="apropos-section-header">
            <h2>Nos valeurs</h2>
            <p>Des principes clairs, stables et partagés qui orientent nos décisions et nos actions.</p>
          </header>
          <div className="apropos-card-grid">
            {valeurs.map((valeur) => (
              <article key={valeur.id} className="apropos-card valeur-card">
                <div className="apropos-card-icon">{valeur.icon}</div>
                <h3>{valeur.title}</h3>
                <p>{valeur.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="organisation" className="apropos-section">
        <div className="apropos-container">
          <header className="apropos-section-header">
            <h2>Organisation</h2>
            <p>Une gouvernance structurée, représentative et transparente.</p>
          </header>

          <div className="apropos-organisation-layout">
            <article className="apropos-organisation-main">
              <h3>Une structure démocratique et représentative</h3>
              <p>
                L&apos;ONPG s&apos;appuie sur des instances représentatives de l&apos;ensemble des sections de la profession.
                Le Conseil National définit les orientations, veille à leur application et garantit la cohérence institutionnelle.
              </p>

              <div className="apropos-trust-grid">
                <div className="apropos-trust-item">
                  <span>Source</span>
                  <strong>Ordre National des Pharmaciens du Gabon</strong>
                </div>
                <div className="apropos-trust-item">
                  <span>Dernière mise à jour</span>
                  <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
                </div>
              </div>

              <div className="apropos-links">
                <Link to="/ordre/organigramme" className="apropos-link-btn">
                  <IcoChart />
                  <span>Voir l&apos;organigramme complet</span>
                </Link>
                <Link to="/ordre/conseil-national" className="apropos-link-btn">
                  <IcoUsers />
                  <span>Consulter le Conseil National</span>
                </Link>
              </div>
            </article>

            <aside className="apropos-organisation-side" aria-label="Résumé organisationnel">
              <div className="apropos-side-step">
                <h4>Présidence</h4>
                <p>Direction institutionnelle</p>
              </div>
              <div className="apropos-side-step">
                <h4>Conseil National</h4>
                <p>25 membres élus</p>
              </div>
              <div className="apropos-side-step">
                <h4>Sections A, B, C, D</h4>
                <p>Représentation de la profession</p>
              </div>
              <div className="apropos-side-step">
                <h4>Membres inscrits</h4>
                <p>{nombrePharmaciens ?? '—'} pharmaciens</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="apropos-cta">
        <div className="apropos-container">
          <div className="apropos-cta-content">
            <h2>Accédez rapidement aux informations essentielles</h2>
            <p>Parcourez la gouvernance, les sections et les professionnels inscrits à l&apos;Ordre.</p>
            <div className="apropos-cta-actions">
              <Link to="/ordre/organigramme" className="apropos-cta-btn primary">Organigramme</Link>
              <Link to="/membres/tableau-ordre" className="apropos-cta-btn secondary">Tableau de l&apos;Ordre</Link>
              <Link to="/pratique/contact" className="apropos-cta-btn secondary">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APropos;

