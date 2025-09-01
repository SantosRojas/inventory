import * as XLSX from 'xlsx';
import type { Pump } from '../types';

interface ResumenItem {
  Campo: string;
  Valor: string;
}

/**
 * Genera y descarga un archivo Excel (.xlsx) con el inventario de bombas
 */
const downloadInventoryExcel = (
    bombas: Pump[],
    titulo: string,
    nombreArchivo: string,
    resumenExtra?: ResumenItem[]
): void => {
    const currentDate = new Date().toLocaleDateString('es-ES');

    // 1. Hoja de datos principal
    const dataSheet = bombas.map(bomba => ({
        'Serie': bomba.serialNumber || 'Sin serie',
        'QR': bomba.qrCode || 'Sin QR',
        'Modelo': bomba.model || 'Sin modelo',
        'Institución': bomba.institution || 'Sin institución',
        'Servicio': bomba.service || 'Sin servicio',
        'Responsable': bomba.inventoryManager || 'Sin responsable',
        'Fecha de Inventario': bomba.inventoryDate
            ? new Date(bomba.inventoryDate).toLocaleDateString('es-ES')
            : 'Sin fecha',
        'Fecha de Fabricación': bomba.manufactureDate
            ? new Date(bomba.manufactureDate).toLocaleDateString('es-ES')
            : 'Sin fecha',
        'Último mantenimiento': bomba.lastMaintenanceDate
            ? new Date(bomba.lastMaintenanceDate).toLocaleDateString('es-ES')
            : 'Sin fecha',
        'Fecha de Creación': bomba.createdAt
            ? new Date(bomba.createdAt).toLocaleDateString('es-ES')
            : 'Sin fecha',
        'Estado': bomba.status === 'Operativo' ? 'Operativo' : 'Inoperativo',
    }));

    // 2. Hoja de resumen (opcional)
    const resumenSheet: ResumenItem[] = [
        { Campo: 'Título del Reporte', Valor: titulo },
        { Campo: 'Fecha de Exportación', Valor: currentDate },
        { Campo: 'Operativas', Valor: bombas.filter(b => b.status === 'Operativo').length.toString() },
        { Campo: 'Inoperativas', Valor: bombas.filter(b => b.status === 'Inoperativo').length.toString() },
    ];

    if (resumenExtra) {
        resumenSheet.push(...resumenExtra);
    }


    // 3. Crear libro y hojas
    const workbook = XLSX.utils.book_new();

    const sheetResumen = XLSX.utils.json_to_sheet(resumenSheet, { skipHeader: true });
    XLSX.utils.book_append_sheet(workbook, sheetResumen, 'Resumen');

    const sheetDatos = XLSX.utils.json_to_sheet(dataSheet);
    XLSX.utils.book_append_sheet(workbook, sheetDatos, 'Inventario');

    // 4. Descargar archivo
    const fileName = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    console.log('✅ Archivo Excel generado:', fileName);
};

export default downloadInventoryExcel;
