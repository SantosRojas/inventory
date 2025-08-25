import { useMemo, useState, useCallback } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from 'lucide-react';
import type { OverdueMaintenanceResponse } from '../../types';
import { useMediaQuery } from 'react-responsive';

interface Props {
    data?: OverdueMaintenanceResponse;
}

interface ChartItem {
    name: string;
    value: number;
}

const OverdueMaintenanceChart = ({ data }: Props) => {
    const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
    
    // Estados para la paginación y filtros
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'name' | 'value'>('value');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    const ITEMS_PER_PAGE = isMobile ? 4 : 15;

    const { paginatedData, totalInstitutions, totalPages, filteredCount, total, error } = useMemo(() => {
        const institutions = data?.institutions ?? [];

        if (institutions.length === 0) {
            return {
                paginatedData: [],
                totalInstitutions: 0,
                totalPages: 0,
                filteredCount: 0,
                total: 0,
                error: 'No hay datos de mantenimiento vencido disponibles.',
            };
        }

        // Crear datos del gráfico
        const chartData: ChartItem[] = institutions.map((i) => ({
            name: i.institutionName,
            value: i.overdueMaintenanceCount,
        }));

        // Filtrar por búsqueda
        const filteredData = chartData.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Ordenar datos
        const sortedData = [...filteredData].sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'value':
                    comparison = a.value - b.value;
                    break;
            }
            
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        // Calcular paginación
        const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
        const startIndex = currentPage * ITEMS_PER_PAGE;
        const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

        const total = chartData.reduce((sum, item) => sum + item.value, 0);

        return {
            paginatedData,
            totalInstitutions: institutions.length,
            totalPages,
            filteredCount: filteredData.length,
            total,
            error: null,
        };
    }, [data?.institutions, currentPage, searchTerm, sortBy, sortOrder, ITEMS_PER_PAGE]);

    // Funciones de control
    const handleSortChange = useCallback((newSortBy: typeof sortBy) => {
        if (newSortBy === sortBy) {
            setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('desc');
        }
        setCurrentPage(0);
    }, [sortBy]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setCurrentPage(0);
    }, []);

    const formatInstitutionName = useCallback((name: string) => {
        if (isMobile) {
            return name.length > 12 ? `${name.substring(0, 9)}...` : name;
        }
        return name.length > 15 ? `${name.substring(0, 12)}...` : name;
    }, [isMobile]);

    const CustomTooltip = useCallback(({
        active,
        payload,
        label,
    }: {
        active?: boolean;
        payload?: { payload: ChartItem }[];
        label?: string;
    }) => {
        if (active && payload?.length) {
            const { value } = payload[0].payload;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-3 text-sm text-gray-800">
                    <p className="font-semibold">{label}</p>
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
    }, [total]);

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                ⚠️ {error}
            </div>
        );
    }

    return (
        <div className="bg-white p-1 sm:p-4 rounded-lg border">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    🔧 Mantenimiento Vencido por Institución
                </h3>
                <p className="text-sm text-gray-600">
                    {total.toLocaleString()} bombas con mantenimiento vencido en {totalInstitutions} instituciones
                </p>
            </div>

            {/* Controles de filtrado y búsqueda */}
            <div className="mb-4 space-y-3">
                {/* Búsqueda */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="text"
                        placeholder="Buscar institución..."
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                </div>

                {/* Controles de ordenamiento */}
                <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    <div className="flex gap-2 flex-1">
                        <button
                            onClick={() => handleSortChange('value')}
                            className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors ${
                                sortBy === 'value' 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            {sortBy === 'value' && (sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />)}
                            Cantidad
                        </button>
                        <button
                            onClick={() => handleSortChange('name')}
                            className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors ${
                                sortBy === 'name' 
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            }`}
                        >
                            {sortBy === 'name' && (sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />)}
                            {isMobile ? 'A-Z' : 'Nombre'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Información de resultados */}
            {searchTerm && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        Mostrando {filteredCount} de {totalInstitutions} instituciones que coinciden con "{searchTerm}"
                    </p>
                </div>
            )}

            {/* Gráfico de Barras */}
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={paginatedData}
                        margin={{ top: 5, right: 5, left: 5, bottom: isMobile ? 60 : 80 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: isMobile ? 10 : 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={isMobile ? 60 : 80}
                            tickFormatter={formatInstitutionName}
                        />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                            dataKey="value" 
                            name="Mantenimiento Vencido" 
                            fill="#EF4444" 
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Leyenda personalizada */}
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                        <span className="text-xs text-gray-700">Mantenimiento Vencido</span>
                    </div>
                </div>
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
                <div className={`mt-4 space-y-3 ${isMobile ? '' : 'flex items-center justify-between'}`}>
                    <div className="text-sm text-gray-600 text-center">
                        Página {currentPage + 1} de {totalPages} • {paginatedData.length} de {filteredCount} instituciones
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isMobile ? 'w-10 h-10' : ''
                            }`}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        
                        {/* Números de página - más compacto en móvil */}
                        <div className="flex gap-1">
                            {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, index) => {
                                let pageNumber;
                                const maxPages = isMobile ? 3 : 5;
                                
                                if (totalPages <= maxPages) {
                                    pageNumber = index;
                                } else if (currentPage < Math.floor(maxPages / 2)) {
                                    pageNumber = index;
                                } else if (currentPage >= totalPages - Math.floor(maxPages / 2)) {
                                    pageNumber = totalPages - maxPages + index;
                                } else {
                                    pageNumber = currentPage - Math.floor(maxPages / 2) + index;
                                }
                                
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} rounded-lg text-sm transition-colors ${
                                            pageNumber === currentPage
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {pageNumber + 1}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages - 1}
                            className={`p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                                isMobile ? 'w-10 h-10' : ''
                            }`}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OverdueMaintenanceChart;
