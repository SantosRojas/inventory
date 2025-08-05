// 📊 Tipos para Dashboard - Nueva arquitectura con 9 endpoints especializados

// === SUMMARY ENDPOINT ===
export interface SummaryResponse {
  totalPumps: number;
  inventoriedPumpsThisYear: number;
  operativePumps: number;
  overduePumpsMaintenance: number;
  adminData?: {
    totalInventoryTakers: number;
    totalInstitutions: number;
  };
}

// === MODEL DISTRIBUTION ENDPOINT ===
export interface ModelDistributionResponse {
  models: Array<{
    modelName: string;
    count: number;
  }>;
}

// === MODEL DISTRIBUTION BY INSTITUTION ENDPOINT ===
export interface ModelDistributionByInstitutionResponse {
  totalPumps: number;
  models: string[];
  data: Array<{
    institutionName: string;
    total: number;
    [modelName: string]: number | string;
  }>;
}


// === INVENTORY PROGRESS BY INSTITUTION ENDPOINT ===
export interface InventoryProgressByInstitutionResponse {
  institutions: Array<{
    institutionName: string;
    pumpsInventoriedThisYear: number;
    totalPumps: number;
  }>;
}

// === INVENTORY PROGRESS BY SERVICE ENDPOINT ===
export interface InventoryProgressByServiceResponse {
  institutions: Array<{
    institutionId: number;
    institutionName: string;
    services: Array<{
      serviceId: number;
      serviceName: string;
      pumpsInventoriedThisYear: number;
      totalPumps: number;
    }>;
  }>;
}

// === TOP INVENTORY TAKERS ENDPOINT ===
export interface TopInventoryTakersResponse {
  topInventoryTakers: Array<{
    userId: number;
    inventoryTakerName: string;
    pumpsInventoriedThisYear: number;
  }>;
  year: number;
}

// === OVERDUE MAINTENANCE ENDPOINT ===
export interface OverdueMaintenanceResponse {
  institutions: Array<{
    institutionName: string;
    overdueMaintenanceCount: number;
  }>;
}


// === STATE BY SERVICE ENDPOINT ===
export interface StateByServiceResponse {
  institutions: Array<{
    institutionId: number;
    institutionName: string;
    services: Array<{
      serviceId: number;
      serviceName: string;
      inoperativePumpsCount: number;
      totalPumps: number;
    }>;
  }>;
}

// === STATE BY MODEL ENDPOINT ===
export interface StateByModelResponse {
  models: Array<{
    modelName: string;
    inoperativePumps: number;
    totalPumps: number;
  }>;
}

// === DOWNLOAD ENDPOINTS ===
export interface InventoryDownloadItem {
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

export type InventoryDownloadResponse = InventoryDownloadItem[];

// === DASHBOARD DATA CONSOLIDADO ===
export interface DashboardData {
  summary: SummaryResponse;
  modelDistribution: ModelDistributionResponse;
  modelDistributionByInstitution: ModelDistributionByInstitutionResponse;
  inventoryProgressByInstitution: InventoryProgressByInstitutionResponse;
  inventoryProgressByService: InventoryProgressByServiceResponse;
  topInventoryTakers: TopInventoryTakersResponse;
  overdueMaintenance: OverdueMaintenanceResponse;
  stateByService: StateByServiceResponse;
  stateByModel: StateByModelResponse;

  // Metadatos
  isAdmin: boolean;
  userId: number;
  loadedAt: string;
}

// === TIPOS PARA HOOK ===
export interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
