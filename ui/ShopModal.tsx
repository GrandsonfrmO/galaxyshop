import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X, ShoppingBag, Eye, ZoomIn } from 'lucide-react';

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
          className="fixed inset-0 z-[40] bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 z-50 bg-gradient-to-b from-[#050505]/95 to-[#050505]/80 backdrop-blur-xl border-b border-white/10 p-6 md:p-8 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                   <ShoppingBag size={24} className="text-white" />
               </div>
               <div>
                   <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Catalogue</h2>
                   <p className="text-xs text-gray-400 mt-1">{products.length} articles disponibles</p>
               </div>
            </div>
            <button 
              onClick={() => toggleShop(false)}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 hover:border-white/20"
            >
              <X size={24} />
            </button>
          </div>

          {/* Grid Content */}
          <div className="max-w-7xl mx-auto p-4 md:p-12">
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {products.map((product) => (
                <motion.div 
                  key={product.id}
                  layoutId={`product-${product.id}`}
                  className="group relative bg-gradient-to-br from-white/5 to-white/2 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 cursor-pointer"
                >
                  {/* Image Area */}
                  <div className="aspect-[4/5] overflow-hidden relative bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-110" 
                    />
                    
                    {/* Zoom Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedProduct(product);
                      }}
                      className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ZoomIn size={18} className="text-white" />
                    </button>
                    
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                        <button 
                            onClick={() => handleProductClick(product)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-sm hover:from-purple-700 hover:to-pink-700 shadow-lg"
                        >
                            <Eye size={18} />
                            <span className="hidden md:inline">VOIR DÉTAILS</span>
                            <span className="md:hidden">VOIR</span>
                        </button>
                    </div>
                  </div>

                  {/* Info Area */}
                  <div className="p-4 md:p-6 bg-gradient-to-t from-black/40 to-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-3 gap-2">
                        <h3 className="text-sm md:text-lg font-bold leading-tight line-clamp-2">{product.name}</h3>
                        <span className="font-mono text-sm md:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 whitespace-nowrap">{product.price.toLocaleString('fr-GN')} GNF</span>
                    </div>
                    <p className="text-gray-400 text-xs md:text-sm line-clamp-2 hidden md:block mb-3">{product.description}</p>
                    
                    <div className="flex gap-1 md:gap-2 flex-wrap">
                        {product.sizes.slice(0, 3).map(s => (
                            <span key={s} className="text-[10px] md:text-xs border border-white/20 px-2 py-1 md:px-2.5 md:py-1.5 rounded-md text-gray-300 bg-white/5 hover:bg-white/10 transition-colors">{s}</span>
                        ))}
                        {product.sizes.length > 3 && <span className="text-[10px] md:text-xs text-gray-500 py-1 px-1">+{product.sizes.length - 3}</span>}
                    </div>
                  </div>
                </motion.div>
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
                  className="relative max-w-2xl w-full bg-gradient-to-br from-white/10 to-white/5 rounded-2xl border border-white/20 overflow-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setZoomedProduct(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-lg backdrop-blur-md border border-white/20 transition-all"
                  >
                    <X size={24} className="text-white" />
                  </button>

                  {/* Image Container */}
                  <div className="aspect-[4/5] bg-gradient-to-br from-white/5 to-white/2 flex items-center justify-center p-6">
                    <img
                      src={zoomedProduct.imageUrl}
                      alt={zoomedProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-2xl font-bold mb-2">{zoomedProduct.name}</h3>
                    <p className="text-gray-300 mb-4">{zoomedProduct.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2 flex-wrap">
                        {zoomedProduct.sizes.map((s: string) => (
                          <span key={s} className="text-xs border border-white/20 px-3 py-1 rounded-md text-gray-300 bg-white/5">{s}</span>
                        ))}
                      </div>
                      <span className="font-mono text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{zoomedProduct.price.toLocaleString('fr-GN')} GNF</span>
                    </div>
                    <button
                      onClick={() => {
                        handleProductClick(zoomedProduct);
                        setZoomedProduct(null);
                      }}
                      className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all"
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
