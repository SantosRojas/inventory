import { API_ENDPOINTS } from '../../../config';
import { getHeaders } from '../../../utils/headersUtil';
import type { DashboardInventoryItem } from '../../../utils/downloadUtil';

/**
 * Servicio para descargar datos de inventario del dashboard
 */
class DashboardService {
  /**
   * Descarga todas las bombas de una institución
   */
  async downloadInventoryTotal(institutionId: number, token: string): Promise<DashboardInventoryItem[]> {
    try {
      const response = await fetch(
        API_ENDPOINTS.pumps.getByInstitutionId(institutionId),
        {
          headers: getHeaders(token),
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario total');
      }

      // Transformar los datos al formato esperado por la utilidad de descarga
      const pumps = json.data || [];
      return this.transformPumpsToInventoryItems(pumps);
    } catch (error) {
      console.error('❌ Error downloading total inventory:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas inventariadas este año de una institución
   */
  async downloadInventoryCurrentYear(institutionId: number, token: string): Promise<DashboardInventoryItem[]> {
    try {
      const response = await fetch(
        API_ENDPOINTS.pumps.getThisYearByInstitutionId(institutionId),
        {
          headers: getHeaders(token),
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario del año actual');
      }

      const pumps = json.data || [];
      return this.transformPumpsToInventoryItems(pumps);
    } catch (error) {
      console.error('❌ Error downloading current year inventory:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas no inventariadas este año de una institución
   */
  async downloadInventoryNotInventoried(institutionId: number, token: string): Promise<DashboardInventoryItem[]> {
    try {
      const response = await fetch(
        API_ENDPOINTS.pumps.getNotThisYearByInstitutionId(institutionId),
        {
          headers: getHeaders(token),
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar bombas no inventariadas');
      }

      const pumps = json.data || [];
      return this.transformPumpsToInventoryItems(pumps);
    } catch (error) {
      console.error('❌ Error downloading not inventoried items:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas con mantenimiento vencido de una institución
   */
  async downloadOverdueMaintenance(institutionId: number, token: string): Promise<DashboardInventoryItem[]> {
    try {
      const response = await fetch(
        API_ENDPOINTS.pumps.getOverdueMaintenanceByInstitutionId(institutionId),
        {
          headers: getHeaders(token),
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar bombas con mantenimiento vencido');
      }

      const pumps = json.data || [];
      return this.transformPumpsToInventoryItems(pumps);
    } catch (error) {
      console.error('❌ Error downloading overdue maintenance items:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas de un servicio específico en una institución
   */
  async downloadServiceInventory(serviceId: number, institutionId: number, token: string): Promise<DashboardInventoryItem[]> {
    try {
      const response = await fetch(
        API_ENDPOINTS.pumps.getByServiceIdAndInstitutionId(serviceId, institutionId),
        {
          headers: getHeaders(token),
        }
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario del servicio');
      }

      const pumps = json.data || [];
      return this.transformPumpsToInventoryItems(pumps);
    } catch (error) {
      console.error('❌ Error downloading service inventory:', error);
      throw error;
    }
  }

  /**
   * Transforma los datos de bombas al formato esperado por la utilidad de descarga
   */
  private transformPumpsToInventoryItems(pumps: any[]): DashboardInventoryItem[] {
    return pumps.map(pump => ({
      id: pump.id || 0,
      serialNumber: pump.serialNumber || 'Sin serie',
      qrCode: pump.qrCode || 'Sin QR',
      inventoryDate: pump.inventoryDate || '',
      status: pump.status || 'Sin estado',
      lastMaintenanceDate: pump.lastMaintenanceDate || '',
      createdAt: pump.createdAt || '',
      model: pump.model?.name || pump.model || 'Sin modelo',
      institution: pump.institution?.name || pump.institution || 'Sin institución',
      service: pump.service?.name || pump.service || 'Sin servicio',
      inventoryManager: pump.inventoryManager || 'Sin responsable',
    }));
  }
}

// Exportar instancia singleton
export const dashboardService = new DashboardService();
export default dashboardService;
