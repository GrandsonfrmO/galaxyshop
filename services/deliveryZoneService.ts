import { DeliveryZone } from '../types';

const API_BASE = '/api/admin';

/**
 * Fetch all delivery zones from the server
 */
export const fetchDeliveryZones = async (): Promise<DeliveryZone[]> => {
  try {
    const response = await fetch(`${API_BASE}/delivery-zones`);
    if (!response.ok) {
      throw new Error(`Failed to fetch delivery zones: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    throw error;
  }
};

/**
 * Create a new delivery zone
 */
export const createDeliveryZone = async (zone: DeliveryZone): Promise<DeliveryZone> => {
  try {
    const response = await fetch(`${API_BASE}/delivery-zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: zone.name, price: zone.price })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create delivery zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating delivery zone:', error);
    throw error;
  }
};

/**
 * Update an existing delivery zone
 */
export const updateDeliveryZoneAPI = async (zone: DeliveryZone): Promise<DeliveryZone> => {
  try {
    const response = await fetch(`${API_BASE}/delivery-zones/${zone.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: zone.name, price: zone.price })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update delivery zone: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating delivery zone:', error);
    throw error;
  }
};

/**
 * Delete a delivery zone
 */
export const deleteDeliveryZoneAPI = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE}/delivery-zones/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete delivery zone: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting delivery zone:', error);
    throw error;
  }
};
