import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './OrganigrammePremium.css';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://backendonpg-production.up.railway.app/api'
    : 'http://localhost:3001/api');

interface CouncilMember {
  fullName: string;
  roleLabel: string;
  roleType: string;
  order: number;
}

const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 18.5h18M5 15l3.7-7 3.3 3.7L15.4 6 19 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 18.5h16v2H4z" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconBoard = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.5" y="4" width="17" height="15" rx="2.2" stroke="currentColor" strokeWidth="1.8" />
    <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const IconSection = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3.8" y="4.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.7" y="4.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.8" y="14.4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.7" y="14.4" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="7.6" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="M5 19.3c0-3 2.5-5.4 5.5-5.4h3c3 0 5.5 2.4 5.5 5.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const sections = [
  { code: 'A', name: 'Officinaux', detail: 'Pharmacies d’officine' },
  { code: 'B', name: 'Biologistes', detail: 'Biologie médicale' },
  { code: 'C', name: 'Fabricants / Grossistes', detail: 'Industrie & distribution' },
  { code: 'D', name: 'Fonctionnaires', detail: 'Secteur public' }
];

const getPole = (roleLabel: string): string => {
  const r = roleLabel.toLowerCase();
  if (r.includes('secrétaire') || r.includes('secretaire')) return r.includes('adjoint') ? 'Secrétariat' : 'Secrétariat';
  if (r.includes('trésorier') || r.includes('tresorier')) return 'Trésorerie';
  if (r.includes('vice-président') || r.includes('vice-president')) return 'Bureau';
  if (r.includes('présidente') || r.includes('président')) return 'Présidence';
  return 'Conseillers';
};

const Organigramme = () => {
  const [councilMembers, setCouncilMembers] = useState<CouncilMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_URL}/public/site-settings`);
        const data = await res.json();
        if (data?.success && Array.isArray(data?.data?.councilMembers)) {
          setCouncilMembers(
            data.data.councilMembers
              .filter((m: any) => m?.roleLabel)
              .map((m: any) => ({
                fullName: m.fullName || '',
                roleLabel: m.roleLabel || '',
                roleType: m.roleType || 'bureau',
                order: m.order ?? 0
              }))
              .sort((a: CouncilMember, b: CouncilMember) => a.order - b.order)
          );
        }
      } catch {
        // fallback vide
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const byPole = councilMembers.reduce<Record<string, { role: string; name: string }[]>>((acc, m) => {
    const pole = getPole(m.roleLabel);
    if (!acc[pole]) acc[pole] = [];
    acc[pole].push({ role: m.roleLabel, name: m.fullName || 'Poste à pourvoir' });
    return acc;
  }, {});

  const president = councilMembers.find(
    (m) =>
      m.roleLabel.toLowerCase().includes('présidente') ||
      m.roleLabel.toLowerCase().includes('président')
  );

  const poles = [
    { key: 'Secrétariat', icon: 'Secrétariat' },
    { key: 'Trésorerie', icon: 'Trésorerie' },
    { key: 'Bureau', icon: 'Bureau' },
    { key: 'Conseillers', icon: 'Conseillers' }
  ].filter((p) => (byPole[p.key]?.length ?? 0) > 0);
  return (
    <div className="ordre-page organigramme-premium-page">
      <section className="org-hero" aria-labelledby="org-title">
        <div className="org-container">
          <span className="org-eyebrow">Gouvernance institutionnelle</span>
          <h1 id="org-title" className="org-title">
            Organigramme de l&apos;ONPG
          </h1>
          <p className="org-lead">
            Une structure claire et représentative pour piloter la profession pharmaceutique au Gabon.
          </p>

          <div className="org-kpi-grid">
            <article
              className="org-kpi-card org-kpi-clickable"
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('hierarchie')?.scrollIntoView({ behavior: 'smooth' })}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('hierarchie')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <strong>1</strong>
              <span>Présidence</span>
            </article>
            <article
              className="org-kpi-card org-kpi-clickable"
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('conseil-national')?.scrollIntoView({ behavior: 'smooth' })}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('conseil-national')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <strong>{loading ? '…' : Math.max(councilMembers.length, 1)}</strong>
              <span>Membres du Conseil National</span>
            </article>
            <article
              className="org-kpi-card org-kpi-clickable"
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' })}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('sections')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <strong>4</strong>
              <span>Sections professionnelles</span>
            </article>
          </div>
        </div>
      </section>

      <section id="hierarchie" className="org-section">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Hiérarchie institutionnelle</h2>
            <p>Lecture simplifiée de la structure de décision et de représentation.</p>
          </header>

          <div className="org-tree">
            <article className="org-level-card root">
              <h3>Ordre National des Pharmaciens</h3>
              <p>Institution de régulation de la profession pharmaceutique</p>
            </article>

            <div className="org-tree-connector" aria-hidden="true" />

            <article
              className="org-level-card presidency org-level-clickable"
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('hierarchie')?.scrollIntoView({ behavior: 'smooth' })}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('hierarchie')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="org-level-title">
                <IconCrown />
                <h3>Présidence</h3>
              </div>
              <p>{president?.fullName || 'Dr Patience Asseko NTOGONO OKE'}</p>
            </article>

            <div className="org-tree-connector" aria-hidden="true" />

            <article
              className="org-level-card board org-level-clickable"
              role="button"
              tabIndex={0}
              onClick={() => document.getElementById('conseil-national')?.scrollIntoView({ behavior: 'smooth' })}
              onKeyDown={(e) => e.key === 'Enter' && document.getElementById('conseil-national')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="org-level-title">
                <IconBoard />
                <h3>Conseil National</h3>
              </div>
              <p>Instance de gouvernance, d’orientation et de supervision</p>
            </article>
          </div>
        </div>
      </section>

      <section id="sections" className="org-section org-section-alt">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Sections professionnelles</h2>
            <p>Quatre sections pour représenter l’ensemble des modes d’exercice.</p>
          </header>

          <div className="org-sections-grid">
            {sections.map((section) => (
              <article key={section.code} className="org-section-card">
                <div className="org-section-top">
                  <div className="org-section-icon">
                    <IconSection />
                  </div>
                  <span className="org-section-code">Section {section.code}</span>
                </div>
                <h3>{section.name}</h3>
                <p>{section.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="conseil-national" className="org-section">
        <div className="org-container">
          <header className="org-section-header">
            <h2>Composition du Conseil National</h2>
            <p>Vue synthétique par pôle. Voir la composition détaillée sur la page Conseil national.</p>
          </header>

          {loading ? (
            <div className="org-roles-loading">Chargement…</div>
          ) : (
            <div className="org-poles-grid">
              {poles.map(({ key }) => {
                const items = byPole[key] || [];
                if (items.length === 0) return null;
                return (
                  <article key={key} className="org-pole-card">
                    <h3 className="org-pole-title">{key}</h3>
                    <ul className="org-pole-list">
                      {items.map((item, i) => (
                        <li key={i}>
                          <span className="org-pole-role">{item.role}</span>
                          <span className="org-pole-name">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          )}

          <div className="org-cta-inline">
            <Link to="/ordre/conseil-national" className="org-link-conseil">
              Voir la composition complète →
            </Link>
          </div>

          <div className="org-trust-strip">
            <div className="org-trust-item">
              <span>Source</span>
              <strong>Ordre National des Pharmaciens du Gabon</strong>
            </div>
            <div className="org-trust-item">
              <span>Dernière mise à jour</span>
              <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="org-cta">
        <div className="org-container">
          <div className="org-cta-content">
            <h2>Poursuivre votre parcours institutionnel</h2>
            <p>Consultez les membres et la présentation complète de l’Ordre.</p>
            <div className="org-cta-actions">
              <Link to="/membres/tableau-ordre" className="org-cta-btn primary">Tableau de l&apos;Ordre</Link>
              <Link to="/ordre/a-propos" className="org-cta-btn secondary">À propos de l&apos;ONPG</Link>
              <Link to="/pratique/contact" className="org-cta-btn secondary">Contact</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organigramme;
