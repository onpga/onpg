import React, { useState } from 'react';
import { ProfileIcon } from '../../utils/profileIcon';

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  borderColor: string;
  size?: number;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ 
  src, 
  alt, 
  borderColor, 
  size = 120 
}) => {
  const [imageError, setImageError] = useState(false);
  const hasPhoto = src && !imageError;

  return (
    <div style={{ textAlign: 'center', marginBottom: '1rem', position: 'relative' }}>
      {hasPhoto ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            objectFit: 'cover',
            border: `3px solid ${borderColor}`,
            marginBottom: '0.5rem'
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <ProfileIcon borderColor={borderColor} size={size} />
      )}
    </div>
  );
};

