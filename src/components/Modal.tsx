import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'fullscreen-mobile'; // Nueva variante para formularios largos
  preventCloseOnOverlay?: boolean;
  preventCloseOnEscape?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  variant = 'default',
  preventCloseOnOverlay = false,
  preventCloseOnEscape = false
}) => {
  useEffect(() => {
    if (!isOpen || preventCloseOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, preventCloseOnEscape]);
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Configuración específica para formularios que necesitan más espacio en móvil
  const isFullscreenMobile = variant === 'fullscreen-mobile';
  
  const containerClasses = isFullscreenMobile 
    ? "flex items-end justify-center min-h-screen px-0 sm:px-4 pt-0 pb-0 sm:pt-4 sm:pb-20 text-center sm:items-center sm:p-0"
    : "flex items-end justify-center min-h-screen px-1 sm:px-4 pt-2 pb-2 sm:pt-4 sm:pb-20 text-center sm:items-center sm:p-0";
    
    const modalClasses = isFullscreenMobile
    ? `relative inline-block w-full p-2 sm:p-4 md:p-6 my-0 sm:my-8 overflow-hidden text-left align-bottom sm:align-middle 
       transition-all transform bg-white shadow-xl rounded-none sm:rounded-lg ${sizeClasses[size]}
       max-h-[100vh] sm:max-h-[90vh] md:max-h-[85vh] overflow-y-auto scroll-smooth`
    : `relative inline-block w-full p-3 sm:p-4 md:p-6 my-1 sm:my-8 overflow-hidden text-left align-bottom sm:align-middle 
       transition-all transform bg-white shadow-xl rounded-t-xl sm:rounded-lg ${sizeClasses[size]}
       max-h-[97vh] sm:max-h-[85vh] md:max-h-[80vh] overflow-y-auto scroll-smooth
       safe-bottom safe-top`;  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className={containerClasses}>
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={preventCloseOnOverlay ? undefined : onClose}
        />
        
        {/* Modal */}
        <div className={modalClasses}>
          {title && (
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h3 className="text-sm sm:text-lg font-medium leading-6 text-gray-900 pr-2">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 touch-target flex-shrink-0"
                aria-label="Cerrar modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="pb-1 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
