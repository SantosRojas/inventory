import { memo } from 'react';
import { LAYOUT_STYLES, TEXT_STYLES } from './styles';

const ErrorSearchPump = memo(() => {
    const defaultIcon = (
    <svg
      className="mx-auto h-12 w-12 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 
           9-4.03 9-9-4.03-9-9-9z" 
      />
    </svg>
  );

  return (
    <div className={`${LAYOUT_STYLES.centerContainer} ${LAYOUT_STYLES.contentPadding} text-center`}>
      <div className="mb-4">
        { defaultIcon}
      </div>
      <h3 className={`text-lg ${TEXT_STYLES.fontMedium} ${TEXT_STYLES.textGray900} mb-2`}>
        No se encontraron resultados
      </h3>
      <p className={`${TEXT_STYLES.textGray500} max-w-md mx-auto`}>
        Intente buscar nuevamente por serie o qr.
      </p>
    </div>
  );
});

ErrorSearchPump.displayName = 'ErrorSearchPump';

export default ErrorSearchPump;
