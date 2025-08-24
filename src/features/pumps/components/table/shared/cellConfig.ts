import type { Pump } from '../../../../../types';

// Configuración de mapeo de columnas a propiedades de celda
export interface CellConfig {
    type: 'text' | 'status' | 'actions';
    textProps?: {
        fontWeight?: 'normal' | 'medium' | 'semibold';
        textColor?: 'gray-900' | 'gray-600';
    };
    getValue?: (item: Pump, formatDate?: (date: string) => string) => string;
}

export const CELL_CONFIG_MAP: Record<string, CellConfig> = {
    serialNumber: {
        type: 'text',
        textProps: { fontWeight: 'semibold' },
        getValue: (item) => item.serialNumber
    },
    qrCode: {
        type: 'text',
        textProps: { fontWeight: 'semibold' },
        getValue: (item) => item.qrCode
    },
    model: {
        type: 'text',
        textProps: { fontWeight: 'medium' },
        getValue: (item) => item.model
    },
    status: {
        type: 'status',
        getValue: (item) => item.status
    },
    institution: {
        type: 'text',
        getValue: (item) => item.institution
    },
    service: {
        type: 'text',
        getValue: (item) => item.service
    },
    manufactureDate: {
        type: 'text',
        textProps: { textColor: 'gray-600' },
        getValue: (item, formatDate) => formatDate!(item.manufactureDate || "")
    },
    inventoryDate: {
        type: 'text',
        textProps: { textColor: 'gray-600' },
        getValue: (item, formatDate) => formatDate!(item.inventoryDate)
    },
    lastMaintenanceDate: {
        type: 'text',
        textProps: { textColor: 'gray-600' },
        getValue: (item, formatDate) => formatDate!(item.lastMaintenanceDate || "")
    },
    inventoryManager: {
        type: 'text',
        getValue: (item) => item.inventoryManager
    },
    actions: {
        type: 'actions',
        getValue: () => ''
    }
};
