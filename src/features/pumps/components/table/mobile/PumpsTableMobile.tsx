import { memo } from 'react';
import type { Pump } from '../../../../../types';
import PumpsTableMobileCard from './PumpsTableMobileCard';

interface PumpsTableMobileProps {
    pumpData: Pump[];
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const PumpsTableMobile = memo(({
    pumpData,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete
}: PumpsTableMobileProps) => {
    return (
        <div className="lg:hidden divide-y divide-gray-200">
            {pumpData.map((item) => (
                <PumpsTableMobileCard
                    key={item.id}
                    item={item}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
});

PumpsTableMobile.displayName = 'PumpsTableMobile';

export default PumpsTableMobile;
