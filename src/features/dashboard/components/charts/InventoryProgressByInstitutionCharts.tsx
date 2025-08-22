import React, { useMemo, useCallback} from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type {
  InventoryProgressByInstitutionResponse,
  SummaryResponse,
} from '../../types';
import { useMediaQuery } from 'react-responsive';

interface InventoryProgressByInstitutionChartsProps {
  data: InventoryProgressByInstitutionResponse;
  summaryData: SummaryResponse;
}

interface InstitutionChartData {
  institutionName: string;
  inventariadas: number;
  pendientes: number;
  total: number;
  percentage: number;
}

interface TooltipProps {
  active?: boolean;
  label?: string;
  payload?: {
    payload: InstitutionChartData;
  }[];
}

export const InventoryProgressByInstitutionCharts: React.FC<
    InventoryProgressByInstitutionChartsProps
> = ({ data, summaryData }) => {
  // Hook para detectar el tamaño de pantalla
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });


  const { chartData, overallProgress, totalInstitutions } = useMemo(() => {
    const institutions = data?.institutions ?? [];

    if (institutions.length === 0) {
      return {
        chartData: [],
        overallProgress: 0,
        totalInstitutions: 0,
      };
    }

    const chartData: InstitutionChartData[] = institutions.map((institution) => {
      const total = institution.totalPumps;
      const inventoried = institution.pumpsInventoriedThisYear;
      const pendientes = total - inventoried;
      const percentage = total > 0 ? +(inventoried / total * 100).toFixed(1) : 0;

      return {
        institutionName: institution.institutionName,
        inventariadas: inventoried,
        pendientes,
        total,
        percentage,
      };
    });

    const totalPumps = summaryData?.totalPumps || 0;
    const inventoriedPumps = summaryData?.inventoriedPumpsThisYear || 0;
    const generalProgress =
        totalPumps > 0 ? +(inventoriedPumps / totalPumps * 100).toFixed(1) : 0;

    return {
      chartData,
      overallProgress: generalProgress,
      totalInstitutions: institutions.length,
    };
  }, [data?.institutions, summaryData?.totalPumps, summaryData?.inventoriedPumpsThisYear]);

  const CustomTooltip = useCallback(({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
            <p className="font-semibold text-gray-900 mb-2">{label}</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span>
                Inventariadas:{' '}
                  <span className="font-medium">{data.inventariadas.toLocaleString()}</span>
              </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-sm bg-gray-400" />
                <span>
                Pendientes:{' '}
                  <span className="font-medium">{data.pendientes.toLocaleString()}</span>
              </span>
              </div>
              <div className="border-t pt-1 mt-2">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-medium">{data.total.toLocaleString()}</span> bombas
                </p>
                <p className="text-sm text-green-600">
                  Progreso: <span className="font-medium">{data.percentage}%</span>
                </p>
              </div>
            </div>
          </div>
      );
    }
    return null;
  }, []);

  const formatInstitutionName = useCallback((name: string) => {
    return name.length > 15 ? `${name.substring(0, 12)}...` : name;
  }, []);

  if (!data?.institutions || data.institutions.length === 0) {
    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ No hay datos de progreso de inventario por institución disponibles
          </p>
        </div>
    );
  }

  return (
      <div className="bg-white p-1 sm:p-4 rounded-lg border">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            📋 Progreso de Inventario por Institución
          </h3>
          <p className="text-sm text-gray-600">
            {summaryData?.inventoriedPumpsThisYear?.toLocaleString()} de{' '}
            {summaryData?.totalPumps?.toLocaleString()} bombas inventariadas • {overallProgress}% completado • {totalInstitutions}{' '}
            instituciones
            {totalInstitutions > 15 && (
                <span className="text-orange-600"> • Mostrando primeras 15 instituciones</span>
            )}
          </p>
        </div>

        <div 
          className={isMobile ? "" : "h-96"}
          style={isMobile ? { height: Math.max(400, chartData.length * 60) } : {}}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={chartData}
                layout={isMobile ? "vertical" : undefined}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              {isMobile ? (
                // Configuración para móvil/tablet (barras horizontales)
                <>
                  <XAxis type="number" />
                  <YAxis
                    type="category"
                    dataKey="institutionName"
                    tick={false}
                    width={0}
                    axisLine={false}
                  />
                </>
              ) : (
                // Configuración para desktop (barras verticales)
                <XAxis
                  dataKey="institutionName"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={formatInstitutionName}
                />
              )}
              
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="rect" />
              <Bar
                  dataKey="inventariadas"
                  stackId="progress"
                  fill="#10B981"
                  name="Inventariadas 2025"
                  radius={isMobile ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              />
              <Bar
                  dataKey="pendientes"
                  stackId="progress"
                  fill="#9CA3AF"
                  name="Pendientes"
                  radius={[0, 0, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-gray-700">Progreso General del Sistema</h4>
            <span className="text-sm font-medium text-green-600">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{summaryData?.inventoriedPumpsThisYear?.toLocaleString()} inventariadas</span>
            <span>{summaryData?.totalPumps?.toLocaleString()} total</span>
          </div>
        </div>
      </div>
  );
};

export default InventoryProgressByInstitutionCharts;
