import { memo } from 'react';
import type { Pump } from '../../../types';
import { PumpsTableDesktop, PumpsTableMobile, LoadingState, EmptyTableState, usePumpsTable } from './table';

interface PumpsTableProps {
    onEdit:  (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const PumpsTable = memo(({
    onEdit,
    onDelete,
}: PumpsTableProps) => {
    const { pumpData, isLoading, formatDate, getStatusColor } = usePumpsTable();

    if(isLoading) {
        return <LoadingState />;
    }

    if(!pumpData || pumpData.length === 0) {
        return <EmptyTableState />;
    }

    return (
        <div className="w-full mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <PumpsTableDesktop
                    pumpData={pumpData}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
                
                <PumpsTableMobile
                    pumpData={pumpData}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>
        </div>
    );
});

PumpsTable.displayName = 'PumpsTable';

export default PumpsTable;