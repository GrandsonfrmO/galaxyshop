
import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import { ProductOverlay } from './ui/ProductOverlay';
import { AdminPanelImproved } from './ui/AdminPanelImproved';
import { UIOverlay } from './ui/UIOverlay';
import { CartSidebar } from './ui/CartSidebar';
import { CheckoutModal } from './ui/CheckoutModal';
import { ShopModal } from './ui/ShopModal';
import { PWAInstallPrompt } from './ui/PWAInstallPrompt';
import { NeonVanguard } from './game/NeonVanguard';
import { useStore } from './store/useStore';

// Lazy load the 3D scene for better performance
const SceneCanvas = lazy(() => import('./canvas/SceneCanvas').then(m => ({ default: m.SceneCanvas })));

// Loading fallback for 3D scene
const SceneLoadingFallback = () => (
  <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 text-sm">Chargement de la scène 3D...</p>
    </div>
  </div>
);

function App() {
  const scene = useStore(state => state.scene);
  const checkAdminSession = useStore(state => state.checkAdminSession);
  const loadDisplayProducts = useStore(state => state.loadDisplayProducts);
  const [is3DReady, setIs3DReady] = useState(false);

  // Load display products on mount
  useEffect(() => {
    loadDisplayProducts();
  }, [loadDisplayProducts]);

  // Check admin session every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAdminSession();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAdminSession]);

  // Mark 3D as ready after initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIs3DReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoize the 3D scene rendering to prevent unnecessary re-renders
  const sceneElement = useMemo(() => {
    if (scene !== 'GAME' && is3DReady) {
      return (
        <Suspense fallback={<SceneLoadingFallback />}>
          <div className="absolute inset-0 z-0">
            <SceneCanvas />
          </div>
        </Suspense>
      );
    }
    return null;
  }, [scene, is3DReady]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D Scene Layer - Lazy loaded with Suspense */}
      {sceneElement}

      {/* 2D Game Layer */}
      {scene === 'GAME' && <NeonVanguard />}

      {/* UI Overlay Layer */}
      <UIOverlay />
      
      {/* Modals & Panels */}
      <ShopModal />
      <ProductOverlay />
      <CartSidebar />
      <CheckoutModal />
      <AdminPanelImproved />
      <PWAInstallPrompt />
    </div>
  );
}

export default App;
