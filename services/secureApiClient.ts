/**
 * Secure API Client
 * Handles API calls with proper authentication headers
 */

/**
 * Send email via internal API
 * Requires INTERNAL_API_KEY environment variable
 */
export async function sendEmailViaAPI(
  endpoint: string,
  data: Record<string, any>
): Promise<any> {
  const internalKey = process.env.INTERNAL_API_KEY;

  if (!internalKey) {
    throw new Error('INTERNAL_API_KEY not set in environment variables');
  }

  const response = await fetch(`/api/email/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': internalKey,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Email API error: ${error.error}`);
  }

  return response.json();
}

/**
 * Call admin API endpoint
 * Requires ADMIN_API_KEY environment variable
 */
export async function callAdminAPI(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  data?: Record<string, any>
): Promise<any> {
  const adminKey = process.env.ADMIN_API_KEY;

  if (!adminKey) {
    throw new Error('ADMIN_API_KEY not set in environment variables');
  }

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminKey}`,
    },
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`/api/admin${endpoint}`, options);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Admin API error: ${error.error}`);
  }

  return response.json();
}

/**
 * Get all products (admin)
 */
export async function getAdminProducts(): Promise<any[]> {
  return callAdminAPI('/products', 'GET');
}

/**
 * Create product (admin)
 */
export async function createAdminProduct(product: any): Promise<any> {
  return callAdminAPI('/products', 'POST', product);
}

/**
 * Update product (admin)
 */
export async function updateAdminProduct(product: any): Promise<any> {
  return callAdminAPI('/products', 'PUT', product);
}

/**
 * Delete product (admin)
 */
export async function deleteAdminProduct(id: string): Promise<any> {
  return callAdminAPI(`/products/${id}`, 'DELETE');
}

/**
 * Get all orders (admin)
 */
export async function getAdminOrders(): Promise<any[]> {
  return callAdminAPI('/orders', 'GET');
}

/**
 * Get order by ID (admin)
 */
export async function getAdminOrder(id: number): Promise<any> {
  return callAdminAPI(`/orders/${id}`, 'GET');
}

/**
 * Update order status (admin)
 */
export async function updateAdminOrderStatus(id: number, status: string): Promise<any> {
  return callAdminAPI(`/orders/${id}/status`, 'PATCH', { status });
}

/**
 * Get dashboard stats (admin)
 */
export async function getAdminDashboardStats(): Promise<any> {
  return callAdminAPI('/dashboard/stats', 'GET');
}

/**
 * Get recent orders (admin)
 */
export async function getAdminRecentOrders(limit: number = 10): Promise<any[]> {
  return callAdminAPI(`/dashboard/recent-orders?limit=${limit}`, 'GET');
}

/**
 * Get email logs (admin)
 */
export async function getAdminEmailLogs(limit: number = 50): Promise<any[]> {
  return callAdminAPI(`/email-logs?limit=${limit}`, 'GET');
}

/**
 * Get delivery zones (admin)
 */
export async function getAdminDeliveryZones(): Promise<any[]> {
  return callAdminAPI('/delivery-zones', 'GET');
}

/**
 * Create delivery zone (admin)
 */
export async function createAdminDeliveryZone(name: string, price: number): Promise<any> {
  return callAdminAPI('/delivery-zones', 'POST', { name, price });
}

/**
 * Update delivery zone (admin)
 */
export async function updateAdminDeliveryZone(id: string, name: string, price: number): Promise<any> {
  return callAdminAPI(`/delivery-zones/${id}`, 'PUT', { name, price });
}

/**
 * Delete delivery zone (admin)
 */
export async function deleteAdminDeliveryZone(id: string): Promise<any> {
  return callAdminAPI(`/delivery-zones/${id}`, 'DELETE');
}

/**
 * Get PWA settings (admin)
 */
export async function getAdminPWASettings(): Promise<any> {
  return callAdminAPI('/pwa/settings', 'GET');
}

/**
 * Update PWA settings (admin)
 */
export async function updateAdminPWASettings(settings: any): Promise<any> {
  return callAdminAPI('/pwa/settings', 'POST', settings);
}

/**
 * Get PWA icons (admin)
 */
export async function getAdminPWAIcons(): Promise<any> {
  return callAdminAPI('/pwa/icons', 'GET');
}

/**
 * Update PWA icons (admin)
 */
export async function updateAdminPWAIcons(icons: any): Promise<any> {
  return callAdminAPI('/pwa/icons', 'POST', icons);
}
