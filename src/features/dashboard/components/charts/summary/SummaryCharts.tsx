import React from "react";
import { useAuth } from "../../../../auth/hooks";
import ChartCard from "./components/ChartCard.tsx";
import { getPercentage } from "./utils";
import type { SummaryResponse } from "../../../types";

interface SummaryChartsProps {
    data: SummaryResponse | null;
    isAdmin: boolean;
}

const SummaryCharts: React.FC<SummaryChartsProps> = ({ data, isAdmin }) => {
    const { user } = useAuth();
    const userId = user?.id;

    if (!userId) {
        return (
            <div className="bg-red-100 border border-red-300 rounded-lg p-4">
                <p className="text-red-800">🚫 Usuario no autenticado</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">⚠️ No hay datos de resumen disponibles</p>
            </div>
        );
    }

    const {
        totalPumps,
        inventoriedPumpsThisYear,
        operativePumps,
        overduePumpsMaintenance,
        adminData,
    } = data;

    return (
        <div className="space-y-4 sm:space-y-6 overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <ChartCard
                    title="Total Bombas"
                    value={totalPumps?.toLocaleString() || "N/A"}
                    bgFrom="blue"
                />

                <ChartCard
                    title="Inventariadas 2025"
                    value={inventoriedPumpsThisYear?.toLocaleString() || "N/A"}
                    bgFrom="green"
                >
                    {totalPumps && inventoriedPumpsThisYear && (
                        <p className="text-xs opacity-75 break-words">
                            {getPercentage(inventoriedPumpsThisYear, totalPumps)}% del total
                        </p>
                    )}
                </ChartCard>

                <ChartCard
                    title="Operativas"
                    value={operativePumps?.toLocaleString() || "N/A"}
                    bgFrom="yellow"
                >
                    {totalPumps && operativePumps && (
                        <p className="text-xs opacity-75 break-words">
                            {getPercentage(operativePumps, totalPumps)}% del total
                        </p>
                    )}
                </ChartCard>

                <ChartCard
                    title="Mantenimiento Vencido"
                    value={overduePumpsMaintenance?.toLocaleString() || "N/A"}
                    bgFrom="red"
                >
                    {totalPumps && overduePumpsMaintenance && (
                        <p className="text-xs opacity-75 break-words">
                            {getPercentage(overduePumpsMaintenance, totalPumps)}% del total
                        </p>
                    )}
                </ChartCard>
            </div>

            {isAdmin && adminData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <ChartCard
                        title="Total Inventariadores"
                        value={adminData.totalInventoryTakers?.toLocaleString() || "N/A"}
                        bgFrom="purple"
                        icon="👥"
                    />

                    <ChartCard
                        title="Total Instituciones"
                        value={adminData.totalInstitutions?.toLocaleString() || "N/A"}
                        bgFrom="cyan"
                        icon="🏥"
                    />
                </div>
            )}
        </div>
    );
};

export default SummaryCharts;
