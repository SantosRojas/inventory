import { Edit, Trash2} from 'lucide-react';
import type { Pump } from '../../../types';
interface PumpsTableProps {
    pumps: Pump[];
    isLoading: boolean;
    onEdit:  (pump: Pump) => void;
    onDelete: (pump: Pump) => void;
}

const PumpsTable = (
    {
      pumps,
      isLoading,
      onEdit,
      onDelete,
    }: PumpsTableProps
) => {


    const formatDate = (dateString:string) => {
        return new Date(dateString).toLocaleDateString('es-ES');
    };

    const getStatusColor = (status : string) => {
        switch (status.toLowerCase()) {
            case 'operativo':
                return 'bg-green-100 text-green-800';
            case 'mantenimiento':
                return 'bg-yellow-100 text-yellow-800';
            case 'fuera de servicio':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEdit = (pump:Pump) => {
        console.log(`Editar equipo: ${pump.model} (S/N: ${pump.serialNumber})`)
        onEdit(pump);
    };

    const handleDelete = (pump:Pump) => {
        onDelete(pump)
    };

    if(isLoading){
        return (
            <div className="p-6">
                cargando ....
            </div>
        )
    }

    return (
        // <div className="p-6 bg-gray-50 min-h-screen">
        //
        // </div>
        <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Inventario de Equipos Médicos</h2>
                    <p className="text-sm text-gray-600 mt-1">{pumps.length} equipos registrados</p>
                </div>

                {/* Vista de escritorio */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número de Serie
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Código QR
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Modelo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Institución
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Servicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Inventario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Último Mantenimiento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Responsable
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {pumps.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {item.serialNumber}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.qrCode}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.institution}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.service}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.inventoryDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(item.lastMaintenanceDate?item.lastMaintenanceDate:"")}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.inventoryManager}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Vista móvil y tablet */}
                <div className="lg:hidden">
                    {pumps.map((item) => (
                        <div key={item.id} className="border-b border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">{item.model}</h3>
                                    <p className="text-sm text-gray-500">S/N: {item.serialNumber}</p>
                                </div>
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Código QR</p>
                                    <p className="text-sm text-gray-900">{item.qrCode}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Institución</p>
                                    <p className="text-sm text-gray-900">{item.institution}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Servicio</p>
                                    <p className="text-sm text-gray-900">{item.service}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Responsable</p>
                                    <p className="text-sm text-gray-900">{item.inventoryManager}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Fecha Inventario</p>
                                    <p className="text-sm text-gray-900">{formatDate(item.inventoryDate)}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">Último Mantenimiento</p>
                                    {
                                        item.lastMaintenanceDate && (
                                            <p className="text-sm text-gray-900">{formatDate(item.lastMaintenanceDate)}</p>
                                        )
                                    }
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="flex items-center px-3 py-2 text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                                >
                                    <Edit size={16} className="mr-1" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(item)}
                                    className="flex items-center px-3 py-2 text-sm text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={16} className="mr-1" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PumpsTable;