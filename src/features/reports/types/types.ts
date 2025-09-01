// === INVENTORY PROGRESS BY SERVICE ENDPOINT ===
export interface ServiceProgress {
  serviceId: number;
  serviceName: string;
  pumpsInventoriedThisYear: number;
  totalPumps: number;
}

export interface InstitutionProgress {
  institutionId: number;
  institutionName: string;
  services: ServiceProgress[];
}

export interface InstitutionProgressWithTotals extends InstitutionProgress {
  totalItems: number;
  inventoriedItems: number;
}

export interface InventoryProgressByServiceResponse {
  institutions: InstitutionProgress[];
}