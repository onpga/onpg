import { Link } from 'react-router-dom';
import './AProposOrdre.css';
import '../Pratique/Pratique.css';

const SantePublique = () => {
  return (
    <div className="pratique-page">
      {/* Hero Section - Style similaire à Déontologie */}
      <section className="pratique-hero" style={{ background: 'linear-gradient(135deg, #00A651 0%, #008F45 100%)' }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Protection de la</span>
              <span className="hero-title-subtitle">Santé Publique</span>
            </h1>
            <p className="hero-description">
              Garantir la qualité et la sécurité des médicaments au Gabon.
              L'ONPG veille à la protection de la santé publique par le contrôle
              et la régulation de la profession pharmaceutique.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">🏥 Qualité des médicaments</span>
              <span className="highlight-item">🛡️ Sécurité sanitaire</span>
              <span className="highlight-item">📋 Réglementation</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Engagement</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Vigilance</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Protection</div>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="section-content">
        <div className="section-container">
          <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              marginBottom: '1.5rem', 
              color: '#00A651',
              fontWeight: '700'
            }}>
              Notre Mission
            </h2>
            <p style={{ 
              fontSize: '1.1rem', 
              color: '#333', 
              marginBottom: '2rem', 
              lineHeight: '1.8' 
            }}>
              L'Ordre National des Pharmaciens du Gabon (ONPG) a pour mission fondamentale 
              de protéger la santé publique en garantissant la qualité, la sécurité et 
              l'efficacité des médicaments et produits de santé disponibles au Gabon.
            </p>

            <h3 style={{ 
              fontSize: '1.6rem', 
              marginTop: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#00A651',
              fontWeight: '600'
            }}>
              Nos Actions
            </h3>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #00A651'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#00A651',
                  fontWeight: '600'
                }}>
                  Contrôle de la qualité des médicaments
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Veiller à ce que tous les médicaments commercialisés respectent les normes 
                  de qualité et de sécurité établies.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #00A651'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#00A651',
                  fontWeight: '600'
                }}>
                  Lutte contre les médicaments falsifiés
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Mettre en place des mécanismes de détection et de prévention contre 
                  les médicaments contrefaits ou falsifiés.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #00A651'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#00A651',
                  fontWeight: '600'
                }}>
                  Surveillance pharmaceutique
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Assurer une veille active sur les effets indésirables et les problèmes 
                  de sécurité liés aux médicaments.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #00A651'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#00A651',
                  fontWeight: '600'
                }}>
                  Formation et sensibilisation
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Informer les professionnels de santé et le public sur les bonnes pratiques 
                  d'utilisation des médicaments.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #00A651'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#00A651',
                  fontWeight: '600'
                }}>
                  Réglementation
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Participer à l'élaboration et à l'application des textes réglementaires 
                  relatifs à la pharmacie et aux médicaments.
                </p>
              </div>
            </div>

            <h3 style={{ 
              fontSize: '1.6rem', 
              marginTop: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#00A651',
              fontWeight: '600'
            }}>
              Engagement
            </h3>
            <div style={{
              padding: '2rem',
              backgroundColor: 'linear-gradient(135deg, #f0f9f4 0%, #e8f5e9 100%)',
              backgroundColor: '#f0f9f4',
              borderRadius: '12px',
              border: '2px solid #00A651'
            }}>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#333', 
                lineHeight: '1.8', 
                margin: 0,
                fontWeight: '500'
              }}>
                L'ONPG s'engage à travailler en étroite collaboration avec les autorités 
                sanitaires, les professionnels de santé et les patients pour garantir 
                un accès sécurisé aux médicaments de qualité au Gabon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            to="/" 
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'white',
              color: '#00A651',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '2px solid #00A651',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00A651';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#00A651';
            }}
          >
            ← Retour à l'accueil
          </Link>
          <Link 
            to="/ordre/a-propos" 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #00A651 0%, #008F45 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 12px rgba(0, 166, 81, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 166, 81, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 166, 81, 0.3)';
            }}
          >
            En savoir plus sur l'Ordre →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SantePublique;
