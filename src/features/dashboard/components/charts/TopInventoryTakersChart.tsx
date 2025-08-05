import { useEffect, useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { TopInventoryTakersResponse } from '../../types';
import { useAuth } from '../../../auth/hooks';

interface Props {
  data?: TopInventoryTakersResponse;
}

interface ChartItem {
  name: string;
  value: number;
}

const TopInventoryTakersChart = ({ data }: Props) => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ChartItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setChartData(null);
      setError('Inicia sesión para ver los datos.');
      return;
    }

    if (!data?.topInventoryTakers || data.topInventoryTakers.length === 0) {
      setChartData(null);
      setError('No hay datos de inventariadores disponibles.');
      return;
    }

    const formatted = data.topInventoryTakers.map((item) => ({
      name: item.inventoryTakerName,
      value: item.pumpsInventoriedThisYear,
    }));

    setChartData(formatted);
    setError(null);
  }, [user, data]);

  const CustomTooltip = useCallback(({ active, payload }: {
    active?: boolean;
    payload?: { payload: ChartItem }[];
  }) => {
    if (active && payload?.length) {
      const { name, value } = payload[0].payload;

      return (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-sm text-gray-800">
            <p className="font-semibold">{name}</p>
            <p>
              Equipos inventariados:{' '}
              <span className="font-medium text-blue-600">{value.toLocaleString()}</span>
            </p>
          </div>
      );
    }
    return null;
  }, []);

  if (error) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
          ⚠️ {error}
        </div>
    );
  }

  return (
      <div className="bg-white p-6 rounded-lg border space-y-4">
        {/* Título */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🧍‍♂️ Top Inventariadores del Año</h3>
          <p className="text-sm text-gray-600 mt-1">
            Cantidad de equipos registrados por persona en lo que va del año
          </p>
        </div>

        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
              data={chartData ?? []}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 12 }} />
            <Bar dataKey="value" name="Equipos Inventariados" fill="#36A2EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
  );
};

export default TopInventoryTakersChart;
