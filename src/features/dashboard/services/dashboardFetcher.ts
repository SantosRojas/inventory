
import type {
    SummaryResponse,
    ModelDistributionResponse,
    ModelDistributionByInstitutionResponse,
    InventoryProgressByInstitutionResponse,
    TopInventoryTakersResponse,
    OverdueMaintenanceResponse,
} from '../types';
import {getHeaders} from "../../../utils/headersUtil.ts";
import {API_ENDPOINTS} from "../../../config";

export interface DashboardData {
    summary: SummaryResponse | null;
    modelDistribution: ModelDistributionResponse | null;
    modelDistributionByInstitution: ModelDistributionByInstitutionResponse | null;
    inventoryProgressByInstitution: InventoryProgressByInstitutionResponse | null;
    topInventoryTakers: TopInventoryTakersResponse | null;
    overdueMaintenance: OverdueMaintenanceResponse | null;
}

export const fetchDashboardData = async (
    userId: number,
    token: string
): Promise<DashboardData> => {
    const fetchAndValidate = async <T>(url: string): Promise<T | null> => {
        const response = await fetch(url, { headers: getHeaders(token) });
        const json = await response.json();

        if (json.success === false) {
            throw new Error(json.message || json.error || 'Error desconocido');
        }

        return json.data ?? null;
    };

    const [
        summary,
        modelDistribution,
        modelDistributionByInstitution,
        inventoryProgressByInstitution,
        topInventoryTakers,
        overdueMaintenance,
    ] = await Promise.all([
        fetchAndValidate<SummaryResponse>(API_ENDPOINTS.dashboard.summary(userId)),
        fetchAndValidate<ModelDistributionResponse>(API_ENDPOINTS.dashboard.modelDistribution(userId)),
        fetchAndValidate<ModelDistributionByInstitutionResponse>(
            API_ENDPOINTS.dashboard.modelDistributionByInstitution(userId)
        ),
        fetchAndValidate<InventoryProgressByInstitutionResponse>(
            API_ENDPOINTS.dashboard.inventoryProgressByInstitution(userId)
        ),
        fetchAndValidate<TopInventoryTakersResponse>(API_ENDPOINTS.dashboard.topInventoryTakers(userId)),
        fetchAndValidate<OverdueMaintenanceResponse>(API_ENDPOINTS.dashboard.overdueMaintenance()),
    ]);

    return {
        summary,
        modelDistribution,
        modelDistributionByInstitution,
        inventoryProgressByInstitution,
        topInventoryTakers,
        overdueMaintenance,
    };
};
