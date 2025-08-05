import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { InventoryProgressByServiceResponse, SummaryResponse} from '../../types';
import { LazyCard } from '../../../../components';


interface InventoryProgressByServiceChartsProps {
  data: InventoryProgressByServiceResponse;
  summaryData: SummaryResponse;
}

const InventoryProgressByServiceCharts: React.FC<InventoryProgressByServiceChartsProps> = ({ data, summaryData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // Usar datos directos del summary en lugar de calcularlos - MUCHO MÁS EFICIENTE
  const summaryStats = useMemo(() => {
    if (!summaryData) {
      return { totalInstitutions: 0, totalServices: 0, totalItems: 0, inventoriedItems: 0 };
    }

    // Datos principales del summary
    const totalItems = summaryData.totalPumps;
    const inventoriedItems = summaryData.inventoriedPumpsThisYear;

    // Solo calcular lo que no viene en el summary
    let totalServices = 0;
    if (data?.institutions?.length) {
      for (const institution of data.institutions) {
        totalServices += institution.services.length;
      }
    }

    return {
      totalInstitutions: summaryData.adminData?.totalInstitutions || data?.institutions?.length || 0,
      totalServices,
      totalItems,
      inventoriedItems
    };
  }, [summaryData, data?.institutions]);

  // Usar datos que ya vienen del backend - OPTIMIZADO
  const institutionsWithTotals = useMemo(() => {
    if (!data?.institutions?.length) return [];

    // Los totales por institución ya vienen calculados en los services
    // Solo necesitamos sumar los services de cada institución
    return data.institutions.map(institution => {
      let totalItems = 0;
      let inventoriedItems = 0;

      // Sumar solo una vez por institución
      for (const service of institution.services) {
        totalItems += service.totalPumps;
        inventoriedItems += service.pumpsInventoriedThisYear;
      }

      return {
        ...institution,
        totalItems,
        inventoriedItems
      };
    });
  }, [data.institutions]);

  // Obtener las 6 instituciones con mayor cantidad de bombas y aplicar filtro de búsqueda - optimizado
  const filteredAndSortedInstitutions = useMemo(() => {
    if (!institutionsWithTotals.length) return [];

    let filtered = institutionsWithTotals;

    // Aplicar filtro de búsqueda si hay término
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = institutionsWithTotals.filter(institution =>
        institution.institutionName.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Ordenar por cantidad total de items (mayor a menor) y tomar solo las primeras 6
    return filtered
      .sort((a, b) => b.totalItems - a.totalItems)
      .slice(0, 6);
  }, [institutionsWithTotals, searchTerm]);

  // Calcular progreso general - memoizado
  const totalProgress = useMemo(() => {
    return summaryStats.totalItems > 0
      ? (summaryStats.inventoriedItems / summaryStats.totalItems) * 100
      : 0;
  }, [summaryStats.totalItems, summaryStats.inventoriedItems]);

  // Pre-calcular progresos de instituciones para evitar cálculos en render
  const institutionProgresses = useMemo(() => {
    const progressMap = new Map<number, number>();
    filteredAndSortedInstitutions.forEach(institution => {
      const progress = institution.totalItems > 0
        ? (institution.inventoriedItems / institution.totalItems) * 100
        : 0;
      progressMap.set(institution.institutionId, progress);
    });
    return progressMap;
  }, [filteredAndSortedInstitutions]);

  // Cerrar menú cuando se hace click fuera - optimizado
  useEffect(() => {
    if (openMenuId === null) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.download-menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  // Manejadores de eventos memoizados
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleMenuToggle = useCallback((institutionId: number) => {
    setOpenMenuId(prev => prev === institutionId ? null : institutionId);
  }, []);

  // Componente de servicio memoizado para evitar re-renders innecesarios
  const ServiceCard = useCallback(({ service }: { service: { serviceName: string; totalPumps: number; pumpsInventoriedThisYear: number } }) => {
    const serviceProgress = service.totalPumps > 0
      ? (service.pumpsInventoriedThisYear / service.totalPumps) * 100
      : 0;

    return (
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between items-start mb-2">
          <h6 className="text-sm font-medium text-gray-900 line-clamp-2">{service.serviceName}</h6>
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
            {service.totalPumps}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Inventariado:</span>
            <span className="font-medium text-green-600">{service.pumpsInventoriedThisYear}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600">
            <span>Pendiente:</span>
            <span className="font-medium text-gray-500">{service.totalPumps - service.pumpsInventoriedThisYear}</span>
          </div>
        </div>

        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${serviceProgress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 text-center mt-1">
            {serviceProgress.toFixed(1)}%
          </div>
        </div>
      </div>
    );
  }, []);

  // const handleDownload = useCallback(async (institutionId: number, type: 'total' | 'current-year' | 'not-inventoried', institutionName: string) => {
  //   const downloadKey = `${institutionId}-${type}`;
  //   setDownloadingId(downloadKey);
  //
  //   try {
  //     let data;
  //     let filename: string;
  //
  //     switch (type) {
  //       case 'total':
  //         data = await useFetch(API_ENDPOINTS.)
  //         filename = `inventario-total-${institutionName.replace(/\s+/g, '-').toLowerCase()}.xlsx`;
  //         break;
  //       case 'current-year':
  //         data = await dashboardService.downloadCurrentYearInventory(institutionId);
  //         filename = `inventario-2025-${institutionName.replace(/\s+/g, '-').toLowerCase()}.xlsx`;
  //         break;
  //       case 'not-inventoried':
  //         data = await dashboardService.downloadNotInventoriedThisYear(institutionId);
  //         filename = `pendientes-inventario-${institutionName.replace(/\s+/g, '-').toLowerCase()}.xlsx`;
  //         break;
  //       default:
  //         throw new Error('Tipo de descarga no válido');
  //     }
  //
  //     // Usar la función de utilidad para generar y descargar el Excel
  //     // Ahora data es un array directo de elementos
  //     downloadDashboardInventoryExcel(data, filename, type, institutionName);
  //
  //     setOpenMenuId(null); // Cerrar menú después de descarga
  //   } catch (error) {
  //     console.error('❌ Error downloading data:', error);
  //     alert('Error al descargar los datos. Intenta nuevamente.');
  //   } finally {
  //     setDownloadingId(null);
  //   }
  // }, []);

  const handleDownload = (institutionId: number, type: 'total' | 'current-year' | 'not-inventoried', institutionName: string) => {
    console.log('Download Excel');
    console.log(institutionId);
    console.log(type);
    console.log(institutionName);
    const downloadKey = `${institutionId}-${type}`;
    setDownloadingId(downloadKey);
  }

  if (!data?.institutions || data.institutions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">⚠️ No hay datos de progreso de inventario por servicio disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">🏥 Progreso de Inventario por Servicio</h3>
          <p className="text-sm text-gray-600 mt-1">
            {summaryStats.inventoriedItems.toLocaleString()} de {summaryStats.totalItems.toLocaleString()} bombas inventariadas •
            {summaryStats.totalServices} servicios en {summaryStats.totalInstitutions} instituciones
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progreso General</div>
          <div className="text-2xl font-bold text-green-600">
            {totalProgress.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="🔍 Buscar por institución..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ❌
          </button>
        )}
      </div>

      {/* Instituciones */}
      {filteredAndSortedInstitutions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchTerm ? `No se encontraron instituciones que coincidan con "${searchTerm}"` : 'No hay instituciones disponibles'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAndSortedInstitutions.map((institution) => {
            const progress = institutionProgresses.get(institution.institutionId) || 0;

            return (
              <LazyCard key={institution.institutionId} className="border rounded-lg p-6">
                <div className="space-y-4">
                  {/* Header de la institución */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {institution.institutionName}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {institution.services.length} servicios
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {institution.inventoriedItems.toLocaleString()} de {institution.totalItems.toLocaleString()} bombas inventariadas
                      </div>
                    </div>

                    {/* Progreso y menú de descarga */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Progreso</div>
                        <div className="text-xl font-bold text-green-600">
                          {progress.toFixed(1)}%
                        </div>
                      </div>

                      {/* Menú de descarga */}
                      <div className="relative download-menu-container">
                        <button
                          onClick={() => handleMenuToggle(institution.institutionId)}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          📥 Descargar
                        </button>

                        {openMenuId === institution.institutionId && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                            <div className="py-2">
                              <button
                                onClick={() => handleDownload(institution.institutionId, 'total', institution.institutionName)}
                                disabled={downloadingId === `${institution.institutionId}-total`}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                              >
                                {downloadingId === `${institution.institutionId}-total` ? '⏳' : '📊'}
                                Inventario Total
                              </button>
                              <button
                                onClick={() => handleDownload(institution.institutionId, 'current-year', institution.institutionName)}
                                disabled={downloadingId === `${institution.institutionId}-current-year`}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                              >
                                {downloadingId === `${institution.institutionId}-current-year` ? '⏳' : '📅'}
                                Inventario 2025
                              </button>
                              <button
                                onClick={() => handleDownload(institution.institutionId, 'not-inventoried', institution.institutionName)}
                                disabled={downloadingId === `${institution.institutionId}-not-inventoried`}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50"
                              >
                                {downloadingId === `${institution.institutionId}-not-inventoried` ? '⏳' : '⚠️'}
                                Pendientes
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Barra de progreso de la institución */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {/* Servicios */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {institution.services.map((service, index) => (
                      <ServiceCard key={`${institution.institutionId}-${service.serviceName}-${index}`} service={service} />
                    ))}
                  </div>
                </div>
              </LazyCard>
            );
          })}
        </div>
      )}

      {/* Mostrar mensaje si hay más instituciones */}
      {institutionsWithTotals.length > 6 && filteredAndSortedInstitutions.length === 6 && !searchTerm && (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">
            📊 Mostrando las 6 instituciones con mayor inventario.
            Usa el buscador para encontrar instituciones específicas.
          </p>
        </div>
      )}
    </div>
  );
};

export default InventoryProgressByServiceCharts;
