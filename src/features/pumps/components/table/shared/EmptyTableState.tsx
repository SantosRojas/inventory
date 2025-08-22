import { memo } from 'react';
import { LAYOUT_STYLES, TEXT_STYLES } from './styles';

interface EmptyTableStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
}

const EmptyTableState = memo(({ 
    title = "No se encontraron bombas", 
    message = "Intente buscar por serie o qr.",
    icon
}: EmptyTableStateProps) => {
    const defaultIcon = (
        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-5 5m0 0l-5-5m5 5v6" />
        </svg>
    );

    return (
        <div className={`${LAYOUT_STYLES.centerContainer} ${LAYOUT_STYLES.contentPadding}`}>
            <div className="text-gray-400 mb-4">
                {icon || defaultIcon}
            </div>
            <h3 className={`text-lg ${TEXT_STYLES.fontMedium} ${TEXT_STYLES.textGray900} mb-2`}>{title}</h3>
            <p className={TEXT_STYLES.textGray500}>{message}</p>
        </div>
    );
});

EmptyTableState.displayName = 'EmptyTableState';

export default EmptyTableState;
