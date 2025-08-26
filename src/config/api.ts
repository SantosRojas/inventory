export const API_BASE = 'http://192.168.1.121:4000';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    verify: `${API_BASE}/auth/me`,
  },
  users: {
    getAll: `${API_BASE}/users`,
    getFilteredUsers:`${API_BASE}/users/filtered`,
    create: `${API_BASE}/users`,
    profile: `${API_BASE}/users/profile`,
    getById: (id: number) => `${API_BASE}/users/${id}`,
    update: (id: number) => `${API_BASE}/users/${id}`,
    delete: (id: number) => `${API_BASE}/users/${id}`,
  },
  roles: {
    getAll: `${API_BASE}/roles`,
  },
  pumps: {
    getAll: `${API_BASE}/inventory`,
    create: `${API_BASE}/inventory`,
    getById: (id: number) => `${API_BASE}/inventory/${id}`,
    getBySerialNumber:(serialNumber:string) => `${API_BASE}/inventory/serial/${serialNumber}`,
    getByQRcode : (qrCode: string)=> `${API_BASE}/inventory/qr/${qrCode}`,
    update: (id: number) => `${API_BASE}/inventory/${id}`,
    delete: (id: number) => `${API_BASE}/inventory/${id}`,
    getByInventoryTaker: (userId: number) => `${API_BASE}/inventory/inventory-taker/${userId}`,
    getByInstitutionId: (institutionId: number) => `${API_BASE}/inventory/institution/${institutionId}`,
    getByServiceId: (serviceId: number) => `${API_BASE}/inventory/service/${serviceId}`,
    getThisYearByInstitutionId: (institutionId: number) =>
        `${API_BASE}/inventory/current-year/${institutionId}`,
    getNotThisYearByInstitutionId: (institutionId: number) =>
        `${API_BASE}/inventory/not-inventoried/${institutionId}`,
    getOverdueMaintenanceByInstitutionId: (institutionId: number) =>
        `${API_BASE}/inventory/overdue-maintenance-by-institution/${institutionId}`,
    getByServiceIdAndInstitutionId: (serviceId: number, institutionId: number) =>
        `${API_BASE}/inventory/institution/${institutionId}/service/${serviceId}`,
    getLastInventories: (limit: number) =>
        `${API_BASE}/inventory/latest?limit=${limit}`,
  },
  pumpModels: {
    getAll: `${API_BASE}/models`,
  },
  models: {
    getAll: `${API_BASE}/models`,
    create: `${API_BASE}/models`,
    getById: (id: number) => `${API_BASE}/models/${id}`,
    update: (id: number) => `${API_BASE}/models/${id}`,
    delete: (id: number) => `${API_BASE}/models/${id}`,
  },
  institutions: {
    getAll: `${API_BASE}/institutions`,
    create: `${API_BASE}/institutions`,
    getById: (id: number) => `${API_BASE}/institutions/${id}`,
    update: (id: number) => `${API_BASE}/institutions/${id}`,
    delete: (id: number) => `${API_BASE}/institutions/${id}`,
  },
  services: {
    getAll: `${API_BASE}/services`,
    create: `${API_BASE}/services`,
    getById: (id: number) => `${API_BASE}/services/${id}`,
    update: (id: number) => `${API_BASE}/services/${id}`,
    delete: (id: number) => `${API_BASE}/services/${id}`,
  },
  dashboard: {
    summary: (userId: number) => `${API_BASE}/dashboard/summary/${userId}`,
    modelDistribution: (userId: number) => `${API_BASE}/dashboard/model-distribution/${userId}`,
    modelDistributionByInstitution: (userId: number) =>
        `${API_BASE}/dashboard/model-distribution/by-institution/${userId}`,
    inventoryProgressByInstitution: (userId: number) =>
        `${API_BASE}/dashboard/inventory-progress/by-institution/${userId}`,
    inventoryProgressByService: (userId: number) =>
        `${API_BASE}/dashboard/inventory-progress/by-service/${userId}`,
    topInventoryTakers: (userId: number) =>
        `${API_BASE}/dashboard/top-inventory-takers/${userId}`,
    overdueMaintenance: () => `${API_BASE}/dashboard/overdue-maintenance/by-institution`,
  },
};
