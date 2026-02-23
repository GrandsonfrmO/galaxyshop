import { useState, useCallback } from 'react';
import {
  fetchAllOrders,
  fetchOrderById,
  updateOrderStatusAPI,
  fetchDashboardStats,
  fetchRecentOrders,
  fetchEmailLogs
} from '../services/adminService';

interface UseAdminAPIState {
  loading: boolean;
  error: Error | null;
  data: any;
}

/**
 * Hook pour gérer les appels API Admin
 */
export const useAdminAPI = () => {
  const [state, setState] = useState<UseAdminAPIState>({
    loading: false,
    error: null,
    data: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  // Commandes
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await fetchAllOrders();
      setData(orders);
      return orders;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOrderById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const order = await fetchOrderById(id);
      setData(order);
      return order;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: number, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const order = await updateOrderStatusAPI(id, status);
      setData(order);
      return order;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Dashboard
  const loadDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await fetchDashboardStats();
      setData(stats);
      return stats;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecentOrdersList = useCallback(async (limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const orders = await fetchRecentOrders(limit);
      setData(orders);
      return orders;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Email Logs
  const loadEmailLogsList = useCallback(async (limit: number = 50) => {
    setLoading(true);
    setError(null);
    try {
      const logs = await fetchEmailLogs(limit);
      setData(logs);
      return logs;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ...state,
    // Commandes
    loadOrders,
    loadOrderById,
    updateOrderStatus,
    // Dashboard
    loadDashboardStats,
    loadRecentOrdersList,
    // Email Logs
    loadEmailLogsList
  };
};
