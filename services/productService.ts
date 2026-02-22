import { query } from './database';
import { Product } from '../types';

/**
 * Get all products from database
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    return result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x || 0, row.position_y || 0, row.position_z || 0] as [number, number, number],
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Get first 3 products for 3D display
 */
export const getDisplayProducts = async (): Promise<Product[]> => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC LIMIT 3');
    return result.rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x || 0, row.position_y || 0, row.position_z || 0] as [number, number, number],
    }));
  } catch (error) {
    console.error('Error fetching display products:', error);
    return [];
  }
};

/**
 * Add a new product
 */
export const addProduct = async (product: Product): Promise<Product | null> => {
  try {
    const result = await query(
      `INSERT INTO products (name, description, price, category, image_url, sizes, colors, position_x, position_y, position_z)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.imageUrl,
        product.sizes,
        product.colors,
        product.position[0],
        product.position[1],
        product.position[2],
      ]
    );
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x, row.position_y, row.position_z],
    };
  } catch (error) {
    console.error('Error adding product:', error);
    return null;
  }
};

/**
 * Update a product
 */
export const updateProduct = async (product: Product): Promise<Product | null> => {
  try {
    const result = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, image_url = $5, sizes = $6, colors = $7, position_x = $8, position_y = $9, position_z = $10, updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.imageUrl,
        product.sizes,
        product.colors,
        product.position[0],
        product.position[1],
        product.position[2],
        parseInt(product.id),
      ]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    return {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: row.image_url,
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x, row.position_y, row.position_z],
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const result = await query('DELETE FROM products WHERE id = $1', [parseInt(id)]);
    return result.rowCount ? result.rowCount > 0 : false;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};
