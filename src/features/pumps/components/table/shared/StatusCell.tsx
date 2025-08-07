import { memo } from 'react';
import Cell from './Cell';
import { BADGE_STYLES, TEXT_STYLES } from './styles';

interface StatusCellProps {
    status: string;
    getStatusColor: (status: string) => string;
    hasBorder?: boolean;
    paddingSize?: 'compact' | 'normal' | 'comfortable';
}

const StatusCell = memo(({
    status,
    getStatusColor,
    hasBorder = true,
    paddingSize = 'normal'
}: StatusCellProps) => {
    return (
        <Cell title={status} hasBorder={hasBorder} paddingSize={paddingSize}>
            <span className={`${BADGE_STYLES.base} ${getStatusColor(status)}`}>
                <span className={`${TEXT_STYLES.truncate} max-w-[60px] lg:max-w-none overflow-hidden`}>
                    {status}
                </span>
            </span>
        </Cell>
    );
});

StatusCell.displayName = 'StatusCell';

export default StatusCell;
