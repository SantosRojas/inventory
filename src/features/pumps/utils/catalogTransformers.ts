

// Tipos para componentes
import type {Institution, PumpModel, Service} from "../../../types";

export type SelectItem = {
    id: number | string;
    name: string;
    code?: string;
    [key: string]: unknown;
};

export type AutocompleteItem = {
    id: number;
    name: string;
    [key: string]: unknown;
};

// Transformadores para Select
export const transformModelosForSelect = (modelos: PumpModel[]): SelectItem[] => {
    return modelos.map(modelo => ({
        ...modelo,
        id: modelo.id,
        name: modelo.name,
        code: modelo.code
    }));
};

export const transformInstitucionesForSelect = (instituciones: Institution[]): SelectItem[] => {
    return instituciones.map(institution => ({
        ...institution,
        id: institution.id,
        name: institution.name
    }));
};

export const transformServiciosForSelect = (servicios: Service[]): SelectItem[] => {
    return servicios.map(servicio => ({
        ...servicio,
        id: servicio.id,
        name: servicio.name
    }));
};

// Transformadores para Autocomplete
export const transformInstitucionesForAutocomplete = (instituciones: Institution[]): AutocompleteItem[] => {
    return instituciones.map(institution => ({
        ...institution,
        id: institution.id,
        name: institution.name
    }));
};

export const transformServiciosForAutocomplete = (servicios: Service[]): AutocompleteItem[] => {
    return servicios.map(servicio => ({
        ...servicio,
        id: servicio.id,
        name: servicio.name
    }));
};
