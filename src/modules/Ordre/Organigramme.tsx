import { useState, useEffect } from 'react';

// Types pour l'organigramme
interface OrgNode {
  id: string;
  title: string;
  person: string;
  role: string;
  department?: string;
  children?: OrgNode[];
  level: number;
  color: string;
}

const organigrammeData: OrgNode = {
  id: 'president',
  title: 'Président',
  person: 'Dr. Alain Moreau',
  role: 'Président de l\'ONPG',
  level: 1,
  color: '#00A651',
  children: [
    {
      id: 'vice-president',
      title: 'Vice-Président',
      person: 'Dr. Marie Dubois',
      role: 'Vice-Président',
      level: 2,
      color: '#008F45',
      children: [
        {
          id: 'secretariat',
          title: 'Secrétariat Général',
          person: 'Dr. Jean Martin',
          role: 'Secrétaire Général',
          level: 3,
          color: '#2ECC71'
        },
        {
          id: 'tresorerie',
          title: 'Trésorerie',
          person: 'Dr. Sophie Bernard',
          role: 'Trésorier',
          level: 3,
          color: '#27AE60'
        }
      ]
    },
    {
      id: 'commissions',
      title: 'Commissions',
      person: '',
      role: 'Instances techniques',
      level: 2,
      color: '#3498db',
      children: [
        {
          id: 'deontologie',
          title: 'Commission de Déontologie',
          person: 'Pr. Michel Dubois',
          role: 'Président',
          level: 3,
          color: '#e74c3c'
        },
        {
          id: 'formation',
          title: 'Commission de Formation',
          person: 'Dr. Nathalie Petit',
          role: 'Président',
          level: 3,
          color: '#f39c12'
        },
        {
          id: 'tarification',
          title: 'Commission de Tarification',
          person: 'Dr. Antoine Leroy',
          role: 'Président',
          level: 3,
          color: '#9b59b6'
        }
      ]
    },
    {
      id: 'sections',
      title: 'Sections Professionnelles',
      person: '',
      role: 'Représentation professionnelle',
      level: 2,
      color: '#2ECC71',
      children: [
        {
          id: 'section-a',
          title: 'Section A',
          person: 'Officinaux',
          role: 'Pharmacies de ville',
          level: 3,
          color: '#00A651'
        },
        {
          id: 'section-b',
          title: 'Section B',
          person: 'Biologistes',
          role: 'Labos d\'analyses',
          level: 3,
          color: '#008F45'
        },
        {
          id: 'section-c',
          title: 'Section C',
          person: 'Fonctionnaires',
          role: 'Pharmacie publique',
          level: 3,
          color: '#2ECC71'
        },
        {
          id: 'section-d',
          title: 'Section D',
          person: 'Fabricants/Grossistes',
          role: 'Industrie pharmaceutique',
          level: 3,
          color: '#27AE60'
        }
      ]
    }
  ]
};

const Organigramme = () => {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleNodeClick = (node: OrgNode) => {
    setSelectedNode(node);
  };

  const renderNode = (node: OrgNode, depth: number = 0): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="org-node-container">
        <div
          className={`org-node ${hasChildren ? 'has-children' : ''}`}
          onClick={() => handleNodeClick(node)}
          style={{
            backgroundColor: node.color,
            transform: `scale(${zoom})`
          }}
        >
          <div className="node-content">
            <div className="node-icon">
              {depth === 0 && '👑'}
              {depth === 1 && '⚡'}
              {depth === 2 && '🏛️'}
              {depth === 3 && '👤'}
            </div>
            <div className="node-info">
              <h3 className="node-title">{node.title}</h3>
              {node.person && (
                <div className="node-person">{node.person}</div>
              )}
              <div className="node-role">{node.role}</div>
            </div>
          </div>
          {hasChildren && (
            <div className="node-expander">
              <span>▼</span>
            </div>
          )}
        </div>

        {hasChildren && (
          <div className="org-children">
            <div className="children-connector"></div>
            <div className="children-nodes">
              {node.children!.map(child => renderNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ordre-page">
      {/* Hero Section */}
      <section className="ordre-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="hero-title-main">Organigramme</span>
              <span className="hero-title-subtitle">Institutionnel</span>
            </h1>
            <p className="hero-description">
              Découvrez la structure hiérarchique et organisationnelle de l'ONPG.
              Une organisation claire et démocratique au service des pharmaciens.
            </p>
            <div className="hero-highlights">
              <span className="highlight-item">📊 Structure hiérarchique</span>
              <span className="highlight-item">🎯 Rôles définis</span>
              <span className="highlight-item">🤝 Collaboration</span>
            </div>
          </div>

          <div className="organigramme-controls">
            <div className="zoom-controls">
              <button
                className="zoom-btn"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                🔍-
              </button>
              <span className="zoom-level">{Math.round(zoom * 100)}%</span>
              <button
                className="zoom-btn"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                🔍+
              </button>
            </div>
            <div className="view-controls">
              <button className="view-btn active">🌳 Arborescence</button>
              <button className="view-btn">📋 Liste</button>
            </div>
          </div>
        </div>

        <div className="hero-bg-pattern">
          <div className="pattern-shape shape-1"></div>
          <div className="pattern-shape shape-2"></div>
          <div className="pattern-shape shape-3"></div>
        </div>
      </section>

      {/* Organigramme principal */}
      <section className="organigramme-section">
        <div className="section-container">
          <div className="organigramme-container">
            {renderNode(organigrammeData)}
          </div>
        </div>
      </section>

      {/* Modal de détail */}
      {selectedNode && (
        <div className="node-modal-overlay" onClick={() => setSelectedNode(null)}>
          <div className="node-modal-content" onClick={e => e.stopPropagation()}>
            <button
              className="node-modal-close"
              onClick={() => setSelectedNode(null)}
            >
              ✕
            </button>

            <div className="node-modal-header">
              <div
                className="node-modal-icon"
                style={{ backgroundColor: selectedNode.color }}
              >
                {selectedNode.level === 1 && '👑'}
                {selectedNode.level === 2 && '⚡'}
                {selectedNode.level === 3 && '🏛️'}
                {selectedNode.level === 4 && '👤'}
              </div>
              <div className="node-modal-info">
                <h2>{selectedNode.title}</h2>
                {selectedNode.person && (
                  <div className="modal-person">{selectedNode.person}</div>
                )}
                <div className="modal-role">{selectedNode.role}</div>
              </div>
            </div>

            <div className="node-modal-body">
              <div className="node-details">
                <div className="detail-item">
                  <strong>Niveau hiérarchique:</strong> {selectedNode.level}
                </div>
                <div className="detail-item">
                  <strong>Fonction:</strong> {selectedNode.role}
                </div>
                {selectedNode.department && (
                  <div className="detail-item">
                    <strong>Département:</strong> {selectedNode.department}
                  </div>
                )}
              </div>

              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="node-subordinates">
                  <h3>Équipe dirigée ({selectedNode.children.length})</h3>
                  <div className="subordinates-list">
                    {selectedNode.children.map(child => (
                      <div key={child.id} className="subordinate-item">
                        <span className="subordinate-title">{child.title}</span>
                        {child.person && (
                          <span className="subordinate-person"> - {child.person}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organigramme;

