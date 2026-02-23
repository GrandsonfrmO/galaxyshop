import { query } from './database';
import { Product, ProductImage } from '../types';

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'created_at';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get images for a product
 */
const getProductImages = async (productId: string): Promise<ProductImage[]> => {
  try {
    const result = await query(
      'SELECT image_url, alt_text, display_order FROM product_images WHERE product_id = $1 ORDER BY display_order ASC',
      [parseInt(productId)]
    );
    return result.rows.map(row => ({
      url: row.image_url,
      alt: row.alt_text || '',
      order: row.display_order,
    }));
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
};

/**
 * Get all products from database
 */
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC');
    const products = await Promise.all(
      result.rows.map(async row => {
        const images = await getProductImages(row.id.toString());
        return {
          id: row.id.toString(),
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          imageUrl: images.length > 0 ? images[0].url : row.image_url,
          images: images.length > 0 ? images : [],
          sizes: row.sizes || [],
          colors: row.colors || [],
          position: [row.position_x || 0, row.position_y || 0, row.position_z || 0] as [number, number, number],
          stock: row.stock || 0,
        };
      })
    );
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

/**
 * Search and filter products
 */
export const searchProducts = async (filters: ProductFilters): Promise<Product[]> => {
  try {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    // Search by name or description
    if (filters.search) {
      sql += ` AND (LOWER(name) LIKE $${paramIndex} OR LOWER(description) LIKE $${paramIndex})`;
      params.push(`%${filters.search.toLowerCase()}%`);
      paramIndex++;
    }

    // Filter by category
    if (filters.category) {
      sql += ` AND category = $${paramIndex}`;
      params.push(filters.category);
      paramIndex++;
    }

    // Filter by minimum price
    if (filters.minPrice !== undefined) {
      sql += ` AND price >= $${paramIndex}`;
      params.push(filters.minPrice);
      paramIndex++;
    }

    // Filter by maximum price
    if (filters.maxPrice !== undefined) {
      sql += ` AND price <= $${paramIndex}`;
      params.push(filters.maxPrice);
      paramIndex++;
    }

    // Sorting
    const sortBy = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder || 'desc';
    sql += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;

    const result = await query(sql, params);
    const products = await Promise.all(
      result.rows.map(async row => {
        const images = await getProductImages(row.id.toString());
        return {
          id: row.id.toString(),
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          imageUrl: images.length > 0 ? images[0].url : row.image_url,
          images: images.length > 0 ? images : [],
          sizes: row.sizes || [],
          colors: row.colors || [],
          position: [row.position_x || 0, row.position_y || 0, row.position_z || 0] as [number, number, number],
          stock: row.stock || 0,
        };
      })
    );
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

/**
 * Get all unique categories
 */
export const getCategories = async (): Promise<string[]> => {
  try {
    const result = await query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category');
    return result.rows.map(row => row.category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

/**
 * Get first 3 products for 3D display
 */
export const getDisplayProducts = async (): Promise<Product[]> => {
  try {
    const result = await query('SELECT * FROM products ORDER BY created_at DESC LIMIT 3');
    const products = await Promise.all(
      result.rows.map(async row => {
        const images = await getProductImages(row.id.toString());
        return {
          id: row.id.toString(),
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          imageUrl: images.length > 0 ? images[0].url : row.image_url,
          images: images.length > 0 ? images : [],
          sizes: row.sizes || [],
          colors: row.colors || [],
          position: [row.position_x || 0, row.position_y || 0, row.position_z || 0] as [number, number, number],
          stock: row.stock || 0,
        };
      })
    );
    return products;
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
    // Default position if not provided
    const position = product.position || [0, 0, 0];
    
    const result = await query(
      `INSERT INTO products (name, description, price, category, image_url, sizes, colors, position_x, position_y, position_z, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.imageUrl,
        product.sizes || [],
        product.colors || [],
        position[0],
        position[1],
        position[2],
        product.stock || 0,
      ]
    );
    
    const row = result.rows[0];
    const productId = row.id.toString();
    
    // Add product images if provided
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        await query(
          'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES ($1, $2, $3, $4)',
          [parseInt(productId), img.url, img.alt || product.name, img.order]
        );
      }
    } else if (product.imageUrl) {
      // Backward compatibility: add main image to product_images
      await query(
        'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES ($1, $2, $3, $4)',
        [parseInt(productId), product.imageUrl, product.name, 0]
      );
    }
    
    const images = await getProductImages(productId);
    return {
      id: productId,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: images.length > 0 ? images[0].url : row.image_url,
      images: images.length > 0 ? images : [],
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x, row.position_y, row.position_z],
      stock: row.stock || 0,
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
    // Default position if not provided
    const position = product.position || [0, 0, 0];
    
    const result = await query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, category = $4, image_url = $5, sizes = $6, colors = $7, position_x = $8, position_y = $9, position_z = $10, stock = $11, updated_at = NOW()
       WHERE id = $12
       RETURNING *`,
      [
        product.name,
        product.description,
        product.price,
        product.category,
        product.imageUrl,
        product.sizes || [],
        product.colors || [],
        position[0],
        position[1],
        position[2],
        product.stock || 0,
        parseInt(product.id),
      ]
    );
    
    if (result.rows.length === 0) return null;
    
    const row = result.rows[0];
    const productId = row.id.toString();
    
    // Update product images
    if (product.images && product.images.length > 0) {
      // Delete existing images
      await query('DELETE FROM product_images WHERE product_id = $1', [parseInt(productId)]);
      
      // Add new images
      for (const img of product.images) {
        await query(
          'INSERT INTO product_images (product_id, image_url, alt_text, display_order) VALUES ($1, $2, $3, $4)',
          [parseInt(productId), img.url, img.alt || product.name, img.order]
        );
      }
    }
    
    const images = await getProductImages(productId);
    return {
      id: productId,
      name: row.name,
      description: row.description,
      price: row.price,
      category: row.category,
      imageUrl: images.length > 0 ? images[0].url : row.image_url,
      images: images.length > 0 ? images : [],
      sizes: row.sizes || [],
      colors: row.colors || [],
      position: [row.position_x, row.position_y, row.position_z],
      stock: row.stock || 0,
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
};

/**
 * Delete a product
 * First checks if product is referenced in orders, if so, marks as deleted instead of hard delete
 */
export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    // Check if product is referenced in order_items
    const checkResult = await query(
      'SELECT COUNT(*) as count FROM order_items WHERE product_id = $1',
      [parseInt(id)]
    );
    
    const hasOrders = parseInt(checkResult.rows[0].count) > 0;
    
    if (hasOrders) {
      // Soft delete: mark product as deleted instead of removing it
      // Add a deleted_at column if it doesn't exist, or use a status field
      const result = await query(
        'UPDATE products SET name = name || \' (Supprimé)\', updated_at = NOW() WHERE id = $1',
        [parseInt(id)]
      );
      return result.rowCount ? result.rowCount > 0 : false;
    } else {
      // Hard delete if no orders reference this product
      const result = await query('DELETE FROM products WHERE id = $1', [parseInt(id)]);
      return result.rowCount ? result.rowCount > 0 : false;
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
};

