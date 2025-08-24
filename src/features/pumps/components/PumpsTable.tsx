import { memo } from 'react';
import type { Pump } from '../../../types';
import { PumpsTableDesktop, PumpsTableMobile, LoadingState, EmptyTableState, usePumpsTable, ErrorSearchPump } from './table';

interface PumpsTableProps {
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const PumpsTable = memo(({
    onEdit,
    onDelete,
}: PumpsTableProps) => {
    const { pumpData, isLoading, error, formatDate, getStatusColor } = usePumpsTable();

    const defaultIcon = (
        <svg
            className="mx-auto h-14 w-14 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7"
            />
        </svg>
    );


    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorSearchPump />;
    }

    if (!pumpData || (pumpData.length === 0)) {
        return <EmptyTableState icon={defaultIcon} />;
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