import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import React, { useCallback } from 'react';

interface ModelDistributionByInstitutionResponse {
  totalPumps: number;
  models: string[];
  data: Array<{
    institutionName: string;
    total: number;
    [modelName: string]: number | string;
  }>;
}

interface ModelDistributionByInstitutionChartsProps {
  data: ModelDistributionByInstitutionResponse;
}

const MODEL_COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#06B6D4', '#F97316', '#EC4899', '#84CC16', '#6366F1'
];

export const ModelDistributionByInstitutionCharts: React.FC<ModelDistributionByInstitutionChartsProps> = ({ data }) => {
  const totalInstitutions = data?.data?.length || 0;
  const totalBombas = data?.totalPumps || 0;
  const models = data?.models || [];
  const chartData = data?.data?.slice(0, 15);

  const CustomTooltip = useCallback(({ active, payload, label }:{
    active?: boolean;
    payload?: Array<{ value: number; dataKey: string; color: string }>;
    label?: string;
  }) => {
    if (!active || !payload?.length) return null;

    const total = payload.reduce((sum: number, entry) => sum + entry.value, 0);

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <p className="text-sm text-gray-600 mb-2">
            Total: <span className="font-medium">{total.toLocaleString()}</span> bombas
          </p>
          {payload.map((entry, index: number) => (
              entry.value > 0 && (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
                    <span>{entry.dataKey}: <span className="font-medium">{entry.value.toLocaleString()}</span></span>
                  </div>
              )
          ))}
        </div>
    );
  }, []);

  const formatInstitutionName = useCallback((name: string) => {
    return name.length > 15 ? name.slice(0, 12) + '...' : name;
  }, []);

  if (!chartData?.length) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">⚠️ No hay datos de distribución por institución disponibles.</p>
        </div>
    );
  }

  return (
      <div className="bg-white p-6 rounded-lg border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">🏥 Distribución de Modelos por Institución</h3>
          <p className="text-sm text-gray-600">
            {totalBombas.toLocaleString()} bombas en {totalInstitutions} instituciones • {models.length} modelos diferentes
            {totalInstitutions > 15 && <span className="text-orange-600"> • Mostrando primeras 15 instituciones</span>}
          </p>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                  dataKey="institutionName"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={formatInstitutionName}
              />
              <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Cantidad de Bombas', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
              {models.map((modelName, index) => (
                  <Bar
                      key={modelName}
                      dataKey={modelName}
                      stackId="models"
                      fill={MODEL_COLORS[index % MODEL_COLORS.length]}
                      name={modelName}
                  />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
  );
};

export default ModelDistributionByInstitutionCharts;
