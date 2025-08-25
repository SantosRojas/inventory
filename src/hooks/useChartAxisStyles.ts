import { useMemo } from 'react';

export const useChartAxisStyles = (isMobile?: boolean) => {
  return useMemo(() => {
    return {
      xAxisProps: {
        tick: { 
          fontSize: isMobile ? 10 : 12,
          fill: 'var(--color-text-tertiary)'
        },
        axisLine: { 
          stroke: 'var(--color-border)' 
        },
        tickLine: { 
          stroke: 'var(--color-border)' 
        }
      },
      yAxisProps: {
        tick: { 
          fontSize: isMobile ? 10 : 12,
          fill: 'var(--color-text-tertiary)'
        },
        axisLine: { 
          stroke: 'var(--color-border)' 
        },
        tickLine: { 
          stroke: 'var(--color-border)' 
        }
      },
      gridProps: {
        strokeDasharray: "3 3",
        stroke: 'var(--color-border-light)'
      }
    };
  }, [isMobile]);
};

export default useChartAxisStyles;
