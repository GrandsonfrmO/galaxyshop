import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/AppContext';
import { X, ShoppingBag, Eye, ZoomIn, Sparkles, Star } from 'lucide-react';

export const ShopModal: React.FC = () => {
  const { products, isShopOpen, toggleShop, setSelectedProduct } = useStore();
  const [zoomedProduct, setZoomedProduct] = useState<any>(null);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  return (
    <AnimatePresence>
      {isShopOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[40] galactic-bg overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 border-b border-slate-700/30 p-6 md:p-8 flex justify-between items-center shadow-2xl shadow-slate-900/20">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-slate-900/60 border border-slate-600/30">
                ⭐
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black tracking-[0.15em] uppercase bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300 bg-clip-text text-transparent">
                  GALAXIE COSMIQUE
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs text-slate-400/60 font-mono uppercase tracking-widest">
                    {products.length} articles stellaires
                  </p>
                  <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toggleShop(false)}
              className="p-3 bg-slate-700/20 hover:bg-slate-700/40 rounded-2xl transition-all border border-slate-700/30 hover:border-slate-600/60"
            >
              <X size={24} className="text-slate-300" />
            </button>
          </div>

          {/* Grid Content - Enhanced */}
          <div className="max-w-7xl mx-auto p-4 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, idx) => (
                <div 
                  key={product.id}
                  className="group nebula-card rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-slate-900/40 transition-all duration-300"
                >
                  {/* Star decoration */}
                  <div className="absolute top-3 right-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Star size={16} fill="currentColor" className="drop-shadow-lg" />
                  </div>

                  {/* Image Area */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 flex items-center justify-center border-b border-slate-700/20">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-3" 
                    />
                    
                    {/* Zoom Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedProduct(product);
                      }}
                      className="absolute top-3 left-3 p-2 bg-slate-900/70 hover:bg-slate-800/90 rounded-xl backdrop-blur-md border border-slate-600/30 transition-all opacity-0 group-hover:opacity-100 hover:border-slate-500/60 hover:shadow-lg hover:shadow-slate-900/50 z-10"
                    >
                      <ZoomIn size={18} className="text-slate-300" />
                    </button>
                    
                    {/* Category badge */}
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-600/30 opacity-100 group-hover:opacity-0 transition-opacity">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{product.category}</span>
                    </div>
                    
                    {/* Multiple images indicator */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full border border-blue-400/30 opacity-100 group-hover:opacity-0 transition-opacity">
                        <span className="text-[10px] font-bold text-blue-300">📸 {product.images.length}</span>
                      </div>
                    )}
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                      <button 
                        onClick={() => handleProductClick(product)}
                        className="cosmic-button text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-2xl shadow-slate-900/50"
                      >
                        <Eye size={18} />
                        <span className="hidden md:inline">VOIR DÉTAILS</span>
                        <span className="md:hidden">VOIR</span>
                      </button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-4 md:p-5 bg-gradient-to-t from-slate-900 via-slate-800 to-slate-800">
                    <div className="flex flex-col gap-2 mb-3">
                      <h3 className="text-sm md:text-base font-bold leading-tight line-clamp-2 text-slate-100">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400">
                          {product.price.toLocaleString('fr-GN')}
                        </span>
                        <span className="text-[10px] text-slate-400/60 uppercase tracking-wider">GNF</span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400/60 text-xs line-clamp-2 hidden md:block mb-3">
                      {product.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex gap-1">
                        {product.sizes.slice(0, 3).map(s => (
                          <span 
                            key={s} 
                            className="text-[10px] border border-slate-600/40 px-2 py-1 rounded-lg text-slate-300/80 bg-slate-700/10 hover:bg-slate-700/20 transition-colors font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {product.sizes.length > 3 && (
                          <span className="text-[10px] text-slate-400/50 py-1 px-1 font-medium">
                            +{product.sizes.length - 3}
                          </span>
                        )}
                      </div>
                      
                      {/* Color indicator */}
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-[10px] text-slate-400/60">🎨</span>
                        <span className="text-[10px] font-bold text-slate-300">{product.colors.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Zoom Modal */}
          <AnimatePresence>
            {zoomedProduct && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setZoomedProduct(null)}
                className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-2xl w-full nebula-card rounded-2xl overflow-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setZoomedProduct(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-slate-900/60 hover:bg-slate-800/80 rounded-lg backdrop-blur-md border border-slate-600/30 transition-all hover:border-slate-500/60"
                  >
                    <X size={24} className="text-slate-300" />
                  </button>

                  {/* Image Container */}
                  <div className="aspect-[4/5] bg-gradient-to-br from-slate-700/10 to-slate-600/5 flex items-center justify-center p-6">
                    <img
                      src={zoomedProduct.imageUrl}
                      alt={zoomedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 bg-gradient-to-t from-slate-900/80 to-slate-900/40">
                    <h3 className="text-2xl font-bold mb-2 text-slate-100">{zoomedProduct.name}</h3>
                    <p className="text-slate-400/70 mb-4">{zoomedProduct.description}</p>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex gap-2 flex-wrap">
                        {zoomedProduct.sizes.map((s: string) => (
                          <span key={s} className="text-xs border border-slate-600/40 px-3 py-1 rounded-md text-slate-300/80 bg-slate-700/10">{s}</span>
                        ))}
                      </div>
                      <span className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-300">{zoomedProduct.price.toLocaleString('fr-GN')} GNF</span>
                    </div>
                    <button
                      onClick={() => {
                        handleProductClick(zoomedProduct);
                        setZoomedProduct(null);
                      }}
                      className="cosmic-button w-full text-white py-3 rounded-xl font-bold transition-all"
                    >
                      VOIR DÉTAILS
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
