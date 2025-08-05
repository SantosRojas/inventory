import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { ModelDistributionResponse, SummaryResponse } from '../../types';
import {CustomizedLabelPie} from "./summary/components";


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
    <div className="bg-white p-6 rounded-lg border">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">📊 Distribución por Modelo</h3>
        <p className="text-sm text-gray-600">{total.toLocaleString()} bombas en {data.models.length} modelos</p>
      </div>

      {/* Gráfico Circular */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomizedLabelPie}
              outerRadius={100}
              innerRadius={50}
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

      {/* Leyenda simple debajo del gráfico */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {data.models.map((model, index) => {
          const percentage = ((model.count / total) * 100).toFixed(1);
          const color = COLORS[index % COLORS.length];
          return (
            <div key={model.modelName} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-gray-700 truncate">
                {model.modelName}: <span className="font-medium">{model.count.toLocaleString()}</span> ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelDistributionCharts;
