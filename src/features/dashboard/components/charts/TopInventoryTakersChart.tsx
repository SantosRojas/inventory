import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';
import type { TopInventoryTakersResponse } from '../../types';
import { useAuth } from '../../../auth/hooks';
import { ChartTooltip, TooltipTitle, TooltipValue } from '../../../../components';
import { useChartAxisStyles } from '../../../../hooks';

interface Props {
  data?: TopInventoryTakersResponse;
}

interface ChartItem {
  name: string;
  value: number;
}

const TopInventoryTakersChart = ({ data }: Props) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
  const { xAxisProps, yAxisProps, gridProps } = useChartAxisStyles(isMobile);
  
  // Estados para la paginación y filtros
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'value'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const ITEMS_PER_PAGE = isMobile ? 4 : 15;

  const { paginatedData, totalInventaryTakers, totalPages, filteredCount, error } = useMemo(() => {
    if (!user) {
      return {
        paginatedData: [],
        totalInventaryTakers: 0,
        totalPages: 0,
        filteredCount: 0,
        error: 'Inicia sesión para ver los datos.',
      };
    }

    if (!data?.topInventoryTakers || data.topInventoryTakers.length === 0) {
      return {
        paginatedData: [],
        totalInventaryTakers: 0,
        totalPages: 0,
        filteredCount: 0,
        error: 'No hay datos de inventariadores disponibles.',
      };
    }

    // Crear datos del gráfico
    const chartData: ChartItem[] = data.topInventoryTakers.map((item) => ({
      name: item.inventoryTakerName,
      value: item.pumpsInventoriedThisYear,
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

    return {
      paginatedData,
      totalInventaryTakers: data.topInventoryTakers.length,
      totalPages,
      filteredCount: filteredData.length,
      error: null,
    };
  }, [user, data?.topInventoryTakers, currentPage, searchTerm, sortBy, sortOrder, ITEMS_PER_PAGE]);

  // Resetear página cuando cambie el tamaño de pantalla
  useEffect(() => {
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
    setCurrentPage(0);
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  }, []);

  const formatName = useCallback((name: string) => {
    if (isMobile) {
      return name.length > 12 ? `${name.substring(0, 9)}...` : name;
    }
    return name.length > 15 ? `${name.substring(0, 12)}...` : name;
  }, [isMobile]);

  const CustomTooltip = useCallback(({ active, payload }: {
    active?: boolean;
    payload?: { payload: ChartItem }[];
  }) => {
    if (active && payload?.length) {
      const { name, value } = payload[0].payload;

      return (
          <ChartTooltip active={active}>
            <TooltipTitle>{name}</TooltipTitle>
            <TooltipValue 
              label="Equipos inventariados" 
              value={value.toLocaleString()} 
              color="#3B82F6" 
              showDot 
            />
          </ChartTooltip>
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
      <div className="bg-white p-1 sm:p-4 rounded-lg border">
        {/* Título */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">🧍‍♂️ Top Inventariadores del Año</h3>
          <p className="text-sm text-gray-600">
            {totalInventaryTakers} inventariadores activos • Equipos registrados en lo que va del año
          </p>
        </div>

        {/* Controles de filtrado y búsqueda */}
        <div className="mb-4 space-y-3">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar inventariador..."
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
                Equipos
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
              Mostrando {filteredCount} de {totalInventaryTakers} inventariadores que coinciden con "{searchTerm}"
            </p>
          </div>
        )}

        {/* Gráfico */}
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
              data={paginatedData}
              margin={{ top: 5, right: 5, left: 5, bottom: isMobile ? 60 : 80 }}
          >
            <CartesianGrid {...gridProps} />
            <XAxis 
              dataKey="name" 
              {...xAxisProps}
              angle={-45} 
              textAnchor='end'
              height={isMobile ? 60 : 80}
              tickFormatter={formatName}
            />
            <YAxis {...yAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              name="Equipos Inventariados" 
              fill="#36A2EB" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
        </div>

        {/* Leyenda compacta personalizada para todas las pantallas */}
        <div 
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <p 
            className="text-xs font-medium mb-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Métrica:
          </p>
          <div className={`flex gap-4 text-xs ${isMobile ? 'justify-center' : 'justify-start'}`}>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Equipos Inventariados
              </span>
            </div>
          </div>
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className={`mt-4 space-y-3 ${isMobile ? '' : 'flex items-center justify-between'}`}>
            <div className="text-sm text-gray-600 text-center">
              Página {currentPage + 1} de {totalPages} • {paginatedData.length} de {filteredCount} inventariadores
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

export default TopInventoryTakersChart;
