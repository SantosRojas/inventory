import { memo } from 'react';
import type { ReactNode } from 'react';
import { LAYOUT_STYLES, TEXT_STYLES } from './styles';

interface CellProps {
    children: ReactNode;
    title?: string;
    className?: string;
    hasBorder?: boolean;
    isCenter?: boolean;
    isHeader?: boolean;
    width?: string;
    hasSpecialLayout?: boolean; // Solo para celdas de datos que necesiten layout especial
    paddingSize?: 'compact' | 'normal' | 'comfortable'; // Nuevo: control de padding
}

const Cell = memo(({
    children,
    title,
    className = "",
    hasBorder = true,
    isCenter = false,
    isHeader = false,
    width = "",
    hasSpecialLayout = false,
    paddingSize = 'normal'
}: CellProps) => {
    const alignClass = isCenter ? "text-center" : "text-left";
    
    // Clases específicas para header vs celda de datos
    const headerClasses = isHeader 
        ? `${TEXT_STYLES.textXs} ${TEXT_STYLES.fontSemibold} ${TEXT_STYLES.textGray700} uppercase tracking-wider bg-gray-50` 
        : "";
    
    const cellBorderClass = isHeader ? "border-gray-200" : "border-gray-100";
    const finalBorderClass = hasBorder ? `border-r ${cellBorderClass}` : "";
    
    const Tag = isHeader ? 'th' : 'td';
    
    // Configuración de padding según el tamaño especificado
    const paddingClasses = {
        compact: "px-1 lg:px-2 xl:px-2 py-2 lg:py-2",      // Más compacto
        normal: "px-2 lg:px-3 xl:px-4 py-3 lg:py-4",       // Original
        comfortable: "px-3 lg:px-4 xl:px-5 py-4 lg:py-5"   // Más espacioso
    };
    
    // Para headers, siempre aplicar layout especial con truncate para evitar desbordamiento
    // Para celdas de datos, solo aplicar si se especifica hasSpecialLayout explícitamente
    const shouldUseSpecialLayout = isHeader || hasSpecialLayout;
    
    // Optimización: construir className una sola vez
    const cellClassName = [
        paddingClasses[paddingSize],
        alignClass,
        finalBorderClass,
        headerClasses,
        width,
        className
    ].filter(Boolean).join(' ');
    
    const cellContent = shouldUseSpecialLayout ? (
        <div className={LAYOUT_STYLES.fullWidthLayout}>
            <span className={TEXT_STYLES.truncate} title={title || (typeof children === 'string' ? children : undefined)}>
                {children}
            </span>
        </div>
    ) : (
        children
    );
    
    return (
        <Tag 
            className={cellClassName}
            title={title}
        >
            {cellContent}
        </Tag>
    );
});

Cell.displayName = 'Cell';

export default Cell;
