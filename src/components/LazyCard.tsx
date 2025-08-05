import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LazyCardProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  fallbackHeight?: string;
}

const LazyCard: React.FC<LazyCardProps> = ({ 
  children, 
  className = '', 
  threshold = 0.1, 
  rootMargin = '200px',
  fallbackHeight = 'h-48'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback(([entry]: IntersectionObserverEntry[]) => {
    if (entry.isIntersecting && !hasLoaded) {
      setIsVisible(true);
      setHasLoaded(true);
      // Limpiar observer inmediatamente después de cargar
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }
  }, [hasLoaded]);

  useEffect(() => {
    if (!cardRef.current || hasLoaded) return;

    // Crear observer con configuración optimizada
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observerRef.current.observe(cardRef.current);

    // Cleanup en desmontaje
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin, hasLoaded]);

  return (
    <div ref={cardRef} className={className}>
      {isVisible ? (
        children
      ) : (
        // Placeholder optimizado con altura fija para evitar layout shifts
        <div className={`bg-gray-100 rounded-lg animate-pulse ${fallbackHeight} w-full flex items-center justify-center`}>
          <div className="text-gray-400 text-sm">🔄 Cargando...</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyCard);
