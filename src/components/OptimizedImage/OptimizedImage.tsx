import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * Composant Image optimisé avec lazy loading et fallback
 */
export const OptimizedImage = ({
  src,
  alt,
  fallback,
  className,
  style,
  loading = 'lazy',
  width,
  height,
  onError
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
      setHasError(true);
    } else if (onError) {
      onError(e);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Optimiser l'URL Cloudinary si possible
  const optimizedSrc = imageSrc?.includes('cloudinary.com') && imageSrc?.includes('/upload/')
    ? imageSrc.replace('/upload/', '/upload/q_auto,f_auto,w_auto/')
    : imageSrc;

  return (
    <img
      ref={imgRef}
      src={optimizedSrc}
      alt={alt}
      className={className}
      style={{
        ...style,
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s ease'
      }}
      loading={loading}
      width={width}
      height={height}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
};

