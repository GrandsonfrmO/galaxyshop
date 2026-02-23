
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/AppContext';
import { X, Trash2, CreditCard, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { SIDEBAR_ENTER, FADE_IN, SLIDE_UP, STAGGER_CONTAINER, STAGGER_ITEM } from '../config/animations';

export const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, removeFromCart, toggleCheckout, toggleShop } = useStore();

  // Calculate Total
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleProceedToCheckout = () => {
      toggleCart(false);
      toggleCheckout(true);
  };

  const handleStartShopping = () => {
      toggleCart(false);
      toggleShop(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={SIDEBAR_ENTER.initial}
            animate={SIDEBAR_ENTER.animate}
            exit={SIDEBAR_ENTER.exit}
            transition={SIDEBAR_ENTER.transition}
            className="fixed right-0 top-0 h-full w-full sm:w-[450px] bg-slate-950 border-l border-slate-800/60 shadow-2xl shadow-slate-950/40 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800/40 flex justify-between items-center bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-950/50 border border-slate-700/50">
                  <ShoppingBag size={20} className="text-slate-300" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-wider text-slate-100">
                    PANIER
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">
                      {cart.length} article{cart.length > 1 ? 's' : ''}
                    </span>
                    {cart.length > 0 && (
                      <span className="w-1.5 h-1.5 bg-slate-600 rounded-full shadow-lg shadow-slate-950/50" />
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleCart(false)}
                className="p-2.5 hover:bg-slate-800/50 rounded-xl transition-all border border-slate-800/40 hover:border-slate-700/60"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {cart.length === 0 ? (
                <div
                  className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4"
                >
                  <div>
                    <ShoppingBag size={48} className="text-slate-700/60" />
                  </div>
                  <p className="text-center">Votre panier est vide</p>
                  <button
                    onClick={handleStartShopping}
                    className="text-slate-400 border-b border-slate-600 pb-0.5 hover:text-slate-300 transition-colors"
                  >
                    Commencer vos achats
                  </button>
                </div>
              ) : (
                <div
                  className="space-y-4"
                >
                  {cart.map((item, index) => (
                    <div
                      key={item.cartId}
                      className="nebula-card p-4 rounded-2xl hover:shadow-xl hover:shadow-slate-950/40 transition-all"
                    >
                      {/* Item number badge */}
                      <div className="absolute top-2 left-2 w-6 h-6 bg-slate-800/60 rounded-full flex items-center justify-center border border-slate-700/50">
                        <span className="text-[10px] font-bold text-slate-400">{index + 1}</span>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-24 h-28 bg-gradient-to-br from-slate-800/40 to-slate-950 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700/40 shadow-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h3 className="font-semibold text-sm text-slate-200 line-clamp-2">
                                {item.name}
                              </h3>
                            </div>

                            {/* Tags for size and color */}
                            <div className="flex gap-1.5 mb-2">
                              <span className="text-[10px] bg-slate-800/40 text-slate-400 px-2 py-1 rounded-full border border-slate-700/40 font-medium">
                                {item.selectedSize}
                              </span>
                              <span className="text-[10px] bg-slate-800/40 text-slate-400 px-2 py-1 rounded-full border border-slate-700/40 font-medium">
                                {item.selectedColor}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-mono font-bold text-slate-200">
                                {item.price.toLocaleString('fr-GN')}
                              </span>
                              <span className="text-[10px] text-slate-600">GNF</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-800/40">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600">Quantité:</span>
                              <span className="text-sm font-semibold text-slate-300 bg-slate-800/40 px-2 py-0.5 rounded-full">
                                {item.quantity}
                              </span>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.cartId)}
                              className="text-slate-600 hover:text-slate-400 p-2 hover:bg-slate-800/40 rounded-lg transition-all border border-slate-800/40 hover:border-slate-700/60"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Subtle total for this item */}
                      <div className="mt-3 pt-3 border-t border-slate-800/30 flex justify-between items-center">
                        <span className="text-[10px] text-slate-600 uppercase tracking-wider">Total article</span>
                        <span className="text-sm font-mono font-bold text-slate-400">
                          {(item.price * item.quantity).toLocaleString('fr-GN')} GNF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
                <div className="p-6 border-t border-slate-800/40 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-950">
                    <div className="space-y-4">
                      {/* Summary card */}
                      <div className="bg-slate-800/30 border border-slate-700/40 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-slate-500 uppercase tracking-wider font-medium">Sous-total</span>
                          <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-slate-200">
                              {total.toLocaleString('fr-GN')}
                            </div>
                            <div className="text-[10px] text-slate-600 uppercase tracking-widest">GNF</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-800/20 rounded-lg p-2 border border-slate-800/40">
                          <span className="text-sm">ℹ️</span>
                          <span>Frais de livraison calculés au checkout</span>
                        </div>
                      </div>

                      {/* Checkout button */}
                      <button
                        onClick={handleProceedToCheckout}
                        className="cosmic-button w-full py-4 text-slate-100 rounded-2xl font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-slate-950/30"
                      >
                        <ShoppingBag size={20} />
                        VALIDER LE PANIER
                        <ArrowRight size={20} />
                      </button>

                      {/* Security badge */}
                      <div className="flex items-center justify-center gap-3 text-slate-600 bg-slate-900/50 rounded-xl p-3 border border-slate-800/40">
                        <CreditCard size={16} />
                        <span className="text-[10px] uppercase tracking-widest font-medium">Paiement Sécurisé</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 bg-slate-600 rounded-full" />
                          <div className="w-1 h-1 bg-slate-600 rounded-full" />
                          <div className="w-1 h-1 bg-slate-600 rounded-full" />
                        </div>
                      </div>

                      {/* Continue shopping link */}
                      <button
                        onClick={handleStartShopping}
                        className="w-full text-center text-slate-600 text-xs hover:text-slate-400 transition-colors py-2 hover:bg-slate-800/30 rounded-lg border border-transparent hover:border-slate-800/40"
                      >
                        ← Continuer les achats
                      </button>
                    </div>
                </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
