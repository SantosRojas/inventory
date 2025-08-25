import type { ReactNode } from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  children?: ReactNode;
}

const ChartTooltip = ({ active, children }: ChartTooltipProps) => {
  if (!active || !children) {
    return null;
  }

  return (
    <div 
      className="p-3 rounded-lg shadow-lg border"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      {children}
    </div>
  );
};

interface TooltipTitleProps {
  children: ReactNode;
}

export const TooltipTitle = ({ children }: TooltipTitleProps) => (
  <p 
    className="font-semibold mb-2"
    style={{ color: 'var(--color-text-primary)' }}
  >
    {children}
  </p>
);

interface TooltipValueProps {
  color?: string;
  label: string;
  value: string | number;
  showDot?: boolean;
}

export const TooltipValue = ({ color, label, value, showDot = false }: TooltipValueProps) => (
  <div className="flex items-center gap-2 text-sm">
    {showDot && color && (
      <div 
        className="w-3 h-3 rounded-sm" 
        style={{ backgroundColor: color }}
      />
    )}
    <span style={{ color: 'var(--color-text-secondary)' }}>
      {label}: <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>{value}</span>
    </span>
  </div>
);

interface TooltipPercentageProps {
  percentage: string | number;
}

export const TooltipPercentage = ({ percentage }: TooltipPercentageProps) => (
  <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
    {percentage}% del total
  </p>
);

interface TooltipSeparatorProps {}

export const TooltipSeparator = ({}: TooltipSeparatorProps) => (
  <div 
    className="pt-1 mt-2" 
    style={{ borderTop: '1px solid var(--color-border)' }}
  />
);

export default ChartTooltip;
