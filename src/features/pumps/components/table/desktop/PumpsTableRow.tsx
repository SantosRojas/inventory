import { memo } from 'react';
import type { Pump } from '../../../../../types';
import SmartCell from '../shared/SmartCell';
import { TABLE_COLUMNS } from '../shared/tableConfig';

interface PumpsTableRowProps {
    item: Pump;
    index: number;
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

// Constantes para estilos de filas
const ROW_STYLES = {
    base: "transition-colors duration-150",
} as const;

const PumpsTableRow = memo(({
    item,
    index,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete
}: PumpsTableRowProps) => {
    const isEven = index % 2 === 0;
    
    return (
        <tr 
            className={ROW_STYLES.base}
            style={{
                backgroundColor: isEven ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
            }}
            onMouseLeave={(e) => {
                const isEven = index % 2 === 0;
                e.currentTarget.style.backgroundColor = isEven ? 'var(--color-bg-primary)' : 'var(--color-bg-secondary)';
            }}
        >
            {TABLE_COLUMNS.map((column) => (
                <SmartCell
                    key={column.key}
                    columnKey={column.key}
                    item={item}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    paddingSize="compact"
                />
            ))}
        </tr>
    );
});

PumpsTableRow.displayName = 'PumpsTableRow';

export default PumpsTableRow;
