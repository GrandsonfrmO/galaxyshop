import { Product } from '../types';

const API_BASE = 'http://localhost:5000/api';

/**
 * Fetch all products from the server
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
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
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to create product');
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
    const response = await fetch(`${API_BASE}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!response.ok) throw new Error('Failed to update product');
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
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
