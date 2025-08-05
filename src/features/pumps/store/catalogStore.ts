import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {Institution, PumpModel, Service} from "../../../types";


interface CatalogState {
    institutions: Institution[]
    services: Service[]
    pumpModels: PumpModel[]

    setCatalogs: (data: {
        institutions: Institution[]
        services: Service[]
        pumpModels: PumpModel[]
    }) => void

    updateInstitutions: (institutions: Institution[]) => void
    updateServices: (services: Service[]) => void
    updatePumpModels: (pumpModels: PumpModel[]) => void
}

export const useCatalogsStore = create<CatalogState>()(
    persist(
        (set) => ({
            institutions: [],
            services: [],
            pumpModels: [],

            setCatalogs: ({ institutions, services, pumpModels }) =>
                set({ institutions, services, pumpModels }),

            updateInstitutions: (institutions) => set({ institutions }),
            updateServices: (services) => set({ services }),
            updatePumpModels: (pumpModels) => set({ pumpModels }),
        }),
        {
            name: 'catalogs-storage',
            partialize: (state) => ({
                institutions: state.institutions,
                services: state.services,
                pumpModels: state.pumpModels,
            }),
        }
    )
)
