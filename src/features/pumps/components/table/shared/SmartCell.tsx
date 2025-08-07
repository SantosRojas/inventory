import { memo } from 'react';
import type { Pump } from '../../../../../types';
import TextCell from './TextCell';
import StatusCell from './StatusCell';
import ActionsCell from './ActionsCell';
import { CELL_CONFIG_MAP } from './cellConfig';

interface SmartCellProps {
    columnKey: string;
    item: Pump;
    formatDate?: (dateString: string) => string;
    getStatusColor?: (status: string) => string;
    onEdit?: (pump: Pump) => void;
    onDelete?: (pump: Pump) => void;
    paddingSize?: 'compact' | 'normal' | 'comfortable';
}

const SmartCell = memo(({
    columnKey,
    item,
    formatDate,
    getStatusColor,
    onEdit,
    onDelete,
    paddingSize = 'normal'
}: SmartCellProps) => {
    const config = CELL_CONFIG_MAP[columnKey];
    
    if (!config) {
        return <TextCell value="" />;
    }

    const value = config.getValue?.(item, formatDate) || '';

    switch (config.type) {
        case 'text':
            return (
                <TextCell 
                    value={value}
                    fontWeight={config.textProps?.fontWeight}
                    textColor={config.textProps?.textColor}
                    paddingSize={paddingSize}
                />
            );
            
        case 'status':
            return (
                <StatusCell 
                    status={value}
                    getStatusColor={getStatusColor!}
                    paddingSize={paddingSize}
                />
            );
            
        case 'actions':
            return (
                <ActionsCell 
                    item={item}
                    onEdit={onEdit!}
                    onDelete={onDelete!}
                    paddingSize={paddingSize}
                />
            );
            
        default:
            return <TextCell value="" paddingSize={paddingSize} />;
    }
});

SmartCell.displayName = 'SmartCell';

export default SmartCell;
