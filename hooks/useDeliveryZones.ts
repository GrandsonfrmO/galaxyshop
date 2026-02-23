import { useState, useCallback } from 'react';
import { DeliveryZone } from '../types';
import {
  fetchDeliveryZones,
  createDeliveryZone,
  updateDeliveryZoneAPI,
  deleteDeliveryZoneAPI
} from '../services/deliveryZoneService';

interface UseDeliveryZonesState {
  zones: DeliveryZone[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour gérer les zones de livraison
 */
export const useDeliveryZones = () => {
  const [state, setState] = useState<UseDeliveryZonesState>({
    zones: [],
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setZones = useCallback((zones: DeliveryZone[] | ((prev: DeliveryZone[]) => DeliveryZone[])) => {
    setState(prev => ({ 
      ...prev, 
      zones: typeof zones === 'function' ? zones(prev.zones) : zones 
    }));
  }, []);

  // Charger toutes les zones
  const loadZones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const zones = await fetchDeliveryZones();
      setZones(zones);
      return zones;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une zone
  const createZone = useCallback(async (zone: DeliveryZone) => {
    setLoading(true);
    setError(null);
    try {
      const newZone = await createDeliveryZone(zone);
      setZones((prev: DeliveryZone[]) => [...prev, newZone]);
      return newZone;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour une zone
  const updateZone = useCallback(async (zone: DeliveryZone) => {
    setLoading(true);
    setError(null);
    try {
      const updatedZone = await updateDeliveryZoneAPI(zone);
      setZones((prev: DeliveryZone[]) => prev.map(z => z.id === zone.id ? updatedZone : z));
      return updatedZone;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une zone
  const deleteZone = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDeliveryZoneAPI(id);
      setZones((prev: DeliveryZone[]) => prev.filter(z => z.id !== id));
      return true;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    zones: state.zones,
    loading: state.loading,
    error: state.error,
    loadZones,
    createZone,
    updateZone,
    deleteZone
  };
};
