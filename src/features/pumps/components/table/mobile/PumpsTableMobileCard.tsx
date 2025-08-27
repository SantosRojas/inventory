import { memo } from 'react';
import type { Pump } from '../../../../../types';
import MobileField from './MobileField';
import MobileActions from './MobileActions';
import { MOBILE_FIELDS } from '../shared/tableConfig';

interface PumpsTableMobileCardProps {
    item: Pump;
    formatDate: (dateString: string) => string;
    getStatusColor: (status: string) => string;
    onEdit: (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const PumpsTableMobileCard = memo(({
    item,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete
}: PumpsTableMobileCardProps) => {
    // Función helper para obtener el valor del campo
    const getFieldValue = (fieldKey: string) => {
        switch (fieldKey) {
            case 'manufactureDate':
                return formatDate(item.manufactureDate || "");
            case 'inventoryDate':
                return formatDate(item.inventoryDate);
            case 'lastMaintenanceDate':
                return formatDate(item.lastMaintenanceDate || "");
            default:
                return item[fieldKey as keyof Pump] as string;
        }
    };

    return (
        <div 
            className="p-4 transition-colors duration-150 cursor-pointer"
            style={{
                backgroundColor: 'var(--color-bg-card)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-card)';
            }}
        >
            {/* Header section */}
            <div className="flex flex-col gap-2 sm:flex-row justify-between items-start mb-3">
                <div>
                    <h3 
                        className="text-lg font-semibold" 
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {item.model}
                    </h3>
                    <p 
                        className="text-sm" 
                        style={{ color: 'var(--color-text-secondary)' }}
                    >
                        S/N: <span className="font-mono">{item.serialNumber}</span>
                    </p>
                </div>
                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status}
                </span>
            </div>

            {/* Fields grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {MOBILE_FIELDS.map((field) => (
                    <MobileField
                        key={String(field.key)}
                        label={field.label}
                        value={getFieldValue(String(field.key))}
                        isMonospace={field.isMono}
                    />
                ))}
            </div>

            {/* Actions */}
            <MobileActions
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
});

PumpsTableMobileCard.displayName = 'PumpsTableMobileCard';

export default PumpsTableMobileCard;
