import { API_ENDPOINTS } from '../../../config';
import { fetchWithAuth } from '../../../services/fetchWithAuth';
import type { Pump } from '../../../types';
/**
 * Servicio para descargar datos de inventario del dashboard
 */
class DownloadService {
  /**
   * Descarga todas las bombas de una institución
   */
  async downloadInventoryTotal(institutionId: number): Promise<Pump[]> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.pumps.getByInstitutionId(institutionId)
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario total');
      }

      // Transformar los datos al formato esperado por la utilidad de descarga
      const pumps = json.data || [];
      return pumps;
    } catch (error) {
      console.error('❌ Error downloading total inventory:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas inventariadas este año de una institución
   */
  async downloadInventoryCurrentYear(institutionId: number): Promise<Pump[]> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.pumps.getThisYearByInstitutionId(institutionId)
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario del año actual');
      }

      const pumps = json.data || [];
      return pumps;
    } catch (error) {
      console.error('❌ Error downloading current year inventory:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas no inventariadas este año de una institución
   */
  async downloadInventoryNotInventoried(institutionId: number): Promise<Pump[]> {
    try {
      const response = await fetchWithAuth(API_ENDPOINTS.pumps.getNotThisYearByInstitutionId(institutionId));

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar bombas no inventariadas');
      }

      const pumps = json.data || [];
      return pumps;
    } catch (error) {
      console.error('❌ Error downloading not inventoried items:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas con mantenimiento vencido de una institución
   */
  async downloadOverdueMaintenance(institutionId: number): Promise<Pump[]> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.pumps.getOverdueMaintenanceByInstitutionId(institutionId));

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar bombas con mantenimiento vencido');
      }

      const pumps = json.data || [];
      return pumps;
    } catch (error) {
      console.error('❌ Error downloading overdue maintenance items:', error);
      throw error;
    }
  }

  /**
   * Descarga las bombas de un servicio específico en una institución
   */
  async downloadServiceInventory(serviceId: number, institutionId: number): Promise<Pump[]> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.pumps.getByServiceIdAndInstitutionId(serviceId, institutionId)
      );

      const json = await response.json();

      if (!response.ok || json.success === false) {
        throw new Error(json.message || json.error || 'Error al descargar inventario del servicio');
      }

      const pumps = json.data || [];
      return pumps;
    } catch (error) {
      console.error('❌ Error downloading service inventory:', error);
      throw error;
    }
  }

}

// Exportar instancia singleton
export const downloadService = new DownloadService();
export default downloadService;
