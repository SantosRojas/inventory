import type { Pump, InstitutionStats, ResponsableStats } from '../types';

/**
 * Genera y descarga un archivo CSV con el inventario de bombas
 * @param bombas - Array de bombas a exportar
 * @param titulo - Título del reporte
 * @param nombreArchivo - Nombre base del archivo (sin extensión)
 * @param resumenExtra - Información adicional para el resumen (opcional)
 */
export const downloadInventoryExcel = (
    bombas: Pump[],
    titulo: string,
    nombreArchivo: string,
    resumenExtra?: { label: string; value: number | string }[]
) => {

    // Crear datos tabulares para Excel - Lista simple de bombas
    const data = [];
    const currentDate = new Date().toLocaleDateString('es-ES');

    // Título del reporte
    data.push([titulo]);
    data.push([`Fecha de exportación: ${currentDate}`]);
    data.push(['']); // Línea vacía

    // Encabezados de las columnas
    data.push([
        'Serie',
        'QR',
        'Modelo',
        'Institución',
        'Servicio',
        'Responsable',
        'Fecha de Inventario',
        'Fecha de Creación',
        'Estado'
    ]);

    // Datos de cada bomba
    bombas.forEach(bomba => {
        const fechaInventario = bomba.inventoryDate ?
            new Date(bomba.inventoryDate).toLocaleDateString('es-ES') : 'Sin fecha';
        const fechaCreacion = bomba.createdAt ?
            new Date(bomba.createdAt).toLocaleDateString('es-ES') : 'Sin fecha';
        const estado = bomba.status === 'Operativo' ? 'Operativo' : 'Inoperativo';

        data.push([
            bomba.serialNumber || 'Sin serie',
            bomba.qrCode || 'Sin QR',
            bomba.model || 'Sin modelo',
            bomba.institution || 'Sin institución',
            bomba.service || 'Sin servicio',
            bomba.inventoryManager || 'Sin responsable',
            fechaInventario,
            fechaCreacion,
            estado
        ]);
    });

    // Línea de resumen al final
    data.push(['']); // Línea vacía
    data.push(['RESUMEN:']);
    data.push(['Total de bombas:', bombas.length]);
    data.push(['Operativas:', bombas.filter(b => b.status === 'Operativo').length]);
    data.push(['Inoperativas:', bombas.filter(b => b.status === 'Inoperativo').length]);

    // Agregar resumen extra si se proporciona
    if (resumenExtra) {
        resumenExtra.forEach(item => {
            data.push([item.label, item.value]);
        });
    }

    // Crear archivo CSV con formato mejorado para Excel
    const csvContent = data.map(row =>
        row.map(cell => {
            const cellStr = String(cell);
            // Mejorar el escape de caracteres para Excel
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n') || cellStr.includes(';')) {
                return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
        }).join(',')
    ).join('\r\n'); // Usar \r\n para mejor compatibilidad con Excel

    // Generar nombre de archivo más descriptivo
    const fileName = `${nombreArchivo}_${new Date().toISOString().split('T')[0]}.csv`;

    // Descargar archivo con BOM para UTF-8 (mejor compatibilidad con Excel)
    const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Archivo descargado:', fileName);
};

/**
 * Descarga el inventario de una institución específica
 */
export const downloadInstitutionInventory = (
    institution: InstitutionStats,
    bombasToProcess: Pump[]
) => {
    const bombasInstitucion = bombasToProcess.filter(bomba => bomba.institution === institution.name);

    downloadInventoryExcel(
        bombasInstitucion,
        `INVENTARIO DE BOMBAS - ${institution.name}`,
        `Inventario_${institution.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}`
    );
};

/**
 * Descarga el inventario de un responsable específico
 */
export const downloadResponsableInventory = (
    responsable: ResponsableStats,
    bombas: Pump[]
) => {
    const bombasResponsable = bombas.filter(bomba => bomba.inventoryManager === responsable.name);

    const resumenExtra = [
        { label: 'Instituciones a cargo:', value: Object.keys(responsable.institutions).length }
    ];

    downloadInventoryExcel(
        bombasResponsable,
        `INVENTARIO DE BOMBAS - ${responsable.name}`,
        `Inventario_${responsable.name.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_')}`,
        resumenExtra
    );
};

// === FUNCIONES PARA DASHBOARD ===

export interface DashboardInventoryItem {
    id: number;
    serialNumber: string;
    qrCode: string;
    inventoryDate: string;
    status: string;
    lastMaintenanceDate: string;
    createdAt: string;
    model: string;
    institution: string;
    service: string;
    inventoryManager: string;
}

/**
 * Genera y descarga un archivo Excel desde datos del dashboard
 */
export const downloadDashboardInventoryExcel = (
    items: DashboardInventoryItem[],
    filename: string,
    type: 'total' | 'current-year' | 'not-inventoried',
    institutionName?: string
): void => {
    console.log('📥 Descargando reporte dashboard:', type, 'con', items.length, 'elementos');

    // Obtener nombre de institución del primer elemento si no se proporciona
    const institutionDisplayName = institutionName || (items.length > 0 ? items[0].institution : 'Institución');

    // Formatear fecha
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'Sin fecha';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Crear contenido HTML que Excel puede abrir
    let htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .header { font-weight: bold; margin-bottom: 5px; font-size: 14px; }
          .title { font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        </style>
      </head>
      <body>
  `;

    // Título según el tipo
    switch (type) {
        case 'total':
            htmlContent += `<div class="title">📊 INVENTARIO TOTAL - ${institutionDisplayName}</div>`;
            break;
        case 'current-year':
            htmlContent += `<div class="title">✅ INVENTARIADOS 2025 - ${institutionDisplayName}</div>`;
            break;
        case 'not-inventoried':
            htmlContent += `<div class="title">⚠️ PENDIENTES DE INVENTARIO 2025 - ${institutionDisplayName}</div>`;
            break;
    }

    htmlContent += `
        <div class="header">Total de Elementos: ${items.length}</div>
        <div class="header">Fecha de Generación: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}</div>
        <br>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Número de Serie</th>
              <th>Código QR</th>
              <th>Fecha de Inventario</th>
              <th>Estado</th>
              <th>Último Mantenimiento</th>
              <th>Fecha de Creación</th>
              <th>Modelo</th>
              <th>Institución</th>
              <th>Servicio</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
  `;

    // Agregar filas de datos
    items.forEach(item => {
        htmlContent += `
      <tr>
        <td>${item.id}</td>
        <td>${item.serialNumber}</td>
        <td>${item.qrCode}</td>
        <td>${formatDate(item.inventoryDate)}</td>
        <td>${item.status}</td>
        <td>${formatDate(item.lastMaintenanceDate)}</td>
        <td>${formatDate(item.createdAt)}</td>
        <td>${item.model}</td>
        <td>${item.institution}</td>
        <td>${item.service}</td>
        <td>${item.inventoryManager}</td>
      </tr>
    `;
    });

    htmlContent += `
          </tbody>
        </table>
      </body>
    </html>
  `;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log('✅ Descarga completada:', filename);
};
