import React, { useEffect, Suspense } from 'react';
import { useAuth } from '../../auth/hooks';
import { useReportsStore } from '../store/reportsStore';

// Lazy load del gráfico desde dashboard
const LazyCharts = {
  InventoryProgressByService: React.lazy(() =>
      import('../../dashboard/components/charts').then(mod => ({ default: mod.InventoryProgressByServiceCharts }))
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

export const ReportsPage = () => {
    const {user, isLoading: isAuthLoading, token: authToken} = useAuth();
    const {data, loading, error, getReportsData} = useReportsStore();
    const loadedAt = useReportsStore(state => state.loadedAt);

    const token = authToken ? authToken : "";

    useEffect(() => {
        if (user?.id) {
            getReportsData(user.id, token ? token : "");
        }
    }, [user?.id, getReportsData, token]);

    if (isAuthLoading) return <StateMessage icon="🔄" text="Inicializando autenticación..."/>;
    if (!user) return <StateMessage icon="⚠️" text="No hay usuario autenticado" color="text-red-600"/>;
    if (loading) return <StateMessage icon="🔄" text="Cargando datos de reportes..."/>;
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-red-800 mb-2">❌ Error al cargar los reportes</h3>
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => getReportsData(user.id, token)}
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
        inventoryProgressByService,
    } = data || {};

    return (
        <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 max-w-full overflow-hidden">
            {/* Encabezado */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="min-w-0 flex-1">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                        📊 Reportes de Inventario
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 break-words">
                        Análisis detallado del progreso del inventario por servicios
                    </p>
                </div>
                <button
                    onClick={() => user?.id && getReportsData(user.id, token)}
                    className="bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap flex-shrink-0"
                    disabled={!user?.id || !token}
                >
                    🔄 <span className="hidden sm:inline">Actualizar</span>
                </button>
            </div>

            {/* Progreso por servicio */}
            {inventoryProgressByService && summary ? (
                <LightChartSection height="h-96">
                        <LazyCharts.InventoryProgressByService
                            data={inventoryProgressByService}
                            summaryData={summary}
                        />
                    </LightChartSection>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No hay datos de progreso disponibles
                        </h3>
                        <p className="text-gray-600">
                            Los reportes se mostrarán cuando haya datos de inventario por servicios.
                        </p>
                    </div>
                </div>
            )}

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                    <div className="text-2xl mr-3">💡</div>
                    <div>
                        <h4 className="font-medium text-blue-900 mb-1">
                            Información sobre los reportes
                        </h4>
                        <p className="text-blue-700 text-sm">
                            Este reporte muestra el progreso del inventario agrupado por servicios, 
                            permitiendo identificar qué servicios tienen mayor avance en sus inventarios.
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 py-4">
                <p>
                    Datos actualizados:{' '}
                    {loadedAt ? new Date(loadedAt).toLocaleString() : 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default ReportsPage;
