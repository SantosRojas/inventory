import { useEffect, useState } from 'react'
import {useCatalogsStore} from "../store";
import {fetchInstitutions, fetchPumpModels, fetchServices} from "../services";

export const useCatalogLoader = () => {
    const setCatalogs = useCatalogsStore((state) => state.setCatalogs)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<null | string>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)

                const [institutionsResponse, servicesResponse, pumpModelsResponse] = await Promise.all([
                    fetchInstitutions(),
                    fetchServices(),
                    fetchPumpModels()
                ])

                const institutions = institutionsResponse.data
                const services = servicesResponse.data
                const pumpModels = pumpModelsResponse.data

                setCatalogs({ institutions,services,pumpModels })
            } catch (err) {
                console.error(err)
                setError('No se pudieron cargar los catálogos')
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [setCatalogs])

    return { loading, error }
}
