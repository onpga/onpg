import { useEffect, useState } from 'react';
import './AfricaMap.css';

const AfricaMap = () => {
  const [activeConnections, setActiveConnections] = useState<number[]>([]);

  useEffect(() => {
    // Animation des connexions progressives
    const intervals: NodeJS.Timeout[] = [];
    
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach((index) => {
      const timeout = setTimeout(() => {
        setActiveConnections(prev => [...prev, index]);
      }, index * 700);
      intervals.push(timeout);
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, []);

  // Coordonnées ajustées avec espacement élargi pour montrer les distances
  // Villes bien espacées pour une meilleure compréhension géographique
  const cities = [
    { name: 'Libreville', x: 30, y: 50, isHeadquarter: true, type: 'current' }, // Gabon - Côte ouest atlantique, équateur - SIÈGE
    { name: 'Yaoundé', x: 40, y: 40, type: 'current' }, // Cameroun - Nord de Libreville - PRÉSENT
    { name: 'Brazzaville', x: 55, y: 52, type: 'current' }, // Congo - Est de Libreville, intérieur - PRÉSENT
    { name: 'Kinshasa', x: 55, y: 62, type: 'current' }, // RDC - Sud de Brazzaville - PRÉSENT
    { name: "N'Djamena", x: 52, y: 25, type: 'current' }, // Tchad - Nord-est, centre Afrique - PRÉSENT
    { name: 'Luanda', x: 35, y: 75, type: 'expansion' }, // Angola - Sud-ouest, côte atlantique - EXPANSION
    { name: 'Lagos', x: 22, y: 44, type: 'expansion' }, // Nigeria - Côte ouest, golfe de Guinée - EXPANSION
    { name: 'Nairobi', x: 75, y: 52, type: 'expansion' }, // Kenya - Est, proche équateur - EXPANSION
    { name: 'Abidjan', x: 12, y: 46, type: 'expansion' } // Côte d'Ivoire - Plus à l'ouest, côte atlantique - EXPANSION
  ];

  const connections = [
    { from: 0, to: 1, type: 'current' }, // Libreville - Yaoundé (Cameroun)
    { from: 0, to: 2, type: 'current' }, // Libreville - Brazzaville (Congo)
    { from: 0, to: 3, type: 'current' }, // Libreville - Kinshasa (RDC)
    { from: 0, to: 4, type: 'current' }, // Libreville - N'Djamena (Tchad)
    { from: 0, to: 5, type: 'expansion' }, // Libreville - Luanda (Angola - futur)
    { from: 0, to: 6, type: 'expansion' }, // Libreville - Lagos (Nigeria - futur)
    { from: 0, to: 7, type: 'expansion' }, // Libreville - Nairobi (Kenya - futur)
    { from: 0, to: 8, type: 'expansion' }  // Libreville - Abidjan (Côte d'Ivoire - futur)
  ];

  return (
    <div className="africa-map-container">
      <svg 
        viewBox="0 0 100 100" 
        className="africa-map-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Fond avec gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001a3d" />
            <stop offset="100%" stopColor="#002F6C" />
          </linearGradient>
          
          {/* Gradient pour les lignes actives */}
          <linearGradient id="lineGradientCurrent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.8" />
          </linearGradient>
          
          {/* Gradient pour les lignes d'expansion */}
          <linearGradient id="lineGradientExpansion" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8C42" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#FF8C42" stopOpacity="0.3" />
          </linearGradient>

          {/* Filtre pour effet de lueur */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fond transparent - La carte afrique.svg est en CSS background */}
        <rect width="100" height="100" fill="transparent" />

        {/* Lignes de connexion */}
        <g className="connections">
          {connections.map((conn, index) => {
            const from = cities[conn.from];
            const to = cities[conn.to];
            const isActive = activeConnections.includes(index);
            const strokeColor = conn.type === 'current' 
              ? 'url(#lineGradientCurrent)' 
              : 'url(#lineGradientExpansion)';
            
            return (
              <g key={index}>
                {/* Ligne de base */}
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={strokeColor}
                  strokeWidth={conn.type === 'current' ? '0.4' : '0.3'}
                  strokeDasharray={conn.type === 'expansion' ? '1,1' : 'none'}
                  opacity={isActive ? 1 : 0}
                  className={`connection-line ${isActive ? 'active' : ''}`}
                  style={{
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
                
                {/* Pulse animé sur la ligne */}
                {isActive && (
                  <circle
                    r="0.5"
                    fill="#FFD700"
                    filter="url(#glow)"
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </g>

        {/* Points des villes */}
        <g className="cities">
          {cities.map((city, index) => {
            const isActive = index === 0 || activeConnections.some(conn => 
              connections[conn].to === index
            );
            
            return (
              <g key={city.name}>
                {/* Cercle de base */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={city.isHeadquarter ? '2' : '1.2'}
                  fill={
                    city.isHeadquarter ? '#FF8C42' : // Orange pour siège
                    city.type === 'current' ? '#4A90E2' : // Bleu pour présence actuelle
                    '#FFD700' // Jaune pour expansion future
                  }
                  opacity={isActive ? 1 : 0.3}
                  filter={city.isHeadquarter ? 'url(#glow)' : 'none'}
                  className={`city-marker ${isActive ? 'active' : ''}`}
                  style={{
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                />
                
                {/* Cercle extérieur pour le siège */}
                {city.isHeadquarter && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="3"
                    fill="none"
                    stroke="#FF8C42"
                    strokeWidth="0.3"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="4"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Label ville */}
                <text
                  x={city.x}
                  y={city.y - 3.5}
                  fontSize="2.8"
                  fill="white"
                  textAnchor="middle"
                  opacity={isActive ? 1 : 0}
                  className="city-label"
                  style={{
                    transition: 'opacity 0.5s ease-in-out',
                    fontWeight: city.isHeadquarter ? 'bold' : 'normal'
                  }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Légende */}
      <div className="map-legend-interactive">
        <div className="legend-item">
          <span className="legend-dot headquarters">🟠</span>
          <span>Siège social - Libreville, Gabon</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot current">🔵</span>
          <span>Présence actuelle - Afrique Centrale</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot expansion">🟡</span>
          <span>Expansion prévue - Afrique de l'Ouest & Est</span>
        </div>
      </div>
    </div>
  );
};

export default AfricaMap;

