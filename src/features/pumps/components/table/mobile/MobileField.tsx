import { memo } from 'react';
import { TEXT_STYLES } from '../shared/styles';

interface MobileFieldProps {
    label: string;
    value: string | React.ReactNode;
    isMonospace?: boolean;
}

const MobileField = memo(({ 
    label, 
    value, 
    isMonospace = false 
}: MobileFieldProps) => {
    const valueClass = isMonospace ? TEXT_STYLES.fontMono : "";
    
    return (
        <div className="mb-2">
            <p className={`${TEXT_STYLES.textXs} ${TEXT_STYLES.fontMedium} ${TEXT_STYLES.textGray500} uppercase tracking-wide`}>
                {label}
            </p>
            <div className={`${TEXT_STYLES.textSm} ${TEXT_STYLES.textGray900} ${valueClass}`}>
                {value}
            </div>
        </div>
    );
});

MobileField.displayName = 'MobileField';

export default MobileField;