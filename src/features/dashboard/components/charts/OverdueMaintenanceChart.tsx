import { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import type { OverdueMaintenanceResponse } from '../../types';
import {CustomizedLabelPie} from "./summary/components";

const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#00C49F', '#FF8042', '#A28FD0', '#F67280',
];

interface Props {
    data?: OverdueMaintenanceResponse;
}

interface ChartItem {
    name: string;
    value: number;
}

const OverdueMaintenanceChart = ({ data }: Props) => {
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
            return (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-sm text-gray-800">
                    <p className="font-semibold">{name}</p>
                    <p>
                        Bombas con mantenimiento vencido:{' '}
                        <span className="font-medium text-red-500">
              {value.toLocaleString()}
            </span>
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
        <div className="bg-white p-6 rounded-lg border space-y-4">
            {/* Header */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900">
                    🔧 Mantenimiento Vencido por Institución
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Distribución de {total.toLocaleString()} bombas con mantenimiento vencido
                </p>
            </div>

            {/* Pie Chart */}
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={chartData ?? []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        labelLine={false}
                        label={CustomizedLabelPie}
                    >
                        {chartData?.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default OverdueMaintenanceChart;
