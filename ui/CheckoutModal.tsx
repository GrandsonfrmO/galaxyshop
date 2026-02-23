import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../context/AppContext';
import { X, CheckCircle, Banknote, ArrowRight, Package, MapPin, Sparkles, Zap, ShoppingBag } from 'lucide-react';
import { MODAL_ENTER, FADE_IN, STAGGER_CONTAINER, STAGGER_ITEM } from '../config/animations';

export const CheckoutModal: React.FC = () => {
  const { cart, isCheckoutOpen, toggleCheckout, clearCart, deliveryZones } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Conakry',
    zoneId: ''
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const selectedZone = useMemo(() =>
    deliveryZones.find(z => z.id === formData.zoneId),
  [formData.zoneId, deliveryZones]);

  const deliveryFee = selectedZone ? selectedZone.price : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zoneId) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        deliveryZone: selectedZone?.name || '',
        deliveryFee: deliveryFee,
        subtotal: subtotal,
        totalAmount: total,
        items: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          priceAtPurchase: item.price
        }))
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const order = await response.json();
      console.log('✅ Order created successfully:', order);

      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();

      setTimeout(() => {
        setIsSuccess(false);
        toggleCheckout(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', city: 'Conakry', zoneId: '' });
      }, 8000);
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      setIsSubmitting(false);
      alert('Erreur lors de la création de la commande. Veuillez réessayer.');
    }
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isSuccess && toggleCheckout(false)}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />

          <motion.div
            initial={MODAL_ENTER.initial}
            animate={MODAL_ENTER.animate}
            exit={MODAL_ENTER.exit}
            transition={MODAL_ENTER.transition}
            className="relative galactic-bg border border-slate-800/60 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl shadow-slate-950/40 flex flex-col md:flex-row"
          >
            {isSuccess ? (
              <motion.div
                {...FADE_IN}
                className="w-full py-20 flex flex-col items-center justify-center text-center p-8 galactic-bg"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.8 }}
                  className="w-28 h-28 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6 shadow-2xl shadow-slate-950/50 glow-element border border-slate-700/50"
                >
                  <CheckCircle size={56} strokeWidth={2.5} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4 max-w-2xl"
                >
                  <h2 className="text-4xl font-bold text-slate-200">
                    Commande Confirmée
                  </h2>

                  <div className="nebula-card rounded-2xl p-6 space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-800/60 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Client</p>
                        <p className="font-semibold text-lg text-slate-200">{formData.firstName} {formData.lastName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-800/60 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                        <MapPin size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Livraison vers</p>
                        <p className="font-semibold text-slate-200">{selectedZone?.name}</p>
                        <p className="text-sm text-slate-600 mt-1">{formData.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-800/60 rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                        <span className="text-lg">📱</span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Contact</p>
                        <p className="font-semibold text-slate-200">+224 {formData.phone}</p>
                        <p className="text-xs text-slate-600 mt-1">Le livreur vous contactera sur ce numéro</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-800/40 pt-4 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-600">Montant total</span>
                        <span className="text-2xl font-mono font-bold text-slate-200">{total.toLocaleString('fr-GN')} <span className="text-sm text-slate-600">GNF</span></span>
                      </div>
                      <div className="bg-slate-800/30 border border-slate-800/60 rounded-lg p-3 flex items-center gap-2">
                        <Banknote size={16} className="text-slate-500" />
                        <p className="text-xs text-slate-500">À payer en espèces à la livraison</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/20 border border-slate-800/50 rounded-xl p-6 nebula-card">
                    <p className="text-xs text-slate-600 uppercase tracking-widest mb-2">Numéro de commande</p>
                    <p className="font-mono text-3xl font-bold text-slate-300">GN-#{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
                    <p className="text-xs text-slate-600 mt-3">📧 Un email de confirmation a été envoyé à <span className="text-slate-400">{formData.email}</span></p>
                  </div>

                  <button
                    onClick={() => toggleCheckout(false)}
                    className="cosmic-button w-full text-slate-100 py-4 rounded-xl font-bold transition-all"
                  >
                    Continuer mes achats
                  </button>
                </motion.div>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 p-6 md:p-12 border-b md:border-b-0 md:border-r border-slate-800/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950">
                  <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-2xl font-bold text-slate-100">Paiement</h2>
                    <button onClick={() => toggleCheckout(false)} className="p-2 hover:bg-slate-800/50 rounded-xl transition border border-slate-800/40">
                      <X size={24} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="hidden md:block mb-10">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-slate-950/50 border border-slate-700/50">
                        <Sparkles size={28} className="text-slate-300" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-slate-200">Finaliser la commande</h2>
                        <p className="text-slate-600 text-sm mt-1">Remplissez vos informations de livraison</p>
                      </div>
                    </div>
                  </div>

                  <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-800/50">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-950/50 border border-slate-700/50">
                          <span className="text-lg font-bold text-slate-300">1</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Informations personnelles</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                            Prénom <span className="text-red-500 text-lg">*</span>
                          </label>
                          <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 hover:border-slate-700/80 focus:border-slate-700 rounded-xl p-3.5 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 placeholder-slate-700 font-medium" placeholder="Mamadou" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                            Nom <span className="text-red-500 text-lg">*</span>
                          </label>
                          <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 hover:border-slate-700/80 focus:border-slate-700 rounded-xl p-3.5 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 placeholder-slate-700 font-medium" placeholder="Diallo" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                          Email <span className="text-red-500 text-lg">*</span>
                        </label>
                        <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 hover:border-slate-700/80 focus:border-slate-700 rounded-xl p-3.5 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 placeholder-slate-700 font-medium" placeholder="exemple@email.com" />
                        <p className="text-xs text-slate-600 mt-1.5">Pour recevoir la confirmation de commande</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                          Téléphone <span className="text-red-500 text-lg">*</span>
                        </label>
                        <div className="flex">
                          <span className="bg-slate-800/60 border-2 border-slate-800/60 border-r-0 rounded-l-xl p-3.5 text-slate-500 flex items-center font-mono text-sm font-bold">🇬🇳 +224</span>
                          <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 rounded-r-xl p-3.5 focus:border-slate-700 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 placeholder-slate-700 font-medium" placeholder="6xx xx xx xx" />
                        </div>
                        <p className="text-xs text-slate-600 mt-1.5">Le livreur vous contactera sur ce numéro</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-800/50">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center shadow-lg shadow-slate-950/50 border border-slate-700/50">
                          <span className="text-lg font-bold text-slate-300">2</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-200 uppercase tracking-wider">Adresse de livraison</h3>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-2">
                          <MapPin size={16} className="text-slate-500" />
                          Zone de Livraison <span className="text-red-500 text-lg">*</span>
                        </label>
                        <select required name="zoneId" value={formData.zoneId} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 hover:border-slate-700/80 focus:border-slate-700 rounded-xl p-3.5 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 cursor-pointer font-medium">
                          <option value="" disabled className="text-slate-700">Choisir votre zone...</option>
                          {deliveryZones.map(zone => (
                            <option key={zone.id} value={zone.id} className="bg-slate-950 text-slate-100">
                              {zone.name} - {zone.price === 0 ? 'Livraison gratuite' : `${zone.price.toLocaleString('fr-GN')} GNF`}
                            </option>
                          ))}
                        </select>
                        {selectedZone && (
                          <div className={`mt-3 p-4 rounded-xl border-2 transition-all ${selectedZone.price === 0 ? 'bg-slate-800/30 border-slate-800/60' : 'bg-slate-800/30 border-slate-800/60'}`}>
                            <p className="text-xs font-semibold flex items-center gap-2">
                              {selectedZone.price === 0 ? (
                                <>
                                  <span className="text-lg">✓</span>
                                  <span className="text-slate-400">Livraison gratuite pour <span className="text-slate-300">{selectedZone.name}</span></span>
                                </>
                              ) : (
                                <>
                                  <span className="text-lg">🚚</span>
                                  <span className="text-slate-400">Frais de livraison: <span className="text-slate-300">{selectedZone.price.toLocaleString('fr-GN')} GNF</span> pour {selectedZone.name}</span>
                                </>
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold flex items-center gap-1">
                          Adresse précise <span className="text-red-500 text-lg">*</span>
                        </label>
                        <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border-2 border-slate-800/60 hover:border-slate-700/80 focus:border-slate-700 rounded-xl p-3.5 focus:bg-white/10 focus:ring-2 focus:ring-slate-700/30 outline-none transition-all text-slate-100 placeholder-slate-700 font-medium" placeholder="Ex: Kipé, Centre Émetteur, à côté de la pharmacie" />
                        <p className="text-xs text-slate-600 mt-1.5">Soyez le plus précis possible pour faciliter la livraison</p>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="w-full md:w-[480px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 p-8 flex flex-col h-full border-t md:border-t-0 md:border-l border-slate-800/40">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-200">Récapitulatif</h2>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-600 font-mono uppercase tracking-widest">{cart.length} article{cart.length > 1 ? 's' : ''}</span>
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full shadow-lg shadow-slate-950/50" />
                      </div>
                    </div>
                    <button onClick={() => toggleCheckout(false)} className="hidden md:block p-2.5 hover:bg-slate-800/50 rounded-xl transition border border-slate-800/40">
                      <X size={24} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-hide mb-8 space-y-3 max-h-[250px] md:max-h-none pr-2">
                    <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="space-y-3">
                      {cart.map((item, idx) => (
                        <motion.div key={item.cartId} variants={STAGGER_ITEM} className="nebula-card p-4 rounded-xl hover:shadow-lg hover:shadow-slate-950/40 transition-all duration-300 group relative border border-slate-800/40 hover:border-slate-700/60">
                          {/* Item Counter */}
                          <div className="absolute -top-2 -left-2 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-slate-300 text-xs font-bold shadow-lg border border-slate-700/50">
                            {idx + 1}
                          </div>

                          <div className="flex gap-4">
                            <div className="w-24 h-24 bg-gradient-to-br from-slate-800/40 to-slate-950 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-700/40 group-hover:border-slate-600/60 transition-all shadow-md">
                              <img src={item.imageUrl} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform" alt={item.name} />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <p className="font-semibold text-sm truncate text-slate-200 group-hover:text-slate-100 transition-colors">{item.name}</p>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className="text-xs bg-slate-800/40 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700/40 font-medium">{item.selectedSize}</span>
                                  <span className="text-xs bg-slate-800/40 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700/40 font-medium">{item.selectedColor}</span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/40">
                                <p className="text-xs text-slate-600 font-semibold">Qté: <span className="text-slate-300 font-bold text-sm">{item.quantity}</span></p>
                                <p className="text-sm font-mono font-bold text-slate-300">{(item.price * item.quantity).toLocaleString('fr-GN')}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="border-t border-slate-800/40 pt-8 space-y-4">
                    <div className="space-y-3 nebula-card rounded-xl p-5 border border-slate-800/40">
                      <div className="flex justify-between text-sm items-center pb-3 border-b border-slate-800/40">
                        <span className="text-slate-600 font-semibold">Sous-total</span>
                        <span className="font-mono font-bold text-lg text-slate-300">{subtotal.toLocaleString('fr-GN')} <span className="text-xs text-slate-600">GNF</span></span>
                      </div>
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-slate-600 font-semibold flex items-center gap-2">
                          <Package size={16} className="text-slate-500" />
                          Livraison
                        </span>
                        <span className={`font-bold uppercase text-xs tracking-wider transition-colors ${deliveryFee === 0 ? 'text-slate-500 text-sm' : 'font-mono text-slate-300'}`}>
                          {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-GN')} GNF`}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-2xl font-bold bg-slate-800/40 p-6 rounded-2xl border-2 border-slate-800/60 shadow-xl shadow-slate-950/30 glow-element">
                      <span className="text-slate-200 font-bold uppercase tracking-wider">Total</span>
                      <span className="font-mono text-slate-200 text-3xl">{total.toLocaleString('fr-GN')} <span className="text-lg text-slate-600">GNF</span></span>
                    </div>

                    <div className="bg-slate-800/30 border-2 border-slate-800/60 p-5 rounded-2xl flex items-start gap-4 shadow-lg shadow-slate-950/20">
                      <div className="w-12 h-12 bg-slate-800/60 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-700/50">
                        <Banknote className="text-slate-400" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-300 mb-1">Paiement à la livraison</p>
                        <p className="text-xs text-slate-600 leading-relaxed">Payez en espèces lors de la réception. Aucun paiement en ligne requis.</p>
                      </div>
                    </div>

                    <button type="submit" form="checkout-form" disabled={isSubmitting || !formData.zoneId} className="cosmic-button w-full py-4 mt-6 text-slate-100 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none shadow-xl shadow-slate-950/30 hover:shadow-slate-950/50 uppercase tracking-wider">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-slate-300/30 border-t-slate-300 rounded-full animate-spin"></div>
                          <span>TRAITEMENT...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={22} />
                          <span>CONFIRMER LA COMMANDE</span>
                          <ArrowRight size={22} />
                        </>
                      )}
                    </button>

                    {!formData.zoneId && (
                      <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-3 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        <p className="text-xs text-red-300 font-semibold">Veuillez sélectionner une zone de livraison</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
