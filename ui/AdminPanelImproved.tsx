import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminDashboard } from './AdminDashboard';
import { IconCropper } from './IconCropper';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  LogOut, Plus, Search, Edit2, Trash2, X, Save, Upload, Tag,
  Activity, ArrowUpRight, DollarSign, Box, ChevronLeft, Image as ImageIcon,
  Menu, ChevronDown
} from 'lucide-react';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

const CATEGORIES = ['Vêtements', 'Pantalons', 'Accessoires', 'Chaussures', 'Édition Limitée', 'Autre'];
const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
const AVAILABLE_COLORS = ['Noir', 'Blanc', 'Gris', 'Rouge', 'Bleu', 'Vert', 'Jaune', 'Orange', 'Rose', 'Violet', 'Marron', 'Beige'];

export const AdminPanelImproved: React.FC = () => {
  const { isAdmin, products, addProduct, updateProduct, deleteProduct, toggleAdmin, logoutAdmin, adminLoginTime, deliveryZones, addDeliveryZone, updateDeliveryZone, deleteDeliveryZone, appName, appIcon, setAppName, setAppIcon } = useStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'delivery' | 'pwa'>('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<string>('');
  
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
        sizes: ['M', 'L'],
        colors: ['Noir'],
        position: [0, 0, 0]
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.imageUrl) {
        alert("L'image est obligatoire.");
        return;
    }
    
    const exists = products.some(p => p.id === currentProduct.id);
    
    if (exists) {
      updateProduct(currentProduct as Product);
    } else {
      addProduct(currentProduct as Product);
    }
    setIsEditing(false);
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
      {/* Admin Button - Floating - Only visible when admin is logged in */}
      {isAdmin && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings size={24} />
        </motion.button>
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
                  className="fixed left-0 top-0 h-screen w-80 md:w-96 bg-[#020202] text-white border-r border-purple-500/20 flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-6 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-transparent">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg sm:text-xl">G</div>
                      <div>
                        <h1 className="font-black tracking-[0.2em] text-sm sm:text-lg">ADMIN</h1>
                        <p className="text-[8px] sm:text-[10px] text-gray-500 font-mono uppercase tracking-widest">v2.0</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <X size={20} />
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
                      badge="3" 
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
                          badge="3" 
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
                      {/* Toolbar */}
                      <div className="flex flex-col gap-2 sm:gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Chercher..." 
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm focus:border-purple-500 outline-none text-white" 
                          />
                        </div>
                        <button 
                          onClick={() => handleEdit()} 
                          className="bg-purple-600 hover:bg-purple-700 px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition text-sm"
                        >
                          <Plus size={16} /> Ajouter
                        </button>
                      </div>

                      {/* Products Grid - 2 colonnes */}
                      <div className="grid grid-cols-2 gap-2 sm:gap-4">
                        {filteredProducts.map(product => (
                          <motion.div
                            key={product.id}
                            layout
                            className="bg-white/5 border border-white/10 rounded-lg p-2 sm:p-3 hover:border-purple-500/50 transition"
                          >
                            <div className="aspect-square bg-white/5 rounded-lg mb-2 overflow-hidden">
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="font-bold text-xs mb-1 line-clamp-2">{product.name}</h3>
                            <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                            <p className="text-xs sm:text-sm font-mono font-bold text-purple-400 mb-2">{product.price.toLocaleString()} GNF</p>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleEdit(product)}
                                className="flex-1 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 py-1 rounded text-xs font-medium transition flex items-center justify-center gap-0.5"
                              >
                                <Edit2 size={10} /> Modifier
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-300 py-1 rounded text-xs font-medium transition flex items-center justify-center gap-0.5"
                              >
                                <Trash2 size={10} /> Supprimer
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'orders' && (
                    <div className="flex flex-col items-center justify-center h-64 text-center text-gray-500">
                      <ShoppingCart size={40} className="mb-3 sm:mb-4 opacity-20" />
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">Gestion des Commandes</h3>
                      <p className="text-xs sm:text-sm">Ce module sera disponible une fois l'API de paiement intégrée.</p>
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
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
                          {/* App Name */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2">Nom de l'Application</label>
                            <input
                              type="text"
                              value={pwaAppName}
                              onChange={(e) => setPwaAppName(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus:border-purple-500 outline-none"
                              placeholder="The Boutique"
                            />
                            <p className="text-xs text-gray-400 mt-2">Ce nom apparaîtra sur l'écran d'accueil et dans les paramètres de l'app</p>
                          </div>

                          {/* App Icon */}
                          <div>
                            <label className="block text-xs sm:text-sm font-medium mb-2">Icône de l'Application</label>
                            <div className="flex flex-col sm:flex-row gap-4">
                              {pwaAppIcon && (
                                <div className="relative w-24 h-24">
                                  <img src={pwaAppIcon} alt="App Icon" className="w-full h-full rounded-lg object-cover border border-white/10" />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTempIconForCrop(pwaAppIcon);
                                      setIsCropperOpen(true);
                                    }}
                                    className="absolute inset-0 bg-black/50 rounded-lg opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    <Edit2 size={16} className="text-white" />
                                  </button>
                                </div>
                              )}
                              <div className="flex-1 space-y-2">
                                <label className="flex-1 border-2 border-dashed border-purple-500/50 rounded-lg p-4 text-center hover:border-purple-500 transition cursor-pointer block">
                                  <Upload size={20} className="mx-auto mb-2 text-purple-400" />
                                  <p className="text-xs sm:text-sm">Cliquez pour uploader l'icône</p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                          const result = event.target?.result as string;
                                          setTempIconForCrop(result);
                                          setIsCropperOpen(true);
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                                {pwaAppIcon && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTempIconForCrop(pwaAppIcon);
                                      setIsCropperOpen(true);
                                    }}
                                    className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-sm transition"
                                  >
                                    Rogner l'icône
                                  </button>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">Recommandé: 512x512px PNG avec fond transparent</p>
                          </div>

                          {/* Save Button */}
                          <button
                            onClick={() => {
                              setAppName(pwaAppName);
                              setAppIcon(pwaAppIcon);
                              alert('Paramètres PWA mis à jour avec succès!');
                            }}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
                          >
                            <Save size={18} /> Sauvegarder les paramètres
                          </button>

                          {/* Info Box */}
                          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-blue-300">
                              💡 Les utilisateurs pourront installer l'app depuis leur navigateur sur iPhone et Android. Les paramètres seront appliqués après la prochaine mise à jour du manifest.
                            </p>
                          </div>
                        </div>
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
                    {/* Image Upload */}
                    <div>
                      <label className="block text-xs sm:text-sm font-medium mb-2">Image</label>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        {currentProduct.imageUrl && (
                          <img src={currentProduct.imageUrl} alt="preview" className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover" />
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 border-2 border-dashed border-purple-500/50 rounded-lg p-3 sm:p-4 text-center hover:border-purple-500 transition"
                        >
                          <Upload size={20} className="mx-auto mb-2 text-purple-400" />
                          <p className="text-xs sm:text-sm">Cliquez pour uploader</p>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
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
    className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm ${
      active
        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);

// Mobile Nav Button Component
const MobileNavButton = ({ icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm ${
      active
        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge && (
      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
        {badge}
      </span>
    )}
  </button>
);
