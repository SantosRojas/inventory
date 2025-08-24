import React, { useEffect, Suspense } from 'react';
import { LazyCard } from '../../../components';
import { useAuth } from '../../auth/hooks';
import { useDashboardStore } from '../store/dashboardStore';
import {EmptyState} from "../components";
import {useNavigate} from "react-router-dom";

// Lazy load de los gráficos pesados
const LazyCharts = {
    SummaryCharts: React.lazy(() =>
        import('../components/charts').then(mod => ({ default: mod.SummaryCharts }))
    ),
  ModelDistribution: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.ModelDistributionCharts }))
  ),
  ModelDistributionByInstitution: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.ModelDistributionByInstitutionCharts }))
  ),
  InventoryProgressByInstitution: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.InventoryProgressByInstitutionCharts }))
  ),
  InventoryProgressByService: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.InventoryProgressByServiceCharts }))
  ),
  TopInventoryTakers: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.TopInventoryTakersChart }))
  ),
  OverdueMaintenance: React.lazy(() =>
      import('../components/charts').then(mod => ({ default: mod.OverdueMaintenanceChart }))
  ),
};

// Fallback de carga para los gráficos
const ChartFallback = ({ height = 'h-64' }: { height?: string }) => (
    <div className={`bg-gray-50 rounded-lg ${height} flex items-center justify-center`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="ml-2 text-gray-600">Cargando gráfico...</span>
    </div>
);

// Mensajes de estado general
const StateMessage = ({
                        icon,
                        text,
                        color = 'text-gray-600',
                      }: {
  icon: string;
  text: string;
  color?: string;
}) => (
    <div className="flex justify-center items-center py-12">
      <p className={`${color}`}>{icon} {text}</p>
    </div>
);

// Sección con LazyCard + Suspense (para gráficos pesados)
const ChartSection = ({
                        height,
                        children,
                      }: {
  height: string;
  children: React.ReactNode;
}) => (
    <LazyCard fallbackHeight={height}>
      <Suspense fallback={<ChartFallback height={height} />}>
        {children}
      </Suspense>
    </LazyCard>
);

// Sección ligera con solo Suspense
const LightChartSection = ({
                             height,
                             children,
                           }: {
  height: string;
  children: React.ReactNode;
}) => (
    <Suspense fallback={<ChartFallback height={height} />}>
      {children}
    </Suspense>
);

export const DashboardPage = () => {
    const {user, isLoading: isAuthLoading, token: authToken} = useAuth();
    const {data, loading, error, getDashboardData} = useDashboardStore();

    const token = authToken ? authToken : "";
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            console.log("inciando")
            getDashboardData(user.id, token ? token : "");
        }
    }, [user?.id, getDashboardData, token]);

    const handleNavigateToInventory = () => {
        console.log("Redirigiendo a inventario")
        navigate("/inventario");
    }

    if (!data?.summary?.totalPumps) return <EmptyState onAction ={handleNavigateToInventory} />

    if (isAuthLoading) return <StateMessage icon="🔄" text="Inicializando autenticación..."/>;
    if (!user) return <StateMessage icon="⚠️" text="No hay usuario autenticado" color="text-red-600"/>;
    if (loading) return <StateMessage icon="🔄" text="Cargando datos del dashboard..."/>;
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 mb-2">❌ Error al cargar el dashboard</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => getDashboardData(user.id, token)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        🔄 Reintentar
                    </button>
                </div>
            </div>
        );
    }



    const {
        summary,
        modelDistribution,
        modelDistributionByInstitution,
        inventoryProgressByInstitution,
        inventoryProgressByService,
        topInventoryTakers,
        overdueMaintenance,
        loadedAt,
    } = data;


    const isAdmin = !!summary?.adminData;
    if (!summary) {
        return (
            <div className="text-gray-500 text-center py-4">
                No hay datos disponibles
            </div>
        )
    }

    return (
        <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                        {isAdmin ? 'Dashboard de Administración' : 'Mi Dashboard'}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                        {isAdmin
                            ? 'Vista completa del sistema de inventario'
                            : 'Vista de tu inventario personal'}
                    </p>
                </div>
                <button
                    onClick={() => user?.id && getDashboardData(user.id, token)}
                    className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                    disabled={!user?.id || !token}
                >
                    🔄 <span className="hidden sm:inline">Actualizar</span>
                </button>
            </div>

            {/*Resumen*/}
            <LazyCharts.SummaryCharts data={summary} isAdmin={isAdmin}/>

            {/* Top inventariadores */}
            {topInventoryTakers && (
                <LightChartSection height="h-auto">
                    <LazyCharts.TopInventoryTakers data={topInventoryTakers}/>
                </LightChartSection>
            )}

            {/* Progreso por institución */}
            {inventoryProgressByInstitution && (
                <ChartSection height="h-64">
                    <LazyCharts.InventoryProgressByInstitution
                        data={inventoryProgressByInstitution}
                        summaryData={summary}
                    />
                </ChartSection>
            )}

            {/* Mantenimiento vencido */}
            {overdueMaintenance && (
                <LightChartSection height="h-auto">
                    <LazyCharts.OverdueMaintenance data={overdueMaintenance}/>
                </LightChartSection>
            )}

            {/* Distribución por modelo */}
            {modelDistribution && (
                <ChartSection height="h-64">
                    <LazyCharts.ModelDistribution
                        data={modelDistribution}
                        summaryData={summary}
                    />
                </ChartSection>
            )}

            {/* Distribución por institución */}
            {modelDistributionByInstitution && (
                <ChartSection height="h-80">
                    <LazyCharts.ModelDistributionByInstitution
                        data={modelDistributionByInstitution}
                    />
                </ChartSection>
            )}

            {/* Progreso por servicio */}
            {inventoryProgressByService && (
                <LightChartSection height="h-96">
                    <LazyCharts.InventoryProgressByService
                        data={inventoryProgressByService}
                        summaryData={summary}
                    />
                </LightChartSection>
            )}


            {/* Footer */}
            <div className="text-center text-sm text-gray-500 py-4">
                <p>
                    Datos actualizados:{' '}
                    {loadedAt ? new Date(loadedAt).toLocaleString() : 'N/A'}
                </p>
            </div>
        </div>
    );
}


export default DashboardPage;
