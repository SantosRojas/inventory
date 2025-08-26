import { memo } from 'react';

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
    const valueClass = isMonospace ? "font-mono" : "";
    
    return (
        <div className="mb-2">
            <p 
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: 'var(--color-text-muted)' }}
            >
                {label}
            </p>
            <div 
                className={`text-sm ${valueClass}`}
                style={{ color: 'var(--color-text-primary)' }}
            >
                {value}
            </div>
        </div>
    );
});

MobileField.displayName = 'MobileField';

export default MobileField;