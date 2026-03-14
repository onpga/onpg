import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchResourceData } from '../../utils/pageMocksApi';
import { useApiCache } from '../../hooks/useApiCache';
import { useDebounce } from '../../hooks/useDebounce';
import { ONPG_IMAGES } from '../../utils/cloudinary-onpg';
import './SectionPremium.css';

interface Pharmacien {
  _id?: string;
  nom: string;
  prenom: string;
  section?: string;
  photo?: string;
  role?: string;
  these?: string;
}

interface SectionTemplateProps {
  section: 'A' | 'B' | 'C' | 'D';
  subtitle: string;
  description: string;
  accentClass: 'is-a' | 'is-b' | 'is-c' | 'is-d';
  mockPharmaciens: Pharmacien[];
}

const getPhotoUrl = (photo?: string) => {
  if (!photo || photo === 'null' || photo === 'undefined') return ONPG_IMAGES.logo;
  return photo;
};

const normalizeSection = (value?: string) => (value || '').trim().toUpperCase();

const SectionTemplate = ({
  section,
  subtitle,
  description,
  accentClass,
  mockPharmaciens
}: SectionTemplateProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const { data, loading } = useApiCache<Pharmacien[]>(
    async () => {
      const response = await fetchResourceData('pharmaciens');
      const arr = Array.isArray(response) ? response : [];
      const sectionMembers = arr
        .filter((p: any) => p && p.isActive !== false && normalizeSection(p.section) === section)
        .map((p: any) => ({
          _id: p._id,
          nom: String(p.nom || '').trim(),
          prenom: String(p.prenom || '').trim(),
          section,
          photo: p.photo || '',
          role: p.role || '',
          these: p.these || ''
        }));

      return sectionMembers.length > 0 ? sectionMembers : mockPharmaciens;
    },
    [],
    { ttl: 30 * 60 * 1000, staleWhileRevalidate: true, key: `section_${section}_members` }
  );

  const pharmaciens = data || mockPharmaciens;

  const filteredPharmaciens = useMemo(() => {
    const q = debouncedSearchQuery.trim().toLowerCase();
    if (!q) return pharmaciens;
    return pharmaciens.filter((p) => `${p.nom} ${p.prenom}`.toLowerCase().includes(q));
  }, [pharmaciens, debouncedSearchQuery]);

  return (
    <div className={`section-page ${accentClass}`}>
      <section className="section-premium-hero">
        <div className="section-premium-container">
          <span className="section-premium-eyebrow">Membres de l&apos;Ordre</span>
          <h1 className="section-premium-title">Section {section}</h1>
          <p className="section-premium-subtitle">{subtitle}</p>
          <p className="section-premium-lead">{description}</p>

          <div className="section-premium-kpis">
            <article className="section-premium-kpi">
              <strong>{pharmaciens.length}</strong>
              <span>Membres listés</span>
            </article>
            <article className="section-premium-kpi">
              <strong>{filteredPharmaciens.length}</strong>
              <span>Résultats affichés</span>
            </article>
            <article className="section-premium-kpi">
              <strong>{section}</strong>
              <span>Section active</span>
            </article>
          </div>
        </div>
      </section>

      <section className="section-premium-panel">
        <div className="section-premium-container">
          <div className="section-premium-toolbar">
            <div className="section-premium-search">
              <label htmlFor={`section-search-${section}`}>Recherche</label>
              <input
                id={`section-search-${section}`}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom ou prénom..."
              />
            </div>

            <nav className="section-premium-nav" aria-label="Navigation sections">
              {(['A', 'B', 'C', 'D'] as const).map((item) => (
                <Link
                  key={item}
                  to={`/membres/section-${item.toLowerCase()}`}
                  className={`section-nav-link ${item === section ? 'is-active' : ''}`}
                >
                  Section {item}
                </Link>
              ))}
            </nav>
          </div>

          <div className="section-premium-results">
            <h2>{filteredPharmaciens.length} pharmacien{filteredPharmaciens.length > 1 ? 's' : ''}</h2>
            <span>Données mock conservées en fallback automatique.</span>
          </div>

          {loading ? (
            <div className="section-premium-empty">
              <h3>Chargement en cours...</h3>
              <p>Préparation de la liste des membres de la section.</p>
            </div>
          ) : filteredPharmaciens.length === 0 ? (
            <div className="section-premium-empty">
              <h3>Aucun résultat</h3>
              <p>Aucun pharmacien ne correspond à votre recherche.</p>
            </div>
          ) : (
            <div className="section-premium-grid">
              {filteredPharmaciens.map((pharmacien) => (
                <article
                  key={pharmacien._id || `${pharmacien.nom}-${pharmacien.prenom}`}
                  className="section-premium-card"
                >
                  <img
                    src={getPhotoUrl(pharmacien.photo)}
                    alt={`${pharmacien.prenom} ${pharmacien.nom}`}
                    className="section-premium-avatar"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== ONPG_IMAGES.logo) target.src = ONPG_IMAGES.logo;
                    }}
                  />
                  <h3>Dr. {pharmacien.prenom} {pharmacien.nom}</h3>
                  {pharmacien.role && <p className="section-premium-role">{pharmacien.role}</p>}
                  {pharmacien.these && <p className="section-premium-these">{pharmacien.these}</p>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default SectionTemplate;
