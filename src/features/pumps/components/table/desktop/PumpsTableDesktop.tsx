import { memo } from 'react';
import type { Pump } from '../../../../../types';
import PumpsTableHeader from './PumpsTableHeader';
import PumpsTableRow from './PumpsTableRow';

interface PumpsTableDesktopProps {
    pumpData: Pump[];
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

// Constantes para estilos de la tabla desktop
const TABLE_STYLES = {
    container: "hidden lg:block",
    wrapper: "overflow-x-auto overflow-y-visible",
    table: "w-full table-fixed divide-y divide-gray-200 min-w-[1000px]",
    tbody: "bg-white divide-y divide-gray-100"
} as const;

const PumpsTableDesktop = memo(({
    pumpData,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete
}: PumpsTableDesktopProps) => {
    return (
        <div className={TABLE_STYLES.container}>
            <div className={TABLE_STYLES.wrapper}>
                <table className={TABLE_STYLES.table}>
                    <PumpsTableHeader />
                    <tbody className={TABLE_STYLES.tbody}>
                        {pumpData.map((item, index) => (
                            <PumpsTableRow
                                key={item.id}
                                item={item}
                                index={index}
                                formatDate={formatDate}
                                getStatusColor={getStatusColor}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

PumpsTableDesktop.displayName = 'PumpsTableDesktop';

export default PumpsTableDesktop;
