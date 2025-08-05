import type {Institution, PumpModel, Service} from "../../../types";
import {API_ENDPOINTS} from "../../../config";

interface ApiResponse<T> {
    success: boolean;
    data: T[];
}

export const fetchInstitutions = async (): Promise<ApiResponse<Institution>> => {
    const res = await fetch(API_ENDPOINTS.institutions.getAll)
    if (!res.ok) throw new Error('Error cargando instituciones')

    return res.json()
}

export const fetchPumpModels = async (): Promise<ApiResponse<PumpModel>> => {
    const res = await fetch(API_ENDPOINTS.pumpModels.getAll)
    if (!res.ok) throw new Error('Error cargando modelos de bombas')
    return res.json()
}

export const fetchServices = async (): Promise<ApiResponse<Service>> => {
    const res = await fetch(API_ENDPOINTS.services.getAll)
    if (!res.ok) throw new Error('Error cargando servicios')
    return res.json()
}
