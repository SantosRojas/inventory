import type {
    SummaryResponse,
    InventoryProgressByServiceResponse,
} from '../../dashboard/types';
import {getHeaders} from "../../../utils/headersUtil.ts";
import {API_ENDPOINTS} from "../../../config";

export interface ReportsData {
    summary: SummaryResponse | null;
    inventoryProgressByService: InventoryProgressByServiceResponse | null;
}

export const fetchReportsData = async (
    token: string
): Promise<ReportsData> => {
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
