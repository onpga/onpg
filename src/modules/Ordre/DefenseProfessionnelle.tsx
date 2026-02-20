import { Link } from 'react-router-dom';
import './AProposOrdre.css';
import '../Pratique/Pratique.css';

const DefenseProfessionnelle = () => {
  return (
    <div className="pratique-page">
      {/* Hero Section - Style similaire à Déontologie */}
      <section className="pratique-hero" style={{ background: 'linear-gradient(135deg, #008F45 0%, #006637 100%)' }}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Défense des</span>
              <span className="hero-title-subtitle">Pharmaciens</span>
            </h1>
            <p className="hero-description">
              Représenter et défendre les intérêts professionnels.
              L'ONPG est le porte-parole de la profession pharmaceutique 
              et défend activement les droits de tous les pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">👥 Représentation</span>
              <span className="highlight-item">⚖️ Défense des droits</span>
              <span className="highlight-item">🤝 Accompagnement</span>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-card">
              <div className="stat-number">100%</div>
              <div className="stat-label">Engagement</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Disponibilité</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">∞</div>
              <div className="stat-label">Soutien</div>
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
              color: '#008F45',
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
              L'Ordre National des Pharmaciens du Gabon (ONPG) représente et défend 
              les intérêts légitimes de la profession pharmaceutique au Gabon, 
              en veillant à la reconnaissance et au respect des droits des pharmaciens.
            </p>

            <h3 style={{ 
              fontSize: '1.6rem', 
              marginTop: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#008F45',
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
                borderLeft: '4px solid #008F45'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#008F45',
                  fontWeight: '600'
                }}>
                  Représentation professionnelle
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Représenter les pharmaciens auprès des pouvoirs publics, des institutions 
                  et des organismes nationaux et internationaux.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #008F45'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#008F45',
                  fontWeight: '600'
                }}>
                  Défense des droits
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Défendre les droits et intérêts des pharmaciens dans le cadre de leur 
                  exercice professionnel.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #008F45'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#008F45',
                  fontWeight: '600'
                }}>
                  Négociation collective
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Participer aux négociations concernant les conditions d'exercice, 
                  la rémunération et les avantages sociaux des pharmaciens.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #008F45'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#008F45',
                  fontWeight: '600'
                }}>
                  Conseil et accompagnement
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Offrir un accompagnement juridique et professionnel aux pharmaciens 
                  confrontés à des difficultés dans leur pratique.
                </p>
              </div>

              <div style={{
                padding: '1.5rem',
                marginBottom: '1rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                borderLeft: '4px solid #008F45'
              }}>
                <h4 style={{ 
                  fontSize: '1.2rem', 
                  marginBottom: '0.75rem', 
                  color: '#008F45',
                  fontWeight: '600'
                }}>
                  Promotion de la profession
                </h4>
                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.7', margin: 0 }}>
                  Promouvoir l'image et la valeur de la profession pharmaceutique 
                  auprès du public et des autorités.
                </p>
              </div>
            </div>

            <h3 style={{ 
              fontSize: '1.6rem', 
              marginTop: '2.5rem', 
              marginBottom: '1.5rem', 
              color: '#008F45',
              fontWeight: '600'
            }}>
              Engagement
            </h3>
            <div style={{
              padding: '2rem',
              backgroundColor: '#f0f9f4',
              borderRadius: '12px',
              border: '2px solid #008F45'
            }}>
              <p style={{ 
                fontSize: '1.1rem', 
                color: '#333', 
                lineHeight: '1.8', 
                margin: 0,
                fontWeight: '500'
              }}>
                L'ONPG s'engage à être le porte-parole de la profession pharmaceutique 
                et à défendre activement les intérêts de tous les pharmaciens inscrits 
                à l'Ordre, dans le respect de l'éthique et de la déontologie professionnelle.
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
              color: '#008F45',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '2px solid #008F45',
              fontWeight: '600',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#008F45';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = '#008F45';
            }}
          >
            ← Retour à l'accueil
          </Link>
          <Link 
            to="/ordre/a-propos" 
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #008F45 0%, #006637 100%)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'transform 0.3s',
              boxShadow: '0 4px 12px rgba(0, 143, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 143, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 143, 69, 0.3)';
            }}
          >
            En savoir plus sur l'Ordre →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DefenseProfessionnelle;
