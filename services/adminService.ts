const API_BASE = '/api/admin';

/**
 * Get all orders (admin)
 */
export const fetchAllOrders = async () => {
  try {
    const response = await fetch(`${API_BASE}/orders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Get order by ID (admin)
 */
export const fetchOrderById = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

/**
 * Update order status (admin)
 */
export const updateOrderStatusAPI = async (id: number, status: string) => {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

/**
 * Get dashboard statistics (admin)
 */
export const fetchDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE}/dashboard/stats`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Get recent orders (admin)
 */
export const fetchRecentOrders = async (limit: number = 10) => {
  try {
    const response = await fetch(`${API_BASE}/dashboard/recent-orders?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch recent orders: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

/**
 * Get email logs (admin)
 */
export const fetchEmailLogs = async (limit: number = 50) => {
  try {
    const response = await fetch(`${API_BASE}/email-logs?limit=${limit}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch email logs: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching email logs:', error);
    throw error;
  }
};


