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
import React, { useCallback, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { ChevronLeft, ChevronRight, Search, SortAsc, SortDesc } from 'lucide-react';

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
  // Hook para detectar el tamaño de pantalla
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
  
  // Estados para la paginación y filtros
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'total'>('total');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const ITEMS_PER_PAGE = isMobile ? 4 : 15;

  const { paginatedData, totalInstitutions, totalBombas, models, totalPages, filteredCount } = useMemo(() => {
    const institutions = data?.data ?? [];
    const totalPumps = data?.totalPumps || 0;
    const modelsList = data?.models || [];

    if (institutions.length === 0) {
      return {
        paginatedData: [],
        totalInstitutions: 0,
        totalBombas: 0,
        models: [],
        totalPages: 0,
        filteredCount: 0,
      };
    }

    // Filtrar por búsqueda
    const filteredData = institutions.filter(item =>
      item.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Ordenar datos
    const sortedData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.institutionName.localeCompare(b.institutionName);
          break;
        case 'total':
          comparison = (a.total as number) - (b.total as number);
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
      totalInstitutions: institutions.length,
      totalBombas: totalPumps,
      models: modelsList,
      totalPages,
      filteredCount: filteredData.length,
    };
  }, [data?.data, data?.totalPumps, data?.models, currentPage, searchTerm, sortBy, sortOrder, ITEMS_PER_PAGE]);

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
    setCurrentPage(0);
  }, [sortBy]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  }, []);

  const CustomTooltip = useCallback(({ active, payload, label }: {
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
    if (isMobile) {
      return name.length > 12 ? `${name.substring(0, 9)}...` : name;
    }
    return name.length > 15 ? `${name.substring(0, 12)}...` : name;
  }, [isMobile]);

  if (!paginatedData?.length) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ No hay datos de distribución por institución disponibles.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-1 sm:p-4 rounded-lg border">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🏥 Distribución de Modelos por Institución</h3>
        <p className="text-sm text-gray-600">
          {totalBombas.toLocaleString()} bombas en {totalInstitutions} instituciones • {models.length} modelos diferentes
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
              onClick={() => handleSortChange('total')}
              className={`flex-1 px-3 py-2 text-sm rounded-lg flex items-center justify-center gap-1 transition-colors ${
                sortBy === 'total' 
                  ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {sortBy === 'total' && (sortOrder === 'desc' ? <SortDesc className="h-3 w-3" /> : <SortAsc className="h-3 w-3" />)}
              Total Bombas
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

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={paginatedData}
            margin={{ top: 5, right: 5, left: 5, bottom: isMobile ? 60 : 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="institutionName"
              tick={{ fontSize: isMobile ? 10 : 12 }}
              angle={-45}
              textAnchor="end"
              height={isMobile ? 60 : 80}
              tickFormatter={formatInstitutionName}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="rect" />
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

export default ModelDistributionByInstitutionCharts;
