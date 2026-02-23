import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { SceneState, Product, CartItem, DeliveryZone } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { fetchProducts, fetchDisplayProducts, createProduct, updateProductAPI, deleteProductAPI } from '../services/api';

interface AppState {
  scene: SceneState;
  selectedProduct: Product | null;
  isAdmin: boolean;
  adminLoginTime: number | null;
  products: Product[];
  displayProducts: Product[];
  deliveryZones: DeliveryZone[];
  appName: string;
  appIcon: string;
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isShopOpen: boolean;
  gameScore: number;
  gameHealth: number;
  gameLives: number;
  gameWave: number;
  highScore: number;
  isGameOver: boolean;
}

interface AppContextType extends AppState {
  setScene: (scene: SceneState) => void;
  setSelectedProduct: (product: Product | null) => void;
  toggleAdmin: () => void;
  logoutAdmin: () => void;
  checkAdminSession: () => void;
  setProducts: (products: Product[]) => void;
  setDisplayProducts: (products: Product[]) => void;
  loadProducts: () => Promise<void>;
  loadDisplayProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addDeliveryZone: (zone: DeliveryZone) => void;
  updateDeliveryZone: (zone: DeliveryZone) => void;
  deleteDeliveryZone: (id: string) => void;
  setAppName: (name: string) => void;
  setAppIcon: (icon: string) => void;
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  toggleCheckout: (isOpen?: boolean) => void;
  toggleShop: (isOpen?: boolean) => void;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (points: number) => void;
  takeDamage: (amount: number) => void;
  gainLife: () => void;
  nextWave: () => void;
  playerDied: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'boutique-store';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const defaults: AppState = {
      scene: 'ORBIT',
      selectedProduct: null,
      isAdmin: false,
      adminLoginTime: null,
      products: [],
      displayProducts: [],
      deliveryZones: [
        { id: '1', name: 'Conakry', price: 5000 },
        { id: '2', name: 'Kindia', price: 8000 },
        { id: '3', name: 'Mamou', price: 10000 },
      ],
      appName: 'The Boutique',
      appIcon: '/icon-192.png',
      cart: [],
      isCartOpen: false,
      isCheckoutOpen: false,
      isShopOpen: false,
      gameScore: 0,
      gameHealth: 100,
      gameLives: 3,
      gameWave: 1,
      highScore: parseInt(localStorage.getItem('neon_vanguard_highscore') || '0'),
      isGameOver: false,
    };

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaults, ...parsed };
      } catch {
        return defaults;
      }
    }
    return defaults;
  });

  useEffect(() => {
    const toStore = {
      deliveryZones: state.deliveryZones,
      appName: state.appName,
      appIcon: state.appIcon,
      highScore: state.highScore,
      isAdmin: state.isAdmin,
      adminLoginTime: state.adminLoginTime,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state.deliveryZones, state.appName, state.appIcon, state.highScore, state.isAdmin, state.adminLoginTime]);

  const setScene = useCallback((scene: SceneState) => {
    setState(prev => ({ ...prev, scene }));
  }, []);

  const setSelectedProduct = useCallback((product: Product | null) => {
    setState(prev => ({ ...prev, selectedProduct: product }));
  }, []);

  const toggleAdmin = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAdmin: !prev.isAdmin,
      adminLoginTime: !prev.isAdmin ? Date.now() : null,
    }));
  }, []);

  const logoutAdmin = useCallback(() => {
    setState(prev => ({ ...prev, isAdmin: false, adminLoginTime: null }));
  }, []);

  const checkAdminSession = useCallback(() => {
    setState(prev => {
      if (prev.isAdmin && prev.adminLoginTime) {
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const elapsedTime = Date.now() - prev.adminLoginTime;
        if (elapsedTime > sevenDaysInMs) {
          return { ...prev, isAdmin: false, adminLoginTime: null };
        }
      }
      return prev;
    });
  }, []);

  const setProducts = useCallback((products: Product[]) => {
    setState(prev => ({ ...prev, products }));
  }, []);

  const setDisplayProducts = useCallback((products: Product[]) => {
    setState(prev => ({ ...prev, displayProducts: products }));
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const products = await fetchProducts();
      setState(prev => ({ ...prev, products }));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  }, []);

  const loadDisplayProducts = useCallback(async () => {
    try {
      const displayProducts = await fetchDisplayProducts();
      setState(prev => ({ ...prev, displayProducts }));
    } catch (error) {
      console.error('Failed to load display products:', error);
    }
  }, []);

  const addProduct = useCallback(async (product: Product) => {
    try {
      const newProduct = await createProduct(product);
      if (newProduct) {
        // Reload all products from server to ensure consistency
        const allProducts = await fetchProducts();
        const displayProducts = await fetchDisplayProducts();
        setState(prev => ({ ...prev, products: allProducts, displayProducts }));
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    try {
      const updatedProduct = await updateProductAPI(product);
      if (updatedProduct) {
        // Reload all products from server to ensure consistency
        const allProducts = await fetchProducts();
        const displayProducts = await fetchDisplayProducts();
        setState(prev => ({ ...prev, products: allProducts, displayProducts }));
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      const success = await deleteProductAPI(id);
      if (success) {
        // Reload all products from server to ensure consistency
        const allProducts = await fetchProducts();
        const displayProducts = await fetchDisplayProducts();
        setState(prev => ({ ...prev, products: allProducts, displayProducts }));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }, []);

  const addDeliveryZone = useCallback((zone: DeliveryZone) => {
    setState(prev => ({ ...prev, deliveryZones: [...prev.deliveryZones, zone] }));
  }, []);

  const updateDeliveryZone = useCallback((zone: DeliveryZone) => {
    setState(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.map(z => (z.id === zone.id ? zone : z)),
    }));
  }, []);

  const deleteDeliveryZone = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter(z => z.id !== id),
    }));
  }, []);

  const setAppName = useCallback((name: string) => {
    setState(prev => ({ ...prev, appName: name }));
  }, []);

  const setAppIcon = useCallback((icon: string) => {
    setState(prev => ({ ...prev, appIcon: icon }));
  }, []);

  const addToCart = useCallback((product: Product, size: string, color: string) => {
    setState(prev => {
      const existingItem = prev.cart.find(
        item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
      );

      if (existingItem) {
        return {
          ...prev,
          cart: prev.cart.map(item =>
            item.cartId === existingItem.cartId ? { ...item, quantity: item.quantity + 1 } : item
          ),
          isCartOpen: true,
        };
      }

      const newItem: CartItem = {
        ...product,
        cartId: uuidv4(),
        selectedSize: size,
        selectedColor: color,
        quantity: 1,
      };

      return {
        ...prev,
        cart: [...prev.cart, newItem],
        isCartOpen: true,
      };
    });
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setState(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.cartId !== cartId),
    }));
  }, []);

  const clearCart = useCallback(() => {
    setState(prev => ({ ...prev, cart: [] }));
  }, []);

  const toggleCart = useCallback((isOpen?: boolean) => {
    setState(prev => ({
      ...prev,
      isCartOpen: isOpen !== undefined ? isOpen : !prev.isCartOpen,
    }));
  }, []);

  const toggleCheckout = useCallback((isOpen?: boolean) => {
    setState(prev => ({
      ...prev,
      isCheckoutOpen: isOpen !== undefined ? isOpen : !prev.isCheckoutOpen,
    }));
  }, []);

  const toggleShop = useCallback((isOpen?: boolean) => {
    setState(prev => ({
      ...prev,
      isShopOpen: isOpen !== undefined ? isOpen : !prev.isShopOpen,
    }));
  }, []);

  const startGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      scene: 'GAME',
      gameScore: 0,
      gameHealth: 100,
      gameLives: 3,
      gameWave: 1,
      isGameOver: false,
    }));
  }, []);

  const endGame = useCallback(() => {
    setState(prev => {
      const newHigh = Math.max(prev.gameScore, prev.highScore);
      localStorage.setItem('neon_vanguard_highscore', newHigh.toString());
      return { ...prev, isGameOver: true, highScore: newHigh };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      gameScore: 0,
      gameHealth: 100,
      gameLives: 3,
      gameWave: 1,
      isGameOver: false,
    }));
  }, []);

  const incrementScore = useCallback((points: number) => {
    setState(prev => ({ ...prev, gameScore: prev.gameScore + points }));
  }, []);

  const takeDamage = useCallback((amount: number) => {
    setState(prev => ({ ...prev, gameHealth: prev.gameHealth - amount }));
  }, []);

  const gainLife = useCallback(() => {
    setState(prev => ({ ...prev, gameLives: Math.min(prev.gameLives + 1, 3) }));
  }, []);

  const nextWave = useCallback(() => {
    setState(prev => ({ ...prev, gameWave: prev.gameWave + 1 }));
  }, []);

  const playerDied = useCallback(() => {
    setState(prev => {
      const lives = prev.gameLives - 1;
      if (lives <= 0) {
        const newHigh = Math.max(prev.gameScore, prev.highScore);
        localStorage.setItem('neon_vanguard_highscore', newHigh.toString());
        return { ...prev, gameLives: 0, isGameOver: true, highScore: newHigh };
      }
      return { ...prev, gameLives: lives, gameHealth: 100 };
    });
  }, []);

  const value: AppContextType = {
    ...state,
    setScene,
    setSelectedProduct,
    toggleAdmin,
    logoutAdmin,
    checkAdminSession,
    setProducts,
    setDisplayProducts,
    loadProducts,
    loadDisplayProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addDeliveryZone,
    updateDeliveryZone,
    deleteDeliveryZone,
    setAppName,
    setAppIcon,
    addToCart,
    removeFromCart,
    clearCart,
    toggleCart,
    toggleCheckout,
    toggleShop,
    startGame,
    endGame,
    resetGame,
    incrementScore,
    takeDamage,
    gainLife,
    nextWave,
    playerDied,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useStore must be used within AppProvider');
  }
  return context;
};
