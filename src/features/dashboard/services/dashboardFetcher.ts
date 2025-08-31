
import type {
    SummaryResponse,
    ModelDistributionResponse,
    ModelDistributionByInstitutionResponse,
    InventoryProgressByInstitutionResponse,
    TopInventoryTakersResponse,
    OverdueMaintenanceResponse,
} from '../types';
import {API_ENDPOINTS} from "../../../config";
import { fetchWithAuth } from '../../../services/fetchWithAuth';

export interface DashboardData {
    summary: SummaryResponse | null;
    modelDistribution: ModelDistributionResponse | null;
    modelDistributionByInstitution: ModelDistributionByInstitutionResponse | null;
    inventoryProgressByInstitution: InventoryProgressByInstitutionResponse | null;
    topInventoryTakers: TopInventoryTakersResponse | null;
    overdueMaintenance: OverdueMaintenanceResponse | null;
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
    const fetchAndValidate = async <T>(url: string): Promise<T | null> => {
        const response = await fetchWithAuth(url);
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
        fetchAndValidate<SummaryResponse>(API_ENDPOINTS.dashboard.summary()),
        fetchAndValidate<ModelDistributionResponse>(API_ENDPOINTS.dashboard.modelDistribution()),
        fetchAndValidate<ModelDistributionByInstitutionResponse>(
            API_ENDPOINTS.dashboard.modelDistributionByInstitution()
        ),
        fetchAndValidate<InventoryProgressByInstitutionResponse>(
            API_ENDPOINTS.dashboard.inventoryProgressByInstitution()
        ),
        fetchAndValidate<TopInventoryTakersResponse>(API_ENDPOINTS.dashboard.topInventoryTakers()),
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
