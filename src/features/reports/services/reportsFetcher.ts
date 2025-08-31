import type {
    SummaryResponse,
    InventoryProgressByServiceResponse,
} from '../../dashboard/types';
import {API_ENDPOINTS} from "../../../config";
import { fetchWithAuth } from '../../../services/fetchWithAuth.ts';

export interface ReportsData {
    summary: SummaryResponse | null;
    inventoryProgressByService: InventoryProgressByServiceResponse | null;
}

export const fetchReportsData = async (): Promise<ReportsData> => {
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
        inventoryProgressByService,
    ] = await Promise.all([
        fetchAndValidate<SummaryResponse>(API_ENDPOINTS.dashboard.summary()),
        fetchAndValidate<InventoryProgressByServiceResponse>(
            API_ENDPOINTS.dashboard.inventoryProgressByService()
        ),
    ]);

    return {
        summary,
        inventoryProgressByService,
    };
};
