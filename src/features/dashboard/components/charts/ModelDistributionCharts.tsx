import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ModelDistributionResponse, SummaryResponse } from '../../types';
import { useMediaQuery } from 'react-responsive';
import CustomizedLabelPie from '../CustomizedLabelPie';


interface ModelDistributionChartsProps {
  data: ModelDistributionResponse;
  summaryData: SummaryResponse;
}

// Colores para los gráficos
const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // green-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
  '#EC4899', // pink-500
  '#84CC16', // lime-500
  '#6366F1', // indigo-500
  '#F59E0B', // yellow-500
];

export const ModelDistributionCharts: React.FC<ModelDistributionChartsProps> = ({ data, summaryData }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  if (!data?.models || data.models.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ No hay datos de distribución por modelo disponibles</p>
      </div>
    );
  }

  // Preparar datos con colores
  const chartData = data.models.map((model, index) => ({
    ...model,
    color: COLORS[index % COLORS.length]
  }));

  // Usar datos directos del summary en lugar de calcular - MÁS EFICIENTE
  const total = summaryData?.totalPumps || 0;


  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{ payload: { modelName: string; count: number } }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.count / total) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.modelName}</p>
          <p className="text-blue-600">
            <span className="font-medium">{data.count.toLocaleString()}</span> bombas
          </p>
          <p className="text-gray-600 text-sm">{percentage}% del total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-lg border space-y-3 sm:space-y-4 overflow-hidden">
      {/* Header */}
      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">📊 Distribución por Modelo</h3>
        <p className="text-xs sm:text-sm text-gray-600 break-words">{total.toLocaleString()} bombas en {data.models.length} modelos</p>
      </div>

      <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-center'} gap-4 sm:gap-6`}>
        {/* Gráfico Circular */}
        <div className={isMobile ? "h-80 w-full" : "h-96 flex-shrink-0"} style={{ width: isMobile ? '100%' : '400px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
              <Pie
                data={chartData ?? []}
                cx="50%"
                cy="50%"
                labelLine={isMobile}
                label={!isMobile ? CustomizedLabelPie : true}
                outerRadius={isMobile ? 70 : 90}
                innerRadius={isMobile ? 35 : 45}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda responsiva */}
        {
          !isMobile && (

            <div className={`${isMobile ? 'grid grid-cols-1 sm:grid-cols-2' : 'flex flex-col justify-center max-w-sm'} gap-2 ${isMobile ? 'w-full' : 'flex-1'}`}>
              {data.models.map((model, index) => {
                const percentage = ((model.count / total) * 100).toFixed(1);
                const color = COLORS[index % COLORS.length];
                return (
                  <div key={model.modelName} className="flex items-center gap-2 text-xs sm:text-sm min-w-0 p-2 bg-gray-50 rounded-md">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">{model.modelName}</div>
                      <div className="text-gray-600 text-xs">
                        <span className="font-medium">{model.count.toLocaleString()}</span> bombas ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ModelDistributionCharts;
