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
  const [isMobile, setIsMobile] = useState(false);

  // Hook para detectar el tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // 768px = tablet breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatName = useCallback((name: string) => {
    return name.length > 15 ? name.slice(0, 12) + '...' : name;
  }, []);

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
      <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-lg border space-y-3 sm:space-y-4 overflow-hidden">
        {/* Título */}
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">🧍‍♂️ Top Inventariadores del Año</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
            Cantidad de equipos registrados por persona en lo que va del año
          </p>
        </div>

        {/* Gráfico */}
        <div 
          className={isMobile ? "" : "h-96"}
          style={isMobile ? { height: Math.max(400, (chartData?.length || 0) * 60) } : {}}
        >
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
              data={chartData ?? []}
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
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  width={100}
                  tickFormatter={formatName}
                />
              </>
            ) : (
              // Configuración para desktop (barras verticales)
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}  
                angle={-45} 
                textAnchor='end'
                height={80}
                tickFormatter={formatName}
              />
            )}
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="value" name="Equipos Inventariados" fill="#36A2EB" radius={isMobile ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>
  );
};

export default TopInventoryTakersChart;
