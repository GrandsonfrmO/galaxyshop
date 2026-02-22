
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  
  // PWA Settings
  appName: string;
  appIcon: string;
  
  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isShopOpen: boolean;

  // Game State
  gameScore: number;
  gameHealth: number;
  gameLives: number;
  gameWave: number;
  highScore: number;
  isGameOver: boolean;

  // Actions
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

  // Cart Actions
  addToCart: (product: Product, size: string, color: string) => void;
  removeFromCart: (cartId: string) => void;
  clearCart: () => void;
  toggleCart: (isOpen?: boolean) => void;
  toggleCheckout: (isOpen?: boolean) => void;
  toggleShop: (isOpen?: boolean) => void;

  // Game Actions
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: (points: number) => void;
  takeDamage: (amount: number) => void;
  gainLife: () => void;
  nextWave: () => void;
  playerDied: () => void;
}

// Initial Mock Data - Prices in GNF
const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Grandson Hoodie V1',
    price: 350000,
    description: 'Heavyweight cotton hoodie with embroidered logo.',
    category: 'Vêtements',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    imageUrl: 'https://picsum.photos/400/400?random=1',
    position: [-4.5, 0.8, 0]
  },
  {
    id: '2',
    name: 'Orbit Cap',
    price: 120000,
    description: '5-panel cap structured for deep space exploration.',
    category: 'Accessoires',
    sizes: ['One Size'],
    colors: ['Beige', 'Olive'],
    imageUrl: 'https://picsum.photos/400/400?random=2',
    position: [0, 1.4, 0]
  },
  {
    id: '3',
    name: 'Lunar Cargo Pants', 
    price: 280000,
    description: 'Technical cargo pants with multiple pockets and relaxed fit.',
    category: 'Pantalons',
    sizes: ['30', '32', '34', '36'],
    colors: ['Black', 'Grey'],
    imageUrl: 'https://picsum.photos/400/400?random=3',
    position: [4.5, 0.8, 0]
  }
];

export const useStore = create<AppState>(
  persist(
    (set, get) => ({
      scene: 'ORBIT',
      selectedProduct: null,
      isAdmin: false,
      adminLoginTime: null,
      products: INITIAL_PRODUCTS,
      displayProducts: INITIAL_PRODUCTS.slice(0, 3),
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

      setScene: (scene) => set({ scene }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      toggleAdmin: () => set((state) => {
        if (!state.isAdmin) {
          return { isAdmin: true, adminLoginTime: Date.now() };
        } else {
          return { isAdmin: false, adminLoginTime: null };
        }
      }),
      logoutAdmin: () => set({ isAdmin: false, adminLoginTime: null }),
      checkAdminSession: () => {
        const state = get();
        if (state.isAdmin && state.adminLoginTime) {
          const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
          const elapsedTime = Date.now() - state.adminLoginTime;
          
          if (elapsedTime > sevenDaysInMs) {
            set({ isAdmin: false, adminLoginTime: null });
          }
        }
      },
      setProducts: (products) => set({ products }),
      setDisplayProducts: (products) => set({ displayProducts: products }),
      
      loadProducts: async () => {
        try {
          const products = await fetchProducts();
          set({ products });
        } catch (error) {
          console.error('Failed to load products:', error);
        }
      },
      
      loadDisplayProducts: async () => {
        try {
          const displayProducts = await fetchDisplayProducts();
          set({ displayProducts });
        } catch (error) {
          console.error('Failed to load display products:', error);
        }
      },
      
      addProduct: async (product) => {
        try {
          const newProduct = await createProduct(product);
          if (newProduct) {
            set((state) => ({ products: [...state.products, newProduct] }));
            const displayProducts = await fetchDisplayProducts();
            set({ displayProducts });
          }
        } catch (error) {
          console.error('Failed to add product:', error);
        }
      },
      
      updateProduct: async (product) => {
        try {
          const updatedProduct = await updateProductAPI(product);
          if (updatedProduct) {
            set((state) => ({
              products: state.products.map((p) => (p.id === product.id ? updatedProduct : p))
            }));
            const displayProducts = await fetchDisplayProducts();
            set({ displayProducts });
          }
        } catch (error) {
          console.error('Failed to update product:', error);
        }
      },
      
      deleteProduct: async (id) => {
        try {
          const success = await deleteProductAPI(id);
          if (success) {
            set((state) => ({
              products: state.products.filter((p) => p.id !== id)
            }));
            const displayProducts = await fetchDisplayProducts();
            set({ displayProducts });
          }
        } catch (error) {
          console.error('Failed to delete product:', error);
        }
      },

      addDeliveryZone: (zone) => set((state) => ({ deliveryZones: [...state.deliveryZones, zone] })),
      updateDeliveryZone: (zone) => set((state) => ({
        deliveryZones: state.deliveryZones.map((z) => (z.id === zone.id ? zone : z))
      })),
      deleteDeliveryZone: (id) => set((state) => ({
        deliveryZones: state.deliveryZones.filter((z) => z.id !== id)
      })),

      setAppName: (name) => set({ appName: name }),
      setAppIcon: (icon) => set({ appIcon: icon }),

      // Cart Implementation
      addToCart: (product, size, color) => set((state) => {
        const existingItem = state.cart.find(
          item => item.id === product.id && item.selectedSize === size && item.selectedColor === color
        );

        if (existingItem) {
          return {
            cart: state.cart.map(item => 
              item.cartId === existingItem.cartId 
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isCartOpen: true
          };
        }

        const newItem: CartItem = {
          ...product,
          cartId: uuidv4(),
          selectedSize: size,
          selectedColor: color,
          quantity: 1
        };

        return { 
          cart: [...state.cart, newItem],
          isCartOpen: true 
        };
      }),

      removeFromCart: (cartId) => set((state) => ({
        cart: state.cart.filter((item) => item.cartId !== cartId)
      })),

      clearCart: () => set({ cart: [] }),

      toggleCart: (isOpen) => set((state) => ({ 
        isCartOpen: isOpen !== undefined ? isOpen : !state.isCartOpen 
      })),

      toggleCheckout: (isOpen) => set((state) => ({
        isCheckoutOpen: isOpen !== undefined ? isOpen : !state.isCheckoutOpen
      })),

      toggleShop: (isOpen) => set((state) => ({
        isShopOpen: isOpen !== undefined ? isOpen : !state.isShopOpen
      })),

      // Game Logic
      startGame: () => set({ scene: 'GAME', gameScore: 0, gameHealth: 100, gameLives: 3, gameWave: 1, isGameOver: false }),
      endGame: () => set((state) => {
        const newHigh = Math.max(state.gameScore, state.highScore);
        localStorage.setItem('neon_vanguard_highscore', newHigh.toString());
        return { isGameOver: true, highScore: newHigh };
      }),
      resetGame: () => set({ gameScore: 0, gameHealth: 100, gameLives: 3, gameWave: 1, isGameOver: false }),
      incrementScore: (points) => set((state) => ({ gameScore: state.gameScore + points })),
      takeDamage: (amount) => set((state) => {
        const newHealth = state.gameHealth - amount;
        return { gameHealth: newHealth };
      }),
      gainLife: () => set((state) => ({ gameLives: Math.min(state.gameLives + 1, 3) })),
      nextWave: () => set((state) => ({ gameWave: state.gameWave + 1 })),
      playerDied: () => set((state) => {
        const lives = state.gameLives - 1;
        if (lives <= 0) {
          const newHigh = Math.max(state.gameScore, state.highScore);
          localStorage.setItem('neon_vanguard_highscore', newHigh.toString());
          return { gameLives: 0, isGameOver: true, highScore: newHigh };
        }
        return { gameLives: lives, gameHealth: 100 };
      })
    }),
    {
      name: 'boutique-store',
      partialize: (state) => ({
        products: state.products,
        displayProducts: state.displayProducts,
        deliveryZones: state.deliveryZones,
        appName: state.appName,
        appIcon: state.appIcon,
        highScore: state.highScore,
      }),
    }
  )
);
