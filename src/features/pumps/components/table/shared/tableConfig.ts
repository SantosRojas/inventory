// Configuración de columnas de la tabla
export interface ColumnConfig {
    key: string;
    title: string;
    width: string;
    isCenter?: boolean;
    hasBorder?: boolean;
    hasSpecialLayout?: boolean;
}

export const TABLE_COLUMNS: ColumnConfig[] = [
    {
        key: 'serialNumber',
        title: 'N° Serie',
        width: 'w-[70px]'
    },
    {
        key: 'qrCode',
        title: 'QR',
        width: 'w-[70px]'
    },
    {
        key: 'model',
        title: 'Modelo',
        width: 'w-[140px]'
    },
    {
        key: 'status',
        title: 'Estado',
        width: 'w-[100px]'
    },
    {
        key: 'institution',
        title: 'Institución',
        width: 'w-[130px]'
    },
    {
        key: 'service',
        title: 'Servicio',
        width: 'w-[110px]'
    },
    {
        key: 'inventoryDate',
        title: 'Fecha Inventario',
        width: 'w-[100px]'
    },
    {
        key: 'lastMaintenanceDate',
        title: 'Último Mantto',
        width: 'w-[100px]'
    },
    {
        key: 'inventoryManager',
        title: 'Responsable',
        width: 'w-[100px]'
    },
    {
        key: 'actions',
        title: 'Acciones',
        width: 'w-[80px]',
        isCenter: true,
        hasBorder: false
    }
];

// Configuración de campos para vista móvil
export interface MobileFieldConfig {
    key: keyof import('../../../../../types').Pump | 'inventoryDate' | 'lastMaintenanceDate';
    label: string;
    isMono?: boolean;
    isDate?: boolean;
}

export const MOBILE_FIELDS: MobileFieldConfig[] = [
    {
        key: 'qrCode',
        label: 'Código QR',
        isMono: true
    },
    {
        key: 'institution',
        label: 'Institución'
    },
    {
        key: 'service',
        label: 'Servicio'
    },
    {
        key: 'inventoryManager',
        label: 'Responsable'
    },
    {
        key: 'inventoryDate',
        label: 'Fecha Inventario',
        isDate: true
    },
    {
        key: 'lastMaintenanceDate',
        label: 'Último Mantenimiento',
        isDate: true
    }
];
