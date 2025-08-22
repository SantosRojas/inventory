import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import type { OverdueMaintenanceResponse } from '../../types';
import { generateColor } from '../../../../utils';
import { useMediaQuery } from 'react-responsive';
import CustomizedLabelPie from '../CustomizedLabelPie';

interface Props {
    data?: OverdueMaintenanceResponse;
}

interface ChartItem {
    name: string;
    value: number;
}

const OverdueMaintenanceChart = ({ data }: Props) => {
    const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
    const { chartData, error, total } = useMemo(() => {
        const institutions = data?.institutions ?? [];

        const chartData = institutions.map<ChartItem>((i) => ({
            name: i.institutionName,
            value: i.overdueMaintenanceCount,
        }));

        if (chartData.length === 0) {
            return {
                chartData: null,
                total: 0,
                error: 'No hay datos de mantenimiento vencido disponibles.',
            };
        }

        const total = chartData.reduce((sum, item) => sum + item.value, 0);
        return { chartData, total, error: null };
    }, [data]);

    

    const CustomTooltip = ({
                               active,
                               payload,
                           }: {
        active?: boolean;
        payload?: { payload: ChartItem }[];
    }) => {
        if (active && payload?.length) {
            const { name, value } = payload[0].payload;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-sm text-gray-800">
                    <p className="font-semibold">{name}</p>
                    <p>
                        Cantidad:{' '}
                        <span className="font-medium text-red-500">
              {value.toLocaleString()}
            </span>
                    </p>
                    <p className="text-gray-600">
                        <span className="font-medium">{percentage}%</span> del total
                    </p>
                </div>
            );
        }
        return null;
    };

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div className="bg-white p-2 sm:p-4 lg:p-6 rounded-lg border space-y-3 sm:space-y-4 overflow-hidden">
            {/* Header */}
            <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                    🔧 Mantenimiento Vencido por Institución
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                    Distribución de {total.toLocaleString()} bombas con mantenimiento vencido
                </p>
            </div>

            {/* Pie Chart */}
           <div className={isMobile ? "h-80 w-full" : 'h-96'}>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                    <Pie
                        data={chartData ?? []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={isMobile ? 70 : 90}
                        innerRadius={isMobile ? 35 : 45}
                        labelLine={isMobile}
                        label={!isMobile ? CustomizedLabelPie : true}
                    >
                        {chartData?.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={generateColor(index)}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {!isMobile && (
                        <Legend verticalAlign='middle' align='right' layout='vertical' />
                    )}
                    {/* {isMobile && (
                        <Legend 
                            verticalAlign='bottom' 
                            align='center' 
                            layout='horizontal'
                            wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                        />
                    )} */}
                </PieChart>
            </ResponsiveContainer>
           </div>
        </div>
    );
};

export default OverdueMaintenanceChart;
