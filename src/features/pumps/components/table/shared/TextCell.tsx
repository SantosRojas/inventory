import { memo } from 'react';
import Cell from './Cell';

interface TextCellProps {
    value: string;
    className?: string;
    hasBorder?: boolean;
    fontWeight?: 'normal' | 'medium' | 'semibold';
    textColor?: 'gray-900' | 'gray-600';
    paddingSize?: 'compact' | 'normal' | 'comfortable';
}

const TextCell = memo(({
    value,
    className = "",
    hasBorder = true,
    fontWeight = 'normal',
    textColor = 'gray-900',
    paddingSize = 'normal'
}: TextCellProps) => {
    const fontClass = {
        'normal': 'font-normal',
        'medium': 'font-medium',
        'semibold': 'font-semibold'
    }[fontWeight];

    const colorClass = `text-${textColor}`;
    
    return (
        <Cell 
            title={value} 
            hasBorder={hasBorder}
            className={className}
            hasSpecialLayout={true}
            paddingSize={paddingSize}
        >
            <span className={`text-xs lg:text-sm ${fontClass} ${colorClass}`}>
                {value}
            </span>
        </Cell>
    );
});

TextCell.displayName = 'TextCell';

export default TextCell;
