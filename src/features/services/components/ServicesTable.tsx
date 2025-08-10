import { memo, useCallback } from 'react';
import { Edit, Trash2, Settings } from 'lucide-react';
import type { ServiceExtended } from '../types';

interface ServicesTableProps {
    services: ServiceExtended[];
    onEdit: (service: ServiceExtended) => void;
    onDelete: (service: ServiceExtended) => void;
    isLoading?: boolean;
}

// Componente de fila memoizado para evitar re-renders innecesarios
const ServiceRow = memo(({ 
    service, 
    onEdit, 
    onDelete 
}: {
    service: ServiceExtended;
    onEdit: (service: ServiceExtended) => void;
    onDelete: (service: ServiceExtended) => void;
}) => {
    const handleEdit = useCallback(() => onEdit(service), [onEdit, service]);
    const handleDelete = useCallback(() => onDelete(service), [onDelete, service]);

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {service.name}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Editar servicio"
                        aria-label={`Editar ${service.name}`}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar servicio"
                        aria-label={`Eliminar ${service.name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
});

ServiceRow.displayName = 'ServiceRow';

const ServicesTable = memo(({
    services,
    onEdit,
    onDelete,
    isLoading = false
}: ServicesTableProps) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="space-y-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!services || services.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-8 text-center">
                    <Settings className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay servicios</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando un nuevo servicio.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Vista Desktop */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Servicio
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map((service, index) => (
                            <ServiceRow
                                key={service.id ? `service-${service.id}` : `temp-${index}`}
                                service={service}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Mobile */}
            <div className="md:hidden">
                <div className="divide-y divide-gray-200">
                    {services.map((service, index) => (
                        <div key={service.id ? `mobile-service-${service.id}` : `mobile-temp-${index}`} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {service.name}
                                    </h3>
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => onEdit(service)}
                                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(service)}
                                        className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
});

ServicesTable.displayName = 'ServicesTable';

export default ServicesTable;