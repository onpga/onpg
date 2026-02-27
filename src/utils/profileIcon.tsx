import React from 'react';

interface ProfileIconProps {
  borderColor: string;
  size?: number;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({ borderColor, size = 120 }) => {
  // Convertir la couleur hex en RGB pour le gradient
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 166, b: 81 }; // Default green
  };

  const rgb = hexToRgb(borderColor);
  const lightColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
  const mediumColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        margin: '0 auto',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: `3px solid ${borderColor}`,
        background: `linear-gradient(135deg, ${lightColor} 0%, ${mediumColor} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <svg width={size * 0.67} height={size * 0.67} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="30" r="15" fill={borderColor} opacity="0.9" />
        <path d="M15 70 C15 55, 25 50, 40 50 C55 50, 65 55, 65 70" fill={borderColor} opacity="0.9" />
      </svg>
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          width: `${size * 0.2}px`,
          height: `${size * 0.2}px`,
          borderRadius: '50%',
          background: borderColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
      >
        <span style={{ color: 'white', fontSize: `${size * 0.12}px`, fontWeight: 'bold' }}>👤</span>
      </div>
    </div>
  );
};







