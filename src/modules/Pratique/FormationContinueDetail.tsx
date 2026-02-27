import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetchResourceById } from '../../utils/pageMocksApi';
import './FormationContinue.css';

interface Formation {
  _id?: string;
  title: string;
  description: string;
  duration: string;
  price?: number;
  showPrice: boolean;
  category: string;
  instructor?: string;
  date?: string;
  location?: string;
  isActive: boolean;
  featured?: boolean;
  content?: string;
}

const FormationContinueDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Identifiant de formation manquant.');
      setLoading(false);
      return;
    }

    const loadFormation = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchResourceById('formations', id);
        if (!data) {
          setError('Formation introuvable ou non disponible.');
          setFormation(null);
          return;
        }

        const mapped: Formation = {
          _id: String((data as any)._id || ''),
          title: (data as any).title || '',
          description: (data as any).description || '',
          duration: (data as any).duration || '',
          price: (data as any).price,
          showPrice: (data as any).showPrice || false,
          category: (data as any).category || '',
          instructor: (data as any).instructor || '',
          date: (data as any).date || '',
          location: (data as any).location || '',
          isActive: (data as any).isActive !== undefined ? (data as any).isActive : true,
          featured: (data as any).featured || false,
          content: (data as any).content || ''
        };

        setFormation(mapped);
      } catch (e) {
        console.error('Erreur chargement formation:', e);
        setError('Erreur lors du chargement de la formation.');
        setFormation(null);
      } finally {
        setLoading(false);
      }
    };

    loadFormation();
  }, [id]);

  const handleBack = () => {
    navigate('/pratique/formation-continue');
  };

  return (
    <div className="pratique-page">
      <section className="pratique-hero" style={{ background: 'linear-gradient(135deg, #2ECC71 0%, #27AE60 100%)' }}>
        <div className="hero-content">
          <div className="hero-text">
            <p className="formation-detail-breadcrumb">
              <button type="button" onClick={handleBack} className="formation-detail-back">
                ← Retour au catalogue
              </button>
            </p>
            <h1 className="hero-title">
              <span className="hero-title-main">
                {formation ? formation.title : 'Formation continue'}
              </span>
              <span className="hero-title-subtitle">Détail de la formation</span>
            </h1>
            {formation && (
              <p className="hero-description">
                {formation.description || 'Découvrez le détail complet de cette formation continue.'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section-content">
        <div className="section-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.1rem', color: '#666' }}>
              Chargement de la formation...
            </div>
          ) : error ? (
            <div className="formations-empty-filters">
              <h3>{error}</h3>
              <p>
                Vous pouvez revenir au{' '}
                <Link to="/pratique/formation-continue">
                  catalogue des formations
                </Link>
                .
              </p>
            </div>
          ) : !formation ? (
            <div className="formations-empty-filters">
              <h3>Formation introuvable</h3>
              <p>
                Cette formation n&apos;est plus disponible ou n&apos;existe pas.
              </p>
            </div>
          ) : (
            <div className="formation-detail">
              <div className="formation-detail-header">
                {formation.category && (
                  <span className="formation-detail-chip">
                    {formation.category}
                  </span>
                )}
                {formation.featured && (
                  <span className="formation-detail-chip featured">
                    ⭐ À la une
                  </span>
                )}
              </div>

              <div className="formation-detail-main">
                <div className="formation-detail-meta">
                  {formation.duration && (
                    <div className="formation-detail-meta-item">
                      <span className="label">Durée</span>
                      <span className="value">{formation.duration}</span>
                    </div>
                  )}
                  {formation.date && (
                    <div className="formation-detail-meta-item">
                      <span className="label">Date</span>
                      <span className="value">
                        {new Date(formation.date).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                  {formation.location && (
                    <div className="formation-detail-meta-item">
                      <span className="label">Lieu</span>
                      <span className="value">{formation.location}</span>
                    </div>
                  )}
                  {formation.instructor && (
                    <div className="formation-detail-meta-item">
                      <span className="label">Formateur</span>
                      <span className="value">{formation.instructor}</span>
                    </div>
                  )}
                  {formation.showPrice && formation.price && (
                    <div className="formation-detail-meta-item highlight">
                      <span className="label">Tarif</span>
                      <span className="value">
                        {formation.price.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                </div>

                <div className="formation-detail-body">
                  {formation.content ? (
                    <p className="formation-detail-text">
                      {formation.content}
                    </p>
                  ) : (
                    <p className="formation-detail-text">
                      {formation.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default FormationContinueDetail;



