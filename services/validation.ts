/**
 * Validation Service
 * Service de validation des données
 */

import { query } from './database';

/**
 * Valide le format d'une adresse email
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide le format d'un numéro de téléphone
 */
export const validatePhone = (phone: string): boolean => {
  // Accepte les formats: 612345678, +224612345678, 00224612345678
  const phoneRegex = /^(\+?224|00224)?[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Vérifie qu'un produit existe et retourne ses détails
 */
export const validateProductExists = async (productId: number): Promise<any> => {
  const result = await query(
    'SELECT id, name, price, stock FROM products WHERE id = $1',
    [productId]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  return result.rows[0];
};

/**
 * Vérifie qu'une zone de livraison existe
 */
export const validateDeliveryZoneExists = async (zoneName: string): Promise<any> => {
  const result = await query(
    'SELECT id, name, price FROM delivery_zones WHERE name = $1',
    [zoneName]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Delivery zone "${zoneName}" not found`);
  }
  
  return result.rows[0];
};

/**
 * Vérifie que le stock est suffisant
 */
export const validateStock = async (productId: number, quantity: number): Promise<boolean> => {
  const result = await query(
    'SELECT stock FROM products WHERE id = $1',
    [productId]
  );
  
  if (result.rows.length === 0) {
    throw new Error(`Product with ID ${productId} not found`);
  }
  
  const product = result.rows[0];
  if (product.stock < quantity) {
    throw new Error(`Insufficient stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`);
  }
  
  return true;
};

/**
 * Valide les données d'une commande
 */
export const validateOrderData = async (orderData: any): Promise<void> => {
  // Validation des champs requis
  if (!orderData.customerName || orderData.customerName.trim().length === 0) {
    throw new Error('Customer name is required');
  }
  
  if (!orderData.customerEmail || orderData.customerEmail.trim().length === 0) {
    throw new Error('Customer email is required');
  }
  
  if (!validateEmail(orderData.customerEmail)) {
    throw new Error('Invalid email format');
  }
  
  if (orderData.customerPhone && !validatePhone(orderData.customerPhone)) {
    throw new Error('Invalid phone format');
  }
  
  if (!orderData.deliveryAddress || orderData.deliveryAddress.trim().length === 0) {
    throw new Error('Delivery address is required');
  }
  
  if (!orderData.deliveryZone || orderData.deliveryZone.trim().length === 0) {
    throw new Error('Delivery zone is required');
  }
  
  if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
    throw new Error('At least one item is required');
  }
  
  // Validation de la zone de livraison
  await validateDeliveryZoneExists(orderData.deliveryZone);
  
  // Validation de chaque item
  for (const item of orderData.items) {
    if (!item.productId || !item.quantity) {
      throw new Error('Each item must have productId and quantity');
    }
    
    if (item.quantity < 1) {
      throw new Error('Item quantity must be at least 1');
    }
    
    // Vérifier que le produit existe
    const product = await validateProductExists(item.productId);
    
    // Vérifier le stock
    await validateStock(item.productId, item.quantity);
    
    // Vérifier que le prix correspond
    if (item.priceAtPurchase !== product.price) {
      console.warn(`⚠️ Price mismatch for product ${item.productId}. Expected: ${product.price}, Got: ${item.priceAtPurchase}`);
    }
  }
};

/**
 * Valide les données d'une zone de livraison
 */
export const validateDeliveryZoneData = (data: any): void => {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Zone name is required');
  }
  
  if (data.price === undefined || data.price === null) {
    throw new Error('Zone price is required');
  }
  
  if (typeof data.price !== 'number' || data.price < 0) {
    throw new Error('Zone price must be a positive number');
  }
};

/**
 * Valide les données d'un produit
 */
export const validateProductData = (data: any): void => {
  if (!data.name || data.name.trim().length === 0) {
    throw new Error('Product name is required');
  }
  
  if (data.price === undefined || data.price === null) {
    throw new Error('Product price is required');
  }
  
  if (typeof data.price !== 'number' || data.price < 0) {
    throw new Error('Product price must be a positive number');
  }
  
  if (data.stock !== undefined && (typeof data.stock !== 'number' || data.stock < 0)) {
    throw new Error('Product stock must be a positive number');
  }
};
