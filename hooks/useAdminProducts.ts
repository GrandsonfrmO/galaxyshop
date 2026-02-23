import { useState, useCallback } from 'react';
import { Product } from '../types';
import {
  fetchProducts,
  createProduct,
  updateProductAPI,
  deleteProductAPI
} from '../services/api';

interface UseAdminProductsState {
  products: Product[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook pour gérer les produits en tant qu'admin
 */
export const useAdminProducts = () => {
  const [state, setState] = useState<UseAdminProductsState>({
    products: [],
    loading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setProducts = useCallback((products: Product[]) => {
    setState(prev => ({ ...prev, products }));
  }, []);

  // Charger tous les produits
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await fetchProducts();
      setProducts(products);
      return products;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un produit
  const addProduct = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await createProduct(product);
      if (newProduct) {
        // Recharger tous les produits pour assurer la cohérence
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      }
      return newProduct;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un produit
  const updateProduct = useCallback(async (product: Product) => {
    setLoading(true);
    setError(null);
    try {
      const updatedProduct = await updateProductAPI(product);
      if (updatedProduct) {
        // Recharger tous les produits pour assurer la cohérence
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      }
      return updatedProduct;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer un produit
  const deleteProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteProductAPI(id);
      if (success) {
        // Recharger tous les produits pour assurer la cohérence
        const allProducts = await fetchProducts();
        setProducts(allProducts);
      }
      return success;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};
