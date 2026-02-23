import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboard } from './AdminDashboard';
import { IconCropper } from './IconCropper';
import { PWAIconGenerator, GeneratedIcons } from './PWAIconGenerator';
import { MultiImageUploader } from '../components/MultiImageUploader';
import { savePWAIcons, savePWASettings, loadPWASettings, updateManifest, updateThemeColor, reloadServiceWorker } from '../services/pwaService';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  LogOut, Plus, Search, Edit2, Trash2, X, Save, Upload, Tag,
  Activity, ArrowUpRight, DollarSign, Box, ChevronLeft, Image as ImageIcon,
  Menu, ChevronDown
} from 'lucide-react';
import { Product, ProductImage } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Vêtements', 'Pantalons', 'Accessoires', 'Chaussures', 'Édition Limitée', 'Autre'];
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const AVAILABLE_COLORS = ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Rose', 'Violet', 'Marron', 'Beige'];

export const AdminPanelImproved: React.FC = () => {
  const { isAdmin, products, addProduct, updateProduct, deleteProduct, toggleAdmin, logoutAdmin, adminLoginTime, deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone, appName, appIcon, setAppName, setAppIcon, loadProducts } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'delivery' | 'pwa'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // State for the product being edited
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [colorInput, setColorInput] = useState('');
  
  // State for delivery zone editing
  const [isEditingZone, setIsEditingZone] = useState(false);
  const [currentZone, setCurrentZone] = useState<any>({ id: '', name: '', price: 0 });
  const [zoneToDelete, setZoneToDelete] = useState<string | null>(null);
  
  // PWA Settings
  const [pwaAppName, setPwaAppName] = useState(appName);
  const [pwaAppIcon, setPwaAppIcon] = useState(appIcon);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempIconForCrop, setTempIconForCrop] = useState<string>('');
  const [pwaSettings, setPwaSettings] = useState<any>({
    appName: 'The Boutique',
    shortName: 'Boutique',
    description: 'Immersive fashion store with 3D experience',
    themeColor: '#a855f7',
    backgroundColor: '#050505',
    icons: {}
  });
  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIcons | null>(null);
  const [showIconGenerator, setShowIconGenerator] = useState(false);
  
  // Load PWA settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await loadPWASettings();
      setPwaSettings(settings);
    };
    loadSettings();
  }, []);
  
  // Mobile search state
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate session time left
  useEffect(() => {
    if (!isAdmin || !adminLoginTime) return;

    const updateSessionTime = () => {
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const elapsedTime = Date.now() - adminLoginTime;
      const timeLeft = sevenDaysInMs - elapsedTime;

      if (timeLeft <= 0) {
        setSessionTimeLeft('Expiré');
      } else {
        const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
        const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        setSessionTimeLeft(`${days}j ${hours}h ${minutes}m`);
      }
    };

    updateSessionTime();
    const interval = setInterval(updateSessionTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isAdmin, adminLoginTime]);

  // Load orders when orders tab is active or on mount for badge count
  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (activeTab === 'orders' && isAdmin) {
      loadOrders();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        console.log('Orders loaded:', data);
        setOrders(data || []);
      } else {
        console.error('Failed to load orders:', response.status);
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        await loadOrders();
        alert('✅ Statut mis à jour');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter products for the list view
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- HANDLERS ---

  const handleEdit = (product?: Product) => {
    if (product) {
      setCurrentProduct(JSON.parse(JSON.stringify(product)));
    } else {
      setCurrentProduct({
        id: uuidv4(),
        name: '',
        price: 0,
        category: 'Vêtements',
        description: '',
        imageUrl: '',
        images: [],
        sizes: ['M', 'L'],
        colors: ['Noir'],
        position: [0, 0, 0],
        stock: 0
      });
    }
    setColorInput('');
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    const sizes = currentProduct.sizes || [];
    if (sizes.includes(size)) {
      setCurrentProduct({ ...currentProduct, sizes: sizes.filter(s => s !== size) });
    } else {
      setCurrentProduct({ ...currentProduct, sizes: [...sizes, size] });
    }
  };

  const toggleColor = (color: string) => {
    const colors = currentProduct.colors || [];
    if (colors.includes(color)) {
      setCurrentProduct({ ...currentProduct, colors: colors.filter(c => c !== color) });
    } else {
      setCurrentProduct({ ...currentProduct, colors: [...colors, color] });
    }
  };

  const addColor = () => {
    if (colorInput.trim()) {
      const colors = currentProduct.colors || [];
      if (!colors.includes(colorInput.trim())) {
        setCurrentProduct({ ...currentProduct, colors: [...colors, colorInput.trim()] });
      }
      setColorInput('');
    }
  };

  const removeColor = (color: string) => {
    const colors = currentProduct.colors || [];
    setCurrentProduct({ ...currentProduct, colors: colors.filter(c => c !== color) });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if at least one image is provided
    const hasImages = (currentProduct.images && currentProduct.images.length > 0) || currentProduct.imageUrl;
    if (!hasImages) {
        alert("Au moins une image est obligatoire.");
        return;
    }
    
    // Ensure imageUrl is set to first image for backward compatibility
    if (currentProduct.images && currentProduct.images.length > 0) {
      currentProduct.imageUrl = currentProduct.images[0].url;
    }
    
    const exists = products.some(p => p.id === currentProduct.id);
    
    try {
      if (exists) {
        await updateProduct(currentProduct as Product);
        alert('✅ Produit modifié avec succès');
      } else {
        await addProduct(currentProduct as Product);
        alert('✅ Produit ajouté avec succès');
      }
      // Reload products to ensure they're displayed
      await loadProducts();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Erreur lors de la sauvegarde du produit');
    }
  };

  const handleEditZone = (zone?: any) => {
    if (zone) {
      setCurrentZone({ ...zone });
    } else {
      setCurrentZone({ id: uuidv4(), name: '', price: 0 });
    }
    setIsEditingZone(true);
  };

  const handleSaveZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentZone.name || currentZone.price <= 0) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    const exists = deliveryZones.some(z => z.id === currentZone.id);
    
    if (exists) {
      updateDeliveryZone(currentZone);
    } else {
      addDeliveryZone(currentZone);
    }
    setIsEditingZone(false);
  };

  const handleConfirmDeleteZone = () => {
    if (zoneToDelete) {
      deleteDeliveryZone(zoneToDelete);
      setZoneToDelete(null);
    }
  };

  return (
    <>
      {/* Admin Button - Floating */}
      {isAdmin && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-5 cosmic-button text-white rounded-2xl shadow-2xl shadow-purple-500/50 border border-purple-400/30"
        >
          <Settings size={26} />
        </button>
      )}

      {/* Admin Panel - Only render when admin is logged in */}
      {isAdmin && (
        <>
          {/* Sidebar Modal - Hidden on mobile, visible on sm+ */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden sm:flex fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              >
                <motion.div
                  initial={{ x: -500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="fixed left-0 top-0 h-screen w-80 md:w-96 galactic-bg text-white border-r border-purple-500/30 flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="h-20 sm:h-24 flex items-center justify-between px-4 sm:px-6 border-b border-purple-500/30 bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-3xl shadow-2xl shadow-purple-500/60 border border-purple-400/30">
                        ⭐
                      </div>
                      <div>
                        <h1 className="font-black tracking-[0.2em] text-base sm:text-xl bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                          ADMIN
                        </h1>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-[10px] sm:text-xs text-purple-300/60 font-mono uppercase tracking-widest">
                            Galaxie v2.0
                          </p>
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2.5 hover:bg-purple-500/30 rounded-xl transition border border-purple-500/30 hover:border-purple-400/60"
                    >
                      <X size={20} className="text-purple-300" />
                    </button>
                  </div>

                  {/* Navigation */}
                  <nav className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-1 sm:space-y-2">
                    <NavButton 
                      icon={<LayoutDashboard size={18} />} 
                      label="Tableau de bord" 
                      active={activeTab === 'dashboard'} 
                      onClick={() => setActiveTab('dashboard')} 
                    />
                    <NavButton 
                      icon={<Package size={18} />} 
                      label="Produits" 
                      active={activeTab === 'products'} 
                      onClick={() => setActiveTab('products')} 
                    />
                    <NavButton 
                      icon={<ShoppingCart size={18} />} 
                      label="Commandes" 
                      active={activeTab === 'orders'} 
                      onClick={() => setActiveTab('orders')} 
                      badge={orders.filter(o => o.status === 'pending').length > 0 ? orders.filter(o => o.status === 'pending').length.toString() : undefined} 
                    />
                    <NavButton 
                      icon={<Package size={18} />} 
                      label="Zones de livraison" 
                      active={activeTab === 'delivery'} 
                      onClick={() => setActiveTab('delivery')} 
                    />
                    <NavButton 
                      icon={<Settings size={18} />} 
                      label="Paramètres PWA" 
                      active={activeTab === 'pwa'} 
                      onClick={() => setActiveTab('pwa')} 
                    />
                  </nav>

                  {/* Footer */}
                  <div className="p-2 sm:p-4 border-t border-white/5 bg-gradient-to-t from-purple-900/10 to-transparent space-y-2">
                    {/* Session Time */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs">
                      <p className="text-gray-400">Session expire dans :</p>
                      <p className="text-purple-400 font-mono font-bold">{sessionTimeLeft}</p>
                    </div>
                    <button 
                      onClick={() => {
                        logoutAdmin();
                        setIsOpen(false);
                      }}
                      className="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full p-2 sm:p-3 rounded-lg transition-all text-sm"
                    >
                      <LogOut size={16} />
                      <span className="font-medium">Quitter Admin</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Content Panel */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: 500 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 500 }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed right-0 top-0 h-screen w-full sm:w-[calc(100%-320px)] md:w-[calc(100%-384px)] z-[199] bg-[#0a0a0a] border-l border-purple-500/20 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header with Mobile Menu Button */}
                <div className="sticky top-0 z-10 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 border-b border-white/5 bg-gradient-to-r from-purple-900/10 to-transparent backdrop-blur-sm">
                  <div className="flex items-center gap-2 flex-1">
                    {/* Mobile Menu Button */}
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <Menu size={20} />
                    </button>
                    <h2 className="text-lg sm:text-2xl font-bold capitalize line-clamp-1">
                      {activeTab === 'dashboard' && "📊 Tableau de Bord"}
                      {activeTab === 'products' && "📦 Produits"}
                      {activeTab === 'orders' && "🛒 Commandes"}
                      {activeTab === 'delivery' && "🚚 Zones de Livraison"}
                      {activeTab === 'pwa' && "⚙️ Paramètres PWA"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="sm:hidden p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Menu Dropdown */}
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="sm:hidden border-b border-white/5 bg-white/5"
                    >
                      <nav className="p-2 space-y-1">
                        <MobileNavButton 
                          icon={<LayoutDashboard size={18} />} 
                          label="Tableau de bord" 
                          active={activeTab === 'dashboard'} 
                          onClick={() => {
                            setActiveTab('dashboard');
                            setIsMobileMenuOpen(false);
                          }} 
                        />
                        <MobileNavButton 
                          icon={<Package size={18} />} 
                          label="Produits" 
                          active={activeTab === 'products'} 
                          onClick={() => {
                            setActiveTab('products');
                            setIsMobileMenuOpen(false);
                          }} 
                        />
                        <MobileNavButton 
                          icon={<ShoppingCart size={18} />} 
                          label="Commandes" 
                          active={activeTab === 'orders'} 
                          onClick={() => {
                            setActiveTab('orders');
                            setIsMobileMenuOpen(false);
                          }} 
                          badge={orders.filter(o => o.status === 'pending').length > 0 ? orders.filter(o => o.status === 'pending').length.toString() : undefined} 
                        />
                        <MobileNavButton 
                          icon={<Package size={18} />} 
                          label="Zones de livraison" 
                          active={activeTab === 'delivery'} 
                          onClick={() => {
                            setActiveTab('delivery');
                            setIsMobileMenuOpen(false);
                          }} 
                        />
                        <MobileNavButton 
                          icon={<Settings size={18} />} 
                          label="Paramètres PWA" 
                          active={activeTab === 'pwa'} 
                          onClick={() => {
                            setActiveTab('pwa');
                            setIsMobileMenuOpen(false);
                          }} 
                        />
                        <div className="border-t border-white/10 my-2 pt-2 space-y-2">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-2 text-xs">
                            <p className="text-gray-400">Session expire dans :</p>
                            <p className="text-purple-400 font-mono font-bold">{sessionTimeLeft}</p>
                          </div>
                          <button 
                            onClick={() => {
                              logoutAdmin();
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full p-2 rounded-lg transition-all text-sm"
                          >
                            <LogOut size={16} />
                            <span className="font-medium">Quitter Admin</span>
                          </button>
                        </div>
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content */}
                <div className="p-3 sm:p-6 pb-20">
                  {activeTab === 'dashboard' && <AdminDashboard products={products} />}

                  {activeTab === 'products' && (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Stats rapides */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">📦</div>
                          <div className="text-xs text-gray-400">Total Produits</div>
                          <div className="text-lg sm:text-xl font-bold text-purple-400">{products.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">🏷️</div>
                          <div className="text-xs text-gray-400">Catégories</div>
                          <div className="text-lg sm:text-xl font-bold text-blue-400">{[...new Set(products.map(p => p.category))].length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">💰</div>
                          <div className="text-xs text-gray-400">Valeur Stock</div>
                          <div className="text-sm sm:text-base font-bold text-green-400">{(products.reduce((sum, p) => sum + p.price, 0) / 1000000).toFixed(1)}M</div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-600/20 to-orange-600/5 border border-orange-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">🔍</div>
                          <div className="text-xs text-gray-400">Résultats</div>
                          <div className="text-lg sm:text-xl font-bold text-orange-400">{filteredProducts.length}</div>
                        </div>
                      </div>

                      {/* Toolbar amélioré */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher par nom ou catégorie..." 
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none text-white transition-all" 
                          />
                        </div>
                        <button 
                          onClick={() => handleEdit()} 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 sm:px-6 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 text-sm"
                        >
                          <Plus size={18} /> Nouveau Produit
                        </button>
                      </div>

                      {/* Products Grid amélioré - 2 colonnes mobile, 3 desktop */}
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {filteredProducts.map(product => (
                            <motion.div
                              key={product.id}
                              layout
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all group"
                            >
                              {/* Image avec badge catégorie */}
                              <div className="relative aspect-square bg-white/5 rounded-lg mb-3 overflow-hidden">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                                />
                                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                  <span className="text-[10px] font-bold text-purple-300">{product.category}</span>
                                </div>
                                {product.images && product.images.length > 1 && (
                                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <span className="text-[10px] font-bold text-blue-300">📸 {product.images.length}</span>
                                  </div>
                                )}
                              </div>

                              {/* Info produit */}
                              <div className="space-y-2">
                                <h3 className="font-bold text-sm sm:text-base line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                                
                                {/* Prix avec badge */}
                                <div className="flex items-center justify-between">
                                  <p className="text-sm sm:text-base font-mono font-bold text-purple-400">{product.price.toLocaleString()} GNF</p>
                                </div>

                                {/* Tailles et couleurs */}
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <span className="flex items-center gap-1">
                                    📏 {product.sizes.length}
                                  </span>
                                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                  <span className="flex items-center gap-1">
                                    🎨 {product.colors.length}
                                  </span>
                                  <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                                  <span className={`flex items-center gap-1 ${(product.stock || 0) === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    📦 {product.stock || 0}
                                  </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                  <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 hover:scale-105"
                                  >
                                    <Edit2 size={12} /> Modifier
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Supprimer "${product.name}" ?\n\nCette action est irréversible.`)) {
                                        try {
                                          await deleteProduct(product.id);
                                          alert('✅ Produit supprimé avec succès');
                                        } catch (error) {
                                          alert('❌ Erreur lors de la suppression');
                                        }
                                      }
                                    }}
                                    className="bg-red-600/20 hover:bg-red-600/40 text-red-300 p-2 rounded-lg text-xs font-bold transition-all hover:scale-105"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-4">
                            <Package size={40} className="text-purple-400" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Aucun produit trouvé</h3>
                          <p className="text-gray-400 text-sm mb-6">
                            {searchQuery ? `Aucun résultat pour "${searchQuery}"` : 'Commencez par ajouter votre premier produit'}
                          </p>
                          {!searchQuery && (
                            <button 
                              onClick={() => handleEdit()} 
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg"
                            >
                              <Plus size={18} /> Ajouter un produit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Stats rapides */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                        <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">📦</div>
                          <div className="text-xs text-gray-400">Total Commandes</div>
                          <div className="text-lg sm:text-xl font-bold text-blue-400">{orders.length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 border border-yellow-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">⏳</div>
                          <div className="text-xs text-gray-400">En Attente</div>
                          <div className="text-lg sm:text-xl font-bold text-yellow-400">{orders.filter(o => o.status === 'pending').length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">✅</div>
                          <div className="text-xs text-gray-400">Livrées</div>
                          <div className="text-lg sm:text-xl font-bold text-green-400">{orders.filter(o => o.status === 'delivered').length}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-3 sm:p-4">
                          <div className="text-xl sm:text-2xl mb-1">💰</div>
                          <div className="text-xs text-gray-400">Revenu Total</div>
                          <div className="text-sm sm:text-base font-bold text-purple-400">{(orders.reduce((sum, o) => sum + o.total_amount, 0) / 1000000).toFixed(1)}M</div>
                        </div>
                      </div>

                      {/* Orders List */}
                      {loadingOrders ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                        </div>
                      ) : orders.length > 0 ? (
                        <div className="space-y-3 sm:space-y-4">
                          {orders.map(order => (
                            <motion.div
                              key={order.id}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-br from-white/5 to-white/2 border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-500/50 transition-all"
                            >
                              {/* Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-base sm:text-lg">Commande #{order.id}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                      order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                                      order.status === 'shipped' ? 'bg-purple-500/20 text-purple-400' :
                                      order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {order.status === 'pending' ? '⏳ En attente' :
                                       order.status === 'processing' ? '🔄 En traitement' :
                                       order.status === 'shipped' ? '🚚 Expédiée' :
                                       order.status === 'delivered' ? '✅ Livrée' :
                                       '❌ Annulée'}
                                    </span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString('fr-FR', { 
                                      day: 'numeric', 
                                      month: 'long', 
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-400 mb-1">Total</p>
                                  <p className="text-xl sm:text-2xl font-bold text-purple-400">{order.total_amount.toLocaleString()} GNF</p>
                                </div>
                              </div>

                              {/* Customer Info */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Client</p>
                                  <p className="font-bold text-sm">{order.customer_name}</p>
                                  <p className="text-xs text-gray-400">{order.customer_email}</p>
                                  {order.customer_phone && <p className="text-xs text-gray-400">{order.customer_phone}</p>}
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Livraison</p>
                                  <p className="font-bold text-sm">{order.delivery_zone}</p>
                                  <p className="text-xs text-gray-400">{order.shipping_address}</p>
                                  <p className="text-xs text-purple-400 font-bold mt-1">Frais: {order.delivery_fee.toLocaleString()} GNF</p>
                                </div>
                              </div>

                              {/* Items */}
                              <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-2">Articles ({order.items?.length || 0})</p>
                                <div className="space-y-2">
                                  {order.items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 rounded-lg p-2">
                                      {item.imageUrl && (
                                        <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{item.productName}</p>
                                        <p className="text-xs text-gray-400">
                                          {item.selectedSize} • {item.selectedColor} • Qté: {item.quantity}
                                        </p>
                                      </div>
                                      <p className="text-sm font-bold text-purple-400 whitespace-nowrap">
                                        {(item.priceAtPurchase * item.quantity).toLocaleString()} GNF
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div className="mb-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                                  <p className="text-xs text-gray-400 mb-1">Notes</p>
                                  <p className="text-sm text-blue-300">{order.notes}</p>
                                </div>
                              )}

                              {/* Actions */}
                              <div className="flex flex-wrap gap-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                  className="flex-1 min-w-[150px] bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm font-medium focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
                                >
                                  <option value="pending">⏳ En attente</option>
                                  <option value="processing">🔄 En traitement</option>
                                  <option value="shipped">🚚 Expédiée</option>
                                  <option value="delivered">✅ Livrée</option>
                                  <option value="cancelled">❌ Annulée</option>
                                </select>
                                <button
                                  onClick={() => window.open(`mailto:${order.customer_email}?subject=Commande #${order.id}`, '_blank')}
                                  className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition"
                                >
                                  📧 Email
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart size={40} className="text-blue-400" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Aucune commande</h3>
                          <p className="text-gray-400 text-sm">Les commandes apparaîtront ici une fois passées</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'delivery' && (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Toolbar */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center">
                        <h3 className="text-lg sm:text-xl font-bold">Zones de Livraison</h3>
                        <button 
                          onClick={() => handleEditZone()} 
                          className="bg-purple-600 hover:bg-purple-700 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm"
                        >
                          <Plus size={16} /> Ajouter Zone
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <p className="text-sm text-gray-400">Total de zones : <span className="text-purple-400 font-bold">{deliveryZones.length}</span></p>
                      </div>

                      {/* Delivery Zones Grid - 2 colonnes */}
                      {deliveryZones.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                          {deliveryZones.map(zone => (
                            <motion.div
                              key={zone.id}
                              layout
                              className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-purple-500/50 transition"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-bold text-sm sm:text-base mb-1">{zone.name}</h4>
                                  <p className="text-xs text-gray-400">Prix de livraison</p>
                                </div>
                              </div>
                              <p className="text-lg sm:text-xl font-mono font-bold text-purple-400 mb-4">{zone.price.toLocaleString()} GNF</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEditZone(zone)}
                                  className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1"
                                >
                                  <Edit2 size={14} /> Modifier
                                </button>
                                <button
                                  onClick={() => setZoneToDelete(zone.id)}
                                  className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-2 rounded text-xs font-medium transition flex items-center justify-center gap-1"
                                >
                                  <Trash2 size={14} /> Supprimer
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                          <Package size={40} className="mb-4 opacity-20" />
                          <h3 className="text-base sm:text-lg font-bold text-white mb-2">Aucune zone de livraison</h3>
                          <p className="text-xs sm:text-sm">Cliquez sur "Ajouter Zone" pour créer une nouvelle zone</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* PWA Settings */}
                  {activeTab === 'pwa' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold mb-4">⚙️ Paramètres PWA</h3>
                        
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                          <div className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 border border-purple-500/30 rounded-xl p-4">
                            <div className="text-2xl mb-1">📱</div>
                            <div className="text-sm text-gray-400">Installable</div>
                            <div className="text-lg font-bold text-purple-400">iOS & Android</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-600/20 to-blue-600/5 border border-blue-500/30 rounded-xl p-4">
                            <div className="text-2xl mb-1">🎨</div>
                            <div className="text-sm text-gray-400">Icônes</div>
                            <div className="text-lg font-bold text-blue-400">{generatedIcons ? '15/15' : '0/15'}</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-600/20 to-green-600/5 border border-green-500/30 rounded-xl p-4">
                            <div className="text-2xl mb-1">⚡</div>
                            <div className="text-sm text-gray-400">Status</div>
                            <div className="text-lg font-bold text-green-400">{generatedIcons ? 'Actif' : 'Configuration'}</div>
                          </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 overflow-x-auto">
                          <button
                            onClick={() => setShowIconGenerator(false)}
                            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                              !showIconGenerator
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            Paramètres Généraux
                          </button>
                          <button
                            onClick={() => setShowIconGenerator(true)}
                            className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                              showIconGenerator
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            🎨 Générateur d'Icônes
                          </button>
                        </div>

                        {!showIconGenerator ? (
                          /* General Settings */
                          <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                            {/* App Name */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium mb-2">Nom de l'Application</label>
                              <input
                                type="text"
                                value={pwaSettings.appName}
                                onChange={(e) => setPwaSettings({ ...pwaSettings, appName: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-purple-500 outline-none"
                                placeholder="The Boutique"
                              />
                              <p className="text-xs text-gray-400 mt-2">Ce nom apparaîtra sur l'écran d'accueil</p>
                            </div>

                            {/* Short Name */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium mb-2">Nom Court</label>
                              <input
                                type="text"
                                value={pwaSettings.shortName}
                                onChange={(e) => setPwaSettings({ ...pwaSettings, shortName: e.target.value })}
                                maxLength={12}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-purple-500 outline-none"
                                placeholder="Boutique"
                              />
                              <p className="text-xs text-gray-400 mt-2">Maximum 12 caractères</p>
                            </div>

                            {/* Description */}
                            <div>
                              <label className="block text-xs sm:text-sm font-medium mb-2">Description</label>
                              <textarea
                                value={pwaSettings.description}
                                onChange={(e) => setPwaSettings({ ...pwaSettings, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-purple-500 outline-none h-20"
                                placeholder="Immersive fashion store with 3D experience"
                              />
                            </div>

                            {/* Colors */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2">Couleur du thème</label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={pwaSettings.themeColor}
                                    onChange={(e) => {
                                      setPwaSettings({ ...pwaSettings, themeColor: e.target.value });
                                      updateThemeColor(e.target.value);
                                    }}
                                    className="w-12 h-12 rounded-lg cursor-pointer border border-white/20"
                                  />
                                  <input
                                    type="text"
                                    value={pwaSettings.themeColor}
                                    onChange={(e) => {
                                      setPwaSettings({ ...pwaSettings, themeColor: e.target.value });
                                      updateThemeColor(e.target.value);
                                    }}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2">Couleur de fond</label>
                                <div className="flex gap-2">
                                  <input
                                    type="color"
                                    value={pwaSettings.backgroundColor}
                                    onChange={(e) => setPwaSettings({ ...pwaSettings, backgroundColor: e.target.value })}
                                    className="w-12 h-12 rounded-lg cursor-pointer border border-white/20"
                                  />
                                  <input
                                    type="text"
                                    value={pwaSettings.backgroundColor}
                                    onChange={(e) => setPwaSettings({ ...pwaSettings, backgroundColor: e.target.value })}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Save Button */}
                            <button
                              onClick={async () => {
                                try {
                                  await savePWASettings(pwaSettings);
                                  if (generatedIcons) {
                                    await updateManifest({ ...pwaSettings, icons: generatedIcons });
                                  }
                                  setAppName(pwaSettings.appName);
                                  alert('✅ Paramètres PWA mis à jour avec succès!');
                                } catch (error) {
                                  alert('❌ Erreur lors de la sauvegarde des paramètres');
                                }
                              }}
                              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                            >
                              <Save size={18} /> Sauvegarder les paramètres
                            </button>

                            {/* Info Box */}
                            <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                              <p className="text-xs sm:text-sm text-blue-300">
                                💡 Les utilisateurs pourront installer l'app depuis leur navigateur. Les paramètres seront appliqués immédiatement.
                              </p>
                            </div>
                          </div>
                        ) : (
                          /* Icon Generator */
                          <PWAIconGenerator
                            currentIcon={pwaAppIcon}
                            onIconsGenerated={async (icons) => {
                              try {
                                setGeneratedIcons(icons);
                                await savePWAIcons(icons);
                                await updateManifest({ ...pwaSettings, icons });
                                await reloadServiceWorker();
                                alert('✅ Icônes PWA générées et appliquées avec succès!');
                              } catch (error) {
                                alert('❌ Erreur lors de la génération des icônes');
                              }
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Modal */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
                onClick={() => setIsEditing(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#0a0a0a] border border-purple-500/30 rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold">Éditer Produit</h2>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-white/10 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4 sm:space-y-6">
                    {/* Multiple Images Upload */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-3">
                        Images du produit (jusqu'à 5)
                      </label>
                      <MultiImageUploader
                        images={currentProduct.images || []}
                        onChange={(images: ProductImage[]) => {
                          setCurrentProduct({ 
                            ...currentProduct, 
                            images,
                            imageUrl: images.length > 0 ? images[0].url : ''
                          });
                        }}
                        maxImages={5}
                      />
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Nom</label>
                      <input
                        type="text"
                        value={currentProduct.name || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Prix (GNF)</label>
                      <input
                        type="number"
                        value={currentProduct.price || 0}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: parseInt(e.target.value) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                      />
                    </div>

                    {/* Stock */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Stock Disponible</label>
                      <input
                        type="number"
                        value={currentProduct.stock || 0}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, stock: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        {currentProduct.stock === 0 ? '⚠️ Rupture de stock (toujours commandable)' : `✅ ${currentProduct.stock} unités disponibles`}
                      </p>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Catégorie</label>
                      <select
                        value={currentProduct.category || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, category: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={currentProduct.description || ''}
                        onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none h-20 sm:h-24"
                      />
                    </div>

                    {/* Sizes */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Tailles</label>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {AVAILABLE_SIZES.map(size => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition ${
                              (currentProduct.sizes || []).includes(size)
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colors */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Couleurs</label>
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Couleurs présélectionnées:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {AVAILABLE_COLORS.map(color => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => toggleColor(color)}
                              className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition ${
                                (currentProduct.colors || []).includes(color)
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          placeholder="Ou ajouter une couleur personnalisée"
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={addColor}
                          className="bg-purple-600 hover:bg-purple-700 px-3 sm:px-4 py-2 rounded-lg font-medium transition text-sm"
                        >
                          Ajouter
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(currentProduct.colors || []).map(color => (
                          <div key={color} className="bg-white/10 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-2">
                            {color}
                            <button
                              type="button"
                              onClick={() => removeColor(color)}
                              className="text-red-400 hover:text-red-300"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Save size={16} /> Sauvegarder
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-medium transition text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edit Delivery Zone Modal */}
          <AnimatePresence>
            {isEditingZone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
                onClick={() => setIsEditingZone(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#0a0a0a] border border-purple-500/30 rounded-lg p-4 sm:p-6 w-full max-w-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold">Zone de Livraison</h2>
                    <button onClick={() => setIsEditingZone(false)} className="p-2 hover:bg-white/10 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveZone} className="space-y-4 sm:space-y-6">
                    {/* Zone Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Nom de la Zone</label>
                      <input
                        type="text"
                        value={currentZone.name || ''}
                        onChange={(e) => setCurrentZone({ ...currentZone, name: e.target.value })}
                        placeholder="Ex: Conakry, Kindia, Mamou..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Entrez le nom de la zone de livraison</p>
                    </div>

                    {/* Zone Price */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Prix de Livraison (GNF)</label>
                      <input
                        type="number"
                        value={currentZone.price || 0}
                        onChange={(e) => setCurrentZone({ ...currentZone, price: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        min="0"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-sm focus:border-purple-500 outline-none"
                        required
                      />
                      <p className="text-xs text-gray-400 mt-1">Entrez le prix de livraison pour cette zone</p>
                    </div>

                    {/* Preview */}
                    {currentZone.name && currentZone.price > 0 && (
                      <div className="bg-purple-600/10 border border-purple-500/30 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Aperçu</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{currentZone.name}</span>
                          <span className="text-purple-400 font-mono font-bold">{currentZone.price.toLocaleString()} GNF</span>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 text-sm"
                      >
                        <Save size={16} /> Sauvegarder
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingZone(false)}
                        className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-medium transition text-sm"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {zoneToDelete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[400] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
                onClick={() => setZoneToDelete(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#0a0a0a] border border-red-500/30 rounded-lg p-4 sm:p-6 w-full max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-red-400">Confirmation</h2>
                    <button onClick={() => setZoneToDelete(null)} className="p-2 hover:bg-white/10 rounded-lg">
                      <X size={20} />
                    </button>
                  </div>

                  <p className="text-sm sm:text-base text-gray-300 mb-6">
                    Êtes-vous sûr de vouloir supprimer cette zone de livraison ? Cette action est irréversible.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <button
                      onClick={handleConfirmDeleteZone}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-medium transition text-sm"
                    >
                      Supprimer
                    </button>
                    <button
                      onClick={() => setZoneToDelete(null)}
                      className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg font-medium transition text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Icon Cropper Modal */}
          <IconCropper
            isOpen={isCropperOpen}
            onClose={() => setIsCropperOpen(false)}
            onSave={(croppedImage) => setPwaAppIcon(croppedImage)}
            initialImage={tempIconForCrop}
          />
        </>
      )}
    </>
  );
};

// Nav Button Component
const NavButton = ({ icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 rounded-xl transition-all text-sm ${
      active
        ? 'nebula-card text-purple-100 border border-purple-400/60 shadow-lg shadow-purple-500/30'
        : 'text-purple-300/60 hover:text-purple-200 hover:bg-purple-500/10 hover:border hover:border-purple-500/30'
    }`}
  >
    <div className={`${active ? 'text-purple-300' : 'text-purple-400/70'} transition-colors`}>
      {icon}
    </div>
    <span className="font-bold flex-1 text-left tracking-wide">{label}</span>
    {badge && (
      <span className="cosmic-button text-white text-xs px-2.5 py-1 rounded-full font-black shadow-lg">
        {badge}
      </span>
    )}
  </button>
);

// Mobile Nav Button Component
const MobileNavButton = ({ icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
      active
        ? 'nebula-card text-purple-100 border border-purple-400/60 shadow-lg shadow-purple-500/30'
        : 'text-purple-300/60 hover:text-purple-200 hover:bg-purple-500/10 hover:border hover:border-purple-500/30'
    }`}
  >
    <div className={`${active ? 'text-purple-300' : 'text-purple-400/70'} transition-colors`}>
      {icon}
    </div>
    <span className="font-bold flex-1 text-left">{label}</span>
    {badge && (
      <span className="cosmic-button text-white text-xs px-2.5 py-1 rounded-full font-black">
        {badge}
      </span>
    )}
  </button>
);
