import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../../../config';
import { getHeaders } from '../../../utils/headersUtil';
import { useAuthStore } from '../../auth/store/store';
import type { Pump } from '../../../types';

export const useLatestInventories = () => {
  const [latestInventories, setLatestInventories] = useState<Pump[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const { token } = useAuthStore();

  const fetchLatestInventories = useCallback(async (requestedLimit: number) => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.pumps.getLastInventories(requestedLimit), {
        headers: getHeaders(token),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || data.error || 'Error al cargar últimos inventarios');
      }

      setLatestInventories(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('❌ Error fetching latest inventories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateLimit = useCallback((newLimit: number) => {
    if (newLimit > 0 && newLimit <= 100) { // Validación de límites razonables
      setLimit(newLimit);
    }
  }, []);

  const refreshLatestInventories = useCallback(() => {
    fetchLatestInventories(limit);
  }, [fetchLatestInventories, limit]);

  // Cargar datos iniciales solamente
  useEffect(() => {
    fetchLatestInventories(limit);
  }, [fetchLatestInventories]); // Removido 'limit' de las dependencias

  return {
    latestInventories,
    isLoading,
    error,
    limit,
    updateLimit,
    refreshLatestInventories,
  };
};
