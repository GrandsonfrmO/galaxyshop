
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X, ShoppingCart, Check, ChevronRight } from 'lucide-react';

export const ProductOverlay: React.FC = () => {
  const selectedProduct = useStore((state) => state.selectedProduct);
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const addToCart = useStore((state) => state.addToCart);

  // Local state for selections
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Reset selections when the product changes
  useEffect(() => {
    if (selectedProduct) {
      setSelectedSize(null);
      setSelectedColor(null);
    }
  }, [selectedProduct]);

  const handleAddToCart = () => {
    if (selectedSize && selectedColor && selectedProduct) {
      addToCart(selectedProduct, selectedSize, selectedColor);
      // We don't close the overlay immediately so they can see what they bought contextually
      // The cart sidebar will open automatically thanks to the store logic
    }
  };

  return (
    <AnimatePresence>
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-[#050505]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 text-white overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
             <button
                onClick={() => setSelectedProduct(null)}
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                <ChevronRight className="rotate-180" size={16} />
                BACK TO STORE
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {/* Hero Image */}
            <div className="relative h-[60vh] w-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center overflow-hidden">
              <img 
                src={selectedProduct.imageUrl} 
                alt={selectedProduct.name} 
                className="w-full h-full object-contain p-6 md:p-8"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 w-full p-8">
                 <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 leading-none">{selectedProduct.name}</h1>
                 <p className="text-3xl font-light tracking-tight text-white/80">{selectedProduct.price.toLocaleString('fr-GN')} GNF</p>
              </div>
            </div>
            
            <div className="p-8 pt-4 space-y-10">
                {/* Description */}
                <div>
                  <p className="text-gray-300 leading-relaxed text-lg font-light border-l-2 border-white/20 pl-4">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Configuration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gradient-to-br from-white/5 to-white/2 p-6 rounded-2xl border border-white/10">
                    {/* Size */}
                    <div>
                      <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        Sélectionner la Taille
                      </h3>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedProduct.sizes.map(size => (
                          <button 
                            key={size} 
                            onClick={() => setSelectedSize(size)}
                            className={`h-12 border rounded-lg font-semibold transition-all duration-200 ${
                              selectedSize === size 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/30' 
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color */}
                    <div>
                       <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        Sélectionner la Couleur
                       </h3>
                       <div className="flex flex-col gap-2">
                         {selectedProduct.colors.map(color => (
                           <button 
                            key={color} 
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-3 border rounded-lg flex items-center justify-between font-semibold transition-all duration-200 ${
                              selectedColor === color
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400 shadow-lg shadow-purple-500/30'
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5'
                            }`}
                           >
                             <span>{color}</span>
                             {selectedColor === color && <Check size={16} />}
                           </button>
                         ))}
                       </div>
                    </div>
                </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 md:p-8 border-t border-white/10 bg-gradient-to-r from-[#050505] to-[#0a0a0a]">
              <button 
                disabled={!selectedSize || !selectedColor}
                onClick={handleAddToCart}
                className={`w-full py-5 rounded-xl font-bold text-lg md:text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                  selectedSize && selectedColor
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                        : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={24} />
                AJOUTER AU PANIER
              </button>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
