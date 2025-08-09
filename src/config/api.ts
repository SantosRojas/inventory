export const API_BASE = 'http://localhost:3001';

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
    verify: `${API_BASE}/auth/me`,
  },
  users: {
    getAll: `${API_BASE}/users`,
    create: `${API_BASE}/users`,
    profile: `${API_BASE}/users/profile`,
    getById: (id: number) => `${API_BASE}/users/${id}`,
    update: (id: number) => `${API_BASE}/users/${id}`,
    delete: (id: number) => `${API_BASE}/users/${id}`,
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
  },
  pumpModels: {
    getAll: `${API_BASE}/models`,
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
