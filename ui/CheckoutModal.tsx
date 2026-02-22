import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { X, CheckCircle, Banknote, ArrowRight, Package, MapPin } from 'lucide-react';
import { MODAL_ENTER, FADE_IN, SLIDE_UP, STAGGER_CONTAINER, STAGGER_ITEM } from '../config/animations';

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
  
  // Trouver la zone sélectionnée pour avoir le prix
  const selectedZone = useMemo(() => 
    deliveryZones.find(z => z.id === formData.zoneId), 
  [formData.zoneId, deliveryZones]);

  const deliveryFee = selectedZone ? selectedZone.price : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.zoneId) return; // Validation extra

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        setIsSuccess(false);
        toggleCheckout(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', city: 'Conakry', zoneId: '' });
      }, 8000); 
    }, 2000);
  };

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
           {/* Backdrop */}
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={() => !isSuccess && toggleCheckout(false)}
             className="absolute inset-0 bg-black/80 backdrop-blur-md"
           />

           {/* Modal */}
           <motion.div 
             initial={MODAL_ENTER.initial}
             animate={MODAL_ENTER.animate}
             exit={MODAL_ENTER.exit}
             transition={MODAL_ENTER.transition}
             className="relative bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] border border-white/10 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
           >
              {isSuccess ? (
                <motion.div 
                  {...FADE_IN}
                  className="w-full py-20 flex flex-col items-center justify-center text-center p-8 bg-[#0a0a0a]"
                >
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black mb-6"
                    >
                        <CheckCircle size={48} />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Commande Confirmée !</h2>
                    <p className="text-gray-400 max-w-md">
                        Merci {formData.firstName} !
                        <br/><br/>
                        Livraison prévue vers : <strong>{selectedZone?.name}</strong>.
                        <br/>
                        Notre livreur vous contactera au <strong>+224 {formData.phone}</strong>.
                        <br/><br/>
                        Total à payer : <span className="text-white font-bold font-mono text-xl">{total.toLocaleString('fr-GN')} GNF</span>
                    </p>
                    <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">ID Commande</p>
                        <p className="font-mono text-xl">GN-#{Math.floor(Math.random() * 1000000)}</p>
                    </div>
                    <button onClick={() => toggleCheckout(false)} className="mt-8 text-white underline underline-offset-4 hover:text-gray-300">
                        Fermer
                    </button>
                </motion.div>
              ) : (
                <>
                  {/* Left: Form */}
                  <div className="flex-1 p-6 md:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-gradient-to-br from-[#0a0a0a] to-[#0f0f0f]">
                    <div className="flex justify-between items-center mb-8 md:hidden">
                       <h2 className="text-2xl font-bold">Paiement</h2>
                       <button onClick={() => toggleCheckout(false)} className="p-2 hover:bg-white/10 rounded-lg transition"><X size={24} /></button>
                    </div>
                    
                    <h2 className="text-3xl font-bold mb-10 hidden md:flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-white" />
                        </div>
                        Livraison (Guinée)
                    </h2>
                    
                    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Prénom</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-600" placeholder="Mamadou" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Nom</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-600" placeholder="Diallo" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Email</label>
                            <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-600" placeholder="exemple@email.com" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Téléphone</label>
                            <div className="flex">
                                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-white/10 border-r-0 rounded-l-xl p-3 text-gray-400 flex items-center font-mono text-sm">🇬🇳 +224</span>
                                <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-r-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-600" placeholder="6xx xx xx xx" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold flex items-center gap-2">
                                <MapPin size={14} className="text-purple-400" />
                                Zone de Livraison
                            </label>
                            <select 
                                required 
                                name="zoneId" 
                                value={formData.zoneId} 
                                onChange={handleInputChange} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white cursor-pointer"
                            >
                                <option value="" disabled className="text-gray-500">Choisir votre zone...</option>
                                {deliveryZones.map(zone => (
                                    <option key={zone.id} value={zone.id} className="bg-black text-white">
                                        {zone.name} - {zone.price === 0 ? 'Gratuit' : `${zone.price.toLocaleString('fr-GN')} GNF`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Précision Adresse</label>
                            <input required name="address" value={formData.address} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500/50 focus:bg-white/10 focus:ring-1 focus:ring-purple-500/20 outline-none transition-all text-white placeholder-gray-600" placeholder="Ex: Kipé, Centre Émetteur, à côté de la pharmacie" />
                        </div>
                    </form>
                  </div>

                  {/* Right: Summary */}
                  <div className="w-full md:w-[450px] bg-gradient-to-b from-[#0f0f0f] to-[#0a0a0a] p-8 flex flex-col h-full border-t md:border-t-0 md:border-l border-white/10">
                     <div className="flex justify-between items-center mb-8 md:flex hidden">
                        <h2 className="text-2xl font-bold">Récapitulatif</h2>
                        <button onClick={() => toggleCheckout(false)} className="p-2 hover:bg-white/10 rounded-lg transition"><X size={24} /></button>
                     </div>

                     <div className="flex-1 overflow-y-auto scrollbar-hide mb-8 space-y-3 max-h-[250px] md:max-h-none pr-2">
                        <motion.div
                          variants={STAGGER_CONTAINER}
                          initial="initial"
                          animate="animate"
                          className="space-y-3"
                        >
                          {cart.map(item => (
                              <motion.div 
                                key={item.cartId} 
                                variants={STAGGER_ITEM}
                                className="flex gap-4 p-4 bg-gradient-to-r from-white/5 to-white/2 rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-gradient-to-r hover:from-purple-500/10 hover:to-pink-500/10 transition-all duration-300"
                              >
                                  <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                                      <img src={item.imageUrl} className="w-full h-full object-contain p-2" alt={item.name} />
                                  </div>
                                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                                      <div>
                                          <p className="font-semibold text-sm truncate">{item.name}</p>
                                          <p className="text-xs text-gray-400 mt-1">{item.selectedSize} / {item.selectedColor}</p>
                                      </div>
                                      <p className="text-xs text-gray-300 font-mono mt-2">{item.quantity} x {item.price.toLocaleString('fr-GN')} GNF</p>
                                  </div>
                              </motion.div>
                          ))}
                        </motion.div>
                     </div>

                     <div className="border-t border-white/10 pt-8 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Sous-total</span>
                            <span className="font-mono font-semibold">{subtotal.toLocaleString('fr-GN')} GNF</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Livraison</span>
                            <span className={`font-bold uppercase text-xs tracking-wider ${deliveryFee === 0 ? 'text-green-400' : 'font-mono'}`}>
                                {deliveryFee === 0 ? 'Gratuite' : `${deliveryFee.toLocaleString('fr-GN')} GNF`}
                            </span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg">
                            <span>Total</span>
                            <span className="font-mono text-white">{total.toLocaleString('fr-GN')} GNF</span>
                        </div>

                        {/* Payment Method Display */}
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 p-4 rounded-xl flex items-start gap-3 mt-6">
                            <Banknote className="text-blue-400 shrink-0 mt-0.5" size={20} />
                            <div>
                                <p className="font-bold text-sm text-blue-300">Paiement à la livraison</p>
                                <p className="text-xs text-blue-400/70 mt-1 leading-relaxed">Payez en espèces à la réception de votre commande.</p>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            form="checkout-form"
                            disabled={isSubmitting}
                            className="w-full py-4 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">TRAITEMENT...</span>
                            ) : (
                                <>CONFIRMER ({total.toLocaleString('fr-GN')} GNF) <ArrowRight size={20} /></>
                            )}
                        </button>
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
