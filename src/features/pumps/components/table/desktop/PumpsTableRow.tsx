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
    base: "hover:bg-blue-50 transition-colors duration-150",
    even: "bg-white",
    odd: "bg-gray-50"
} as const;

const PumpsTableRow = memo(({
    item,
    index,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete
}: PumpsTableRowProps) => {
    const rowBackgroundClass = index % 2 === 0 ? ROW_STYLES.even : ROW_STYLES.odd;
    
    return (
        <tr className={`${ROW_STYLES.base} ${rowBackgroundClass}`}>
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
