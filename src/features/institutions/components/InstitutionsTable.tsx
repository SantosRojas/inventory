import { memo, useCallback } from 'react';
import { Edit, Trash2, Building2 } from 'lucide-react';
import type { InstitutionExtended } from '../types';

interface InstitutionsTableProps {
    institutions: InstitutionExtended[];
    onEdit: (institution: InstitutionExtended) => void;
    onDelete: (institution: InstitutionExtended) => void;
    isLoading?: boolean;
}

// Componente de fila memoizado para evitar re-renders innecesarios
const InstitutionRow = memo(({ 
    institution, 
    onEdit, 
    onDelete 
}: {
    institution: InstitutionExtended;
    onEdit: (institution: InstitutionExtended) => void;
    onDelete: (institution: InstitutionExtended) => void;
}) => {
    const handleEdit = useCallback(() => onEdit(institution), [onEdit, institution]);
    const handleDelete = useCallback(() => onDelete(institution), [onDelete, institution]);

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {institution.code}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                    {institution.name}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleEdit}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                        title="Editar institución"
                        aria-label={`Editar ${institution.name}`}
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar institución"
                        aria-label={`Eliminar ${institution.name}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
});

InstitutionRow.displayName = 'InstitutionRow';

interface InstitutionsTableProps {
    institutions: InstitutionExtended[];
    onEdit: (institution: InstitutionExtended) => void;
    onDelete: (institution: InstitutionExtended) => void;
    isLoading?: boolean;
}

const InstitutionsTable = memo(({
    institutions,
    onEdit,
    onDelete,
    isLoading = false
}: InstitutionsTableProps) => {
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

    if (!institutions || institutions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-8 text-center">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay instituciones</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza agregando una nueva institución.
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
                                Código
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Institución
                            </th>
                            
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {institutions.map((institution, index) => (
                            <InstitutionRow
                                key={institution.id ? `institution-${institution.id}` : `temp-${index}`}
                                institution={institution}
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
                    {institutions.map((institution, index) => (
                        <div key={institution.id ? `mobile-institution-${institution.id}` : `mobile-temp-${index}`} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {institution.code}
                                    </h3>
                                    
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {institution.name}
                                    </h3>
                                    
                                </div>
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => onEdit(institution)}
                                        className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50"
                                        title="Editar"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(institution)}
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

InstitutionsTable.displayName = 'InstitutionsTable';

export default InstitutionsTable;
