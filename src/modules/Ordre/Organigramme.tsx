import { useState } from 'react';
import './Organigramme.css';

const Organigramme = () => {
  return (
    <div className="ordre-page">
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Organigramme</span>
              <span className="hero-title-subtitle">Institutionnel</span>
            </h1>
            <p className="hero-description">
              Structure organisationnelle de l&apos;Ordre National des Pharmaciens du Gabon.
            </p>
          </div>
        </div>
      </section>

      <section className="organigramme-section" style={{ padding: '3rem 0', backgroundColor: '#f8f9fa' }}>
        <div className="section-container">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {/* Ordre */}
            <div style={{
              backgroundColor: '#00A651',
              color: 'white',
              padding: '1.5rem 3rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              textAlign: 'center',
              minWidth: '300px'
            }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Ordre National des Pharmaciens</h2>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem', opacity: 0.9 }}>ONPG</p>
            </div>

            {/* Flèche vers le bas */}
            <div style={{
              width: '4px',
              height: '60px',
              backgroundColor: '#00A651',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '-6px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '16px solid #00A651'
              }}></div>
            </div>

            {/* Présidente */}
            <div style={{
              backgroundColor: '#2ECC71',
              color: 'white',
              padding: '1.5rem 2.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              textAlign: 'center',
              minWidth: '280px'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>👑 Présidente</h3>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '1rem' }}>Dr. Marie Dupont</p>
            </div>

            {/* Flèche vers le bas */}
            <div style={{
              width: '4px',
              height: '60px',
              backgroundColor: '#2ECC71',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '-6px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '16px solid #2ECC71'
              }}></div>
            </div>

            {/* Secrétaire et Sections */}
            <div style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}>
              {/* Secrétaire */}
              <div style={{
                backgroundColor: '#27AE60',
                color: 'white',
                padding: '1.2rem 2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textAlign: 'center',
                minWidth: '220px'
              }}>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>📝 Secrétaire</h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>Dr. Jean Martin</p>
              </div>

              {/* Sections */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                minWidth: '300px'
              }}>
                <div style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Section A - Officinaux</h4>
                </div>
                <div style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Section B - Biologistes</h4>
                </div>
                <div style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Section C - Fonctionnaires</h4>
                </div>
                <div style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  padding: '1rem 1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Section D - Fabricants/Grossistes</h4>
                </div>
              </div>
            </div>

            {/* Flèche vers le bas */}
            <div style={{
              width: '4px',
              height: '60px',
              backgroundColor: '#3498db',
              position: 'relative',
              marginTop: '1rem'
            }}>
              <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '-6px',
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '16px solid #3498db'
              }}></div>
            </div>

            {/* Conseillers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              width: '100%',
              maxWidth: '800px'
            }}>
              <div style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>👤 Conseiller</h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Dr. Sophie Bernard</p>
              </div>
              <div style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>👤 Conseiller</h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Dr. Michel Dubois</p>
              </div>
              <div style={{
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>👤 Conseiller</h4>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Dr. Nathalie Petit</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Organigramme;
