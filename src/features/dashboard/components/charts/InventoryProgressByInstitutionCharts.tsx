import React, { useMemo, useCallback, useState} from 'react';
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
import type {
  InventoryProgressByInstitutionResponse,
  SummaryResponse,
} from '../../types';
import { useMediaQuery } from 'react-responsive';
import { ChartTooltip, TooltipTitle, TooltipValue, TooltipSeparator } from '../../../../components';
import { useChartAxisStyles } from '../../../../hooks';
import { formatTickName } from '../../utils';

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
  const { xAxisProps, yAxisProps, gridProps } = useChartAxisStyles(isMobile);
  
  // Estados para la paginación y filtros
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'percentage' | 'total'>('percentage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const ITEMS_PER_PAGE = isMobile ? 4 : 15;


  const { paginatedData, overallProgress, totalInstitutions, totalPages, filteredCount } = useMemo(() => {
    const institutions = data?.institutions ?? [];

    if (institutions.length === 0) {
      return {
        paginatedData: [],
        overallProgress: 0,
        totalInstitutions: 0,
        totalPages: 0,
        filteredCount: 0,
      };
    }

    // Crear datos del gráfico
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

    // Filtrar por búsqueda
    const filteredData = chartData.filter(item =>
      item.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar datos
    const sortedData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.institutionName.localeCompare(b.institutionName);
          break;
        case 'percentage':
          comparison = a.percentage - b.percentage;
          break;
        case 'total':
          comparison = a.total - b.total;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Calcular paginación
    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedData = sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    // Progreso general
    const totalPumps = summaryData?.totalPumps || 0;
    const inventoriedPumps = summaryData?.inventoriedPumpsThisYear || 0;
    const generalProgress =
        totalPumps > 0 ? +(inventoriedPumps / totalPumps * 100).toFixed(1) : 0;

    return {
      paginatedData,
      overallProgress: generalProgress,
      totalInstitutions: institutions.length,
      totalPages,
      filteredCount: filteredData.length,
    };
  }, [data?.institutions, summaryData?.totalPumps, summaryData?.inventoriedPumpsThisYear, currentPage, searchTerm, sortBy, sortOrder, ITEMS_PER_PAGE]);

  // Resetear página cuando cambie el tamaño de pantalla
  React.useEffect(() => {
    setCurrentPage(0);
  }, [isMobile]);

  // Funciones de control
  const handleSortChange = useCallback((newSortBy: typeof sortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(0); // Resetear a primera página
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Resetear a primera página
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
          <ChartTooltip active={active}>
            <TooltipTitle>{label}</TooltipTitle>
            <div className="space-y-1">
              <TooltipValue 
                color="#10B981" 
                showDot 
                label="Inventariadas" 
                value={data.inventariadas.toLocaleString()} 
              />
              <TooltipValue 
                color="#6B7280" 
                showDot 
                label="Pendientes" 
                value={data.pendientes.toLocaleString()} 
              />
              <TooltipSeparator />
              <TooltipValue 
                label="Total" 
                value={`${data.total.toLocaleString()} bombas`} 
              />
              <TooltipValue 
                label="Progreso" 
                value={`${data.percentage}%`} 
              />
            </div>
          </ChartTooltip>
      );
    }
    return null;
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
          </p>
        </div>

        {/* Controles de filtrado y búsqueda */}
        <div className="mb-4 space-y-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              placeholder="Buscar institución..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              style={{
                backgroundColor: 'var(--color-bg-primary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)'
              }}
            />
          </div>

          {/* Controles de ordenamiento */}
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <div className="flex gap-2 flex-1">
              <button
                onClick={() => handleSortChange('percentage')}
                className="flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors border"
                style={{
                  backgroundColor: sortBy === 'percentage' ? 'var(--color-info-light)' : 'var(--color-bg-secondary)',
                  color: sortBy === 'percentage' ? 'var(--color-info)' : 'var(--color-text-secondary)',
                  borderColor: sortBy === 'percentage' ? 'var(--color-info)' : 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  if (sortBy !== 'percentage') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== 'percentage') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }
                }}
              >
                {sortBy === 'percentage' && (sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />)}
                % Progreso
              </button>
              <button
                onClick={() => handleSortChange('total')}
                className="flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors border"
                style={{
                  backgroundColor: sortBy === 'total' ? 'var(--color-info-light)' : 'var(--color-bg-secondary)',
                  color: sortBy === 'total' ? 'var(--color-info)' : 'var(--color-text-secondary)',
                  borderColor: sortBy === 'total' ? 'var(--color-info)' : 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  if (sortBy !== 'total') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== 'total') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }
                }}
              >
                {sortBy === 'total' && (sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />)}
                Total
              </button>
              <button
                onClick={() => handleSortChange('name')}
                className="flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors border"
                style={{
                  backgroundColor: sortBy === 'name' ? 'var(--color-info-light)' : 'var(--color-bg-secondary)',
                  color: sortBy === 'name' ? 'var(--color-info)' : 'var(--color-text-secondary)',
                  borderColor: sortBy === 'name' ? 'var(--color-info)' : 'var(--color-border)'
                }}
                onMouseEnter={(e) => {
                  if (sortBy !== 'name') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sortBy !== 'name') {
                    e.currentTarget.style.backgroundColor = 'var(--color-bg-secondary)';
                  }
                }}
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

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={paginatedData}
                margin={{ top: 5, right: 3, left: 3, bottom: isMobile ? 6 : 8 }}
            >
              <CartesianGrid {...gridProps} />
              <XAxis
                dataKey="institutionName"
                {...xAxisProps}
                angle={-45}
                textAnchor="end"
                height={isMobile ? 60 : 85}
                tickFormatter={(name) => formatTickName(name, isMobile, 18)}
              />
              <YAxis width={45}  {...yAxisProps} />
              <Tooltip content={<CustomTooltip />} />
              {/* Quitamos la leyenda de Recharts para usar nuestra leyenda personalizada */}
              <Bar
                  dataKey="inventariadas"
                  stackId="progress"
                  fill="#10B981"
                  name="Inventariadas 2025"
                  radius={[4, 4, 0, 0]}
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

        {/* Leyenda compacta personalizada para todas las pantallas */}
        {(
          <div 
            className="mt-2 p-3 rounded-lg"
            style={{ backgroundColor: 'var(--color-bg-secondary)' }}
          >
            <p 
              className="text-xs font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Estado del inventario:
            </p>
            <div className={`flex gap-4 text-xs ${isMobile ? 'justify-center' : 'justify-start'}`}>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-500" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Inventariadas 2025
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-400" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Pendientes
                </span>
              </div>
            </div>
          </div>
        )}

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

        <div 
          className="mt-6 p-4 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <div className="flex justify-between items-center mb-2">
            <h4 
              className="text-sm font-medium"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Progreso General del Sistema
            </h4>
            <span 
              className="text-sm font-medium text-green-600"
              style={{ color: 'var(--color-success)' }}
            >
              {overallProgress}%
            </span>
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
