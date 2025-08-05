import { z } from 'zod';

export const bombaSchema = z.object({
    serialNumber: z.string().min(1, 'El número de serie es requerido'),
    qrCode: z.string().min(1, 'El código QR es requerido'),
    modelId: z.number().min(1, 'Debe seleccionar un modelo'),
    institutionId: z.number().min(1, 'Debe seleccionar una institución'),
    serviceId: z.number().min(1, 'Debe seleccionar un servicio'),
    status: z.enum(['Operativo', 'Inoperativo']),
    lastMaintenanceDate: z.string().optional().or(z.literal('')),
});

export type BombaSchemaType = z.infer<typeof bombaSchema>;
