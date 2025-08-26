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
        <>
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

           
        </>
    );
};

export default ReportsPage;
