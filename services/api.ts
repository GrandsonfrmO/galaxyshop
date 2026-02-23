import { Product } from '../types';

// Use relative URL for API calls (works in both dev and production)
const API_BASE = '/api';

// CSRF token storage
let csrfToken: string | null = null;

/**
 * Get CSRF token from server
 */
const getCSRFToken = async (): Promise<string> => {
  if (csrfToken) return csrfToken;
  
  try {
    const response = await fetch(`${API_BASE}/products`);
    const token = response.headers.get('X-CSRF-Token');
    if (token) {
      csrfToken = token;
      return token;
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
  
  return '';
};

/**
 * Fetch all products from the server
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    
    // Store CSRF token from response
    const token = response.headers.get('X-CSRF-Token');
    if (token) csrfToken = token;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Fetch display products (first 3)
 */
export const fetchDisplayProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE}/products/display`);
    if (!response.ok) throw new Error('Failed to fetch display products');
    
    // Store CSRF token from response
    const token = response.headers.get('X-CSRF-Token');
    if (token) csrfToken = token;
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching display products:', error);
    return [];
  }
};

/**
 * Add a new product
 */
export const createProduct = async (product: Product): Promise<Product | null> => {
  try {
    const token = await getCSRFToken();
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }
    
    // Invalidate token after use
    csrfToken = null;
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
};

/**
 * Update a product
 */
export const updateProductAPI = async (product: Product): Promise<Product | null> => {
  try {
    const token = await getCSRFToken();
    const response = await fetch(`${API_BASE}/products/${product.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-CSRF-Token': token,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    
    // Invalidate token after use
    csrfToken = null;
    
    return await response.json();
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

/**
 * Delete a product
 */
export const deleteProductAPI = async (id: string): Promise<boolean> => {
  try {
    const token = await getCSRFToken();
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': token,
      },
    });
    
    // Invalidate token after use
    csrfToken = null;
    
    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
