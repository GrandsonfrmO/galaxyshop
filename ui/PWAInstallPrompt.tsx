import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                      (window.navigator as any).standalone ||
                      document.referrer.includes('android-app://');
    
    setIsStandalone(standalone);

    // Don't show prompt if already installed
    if (standalone) {
      return;
    }

    // Handle beforeinstallprompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user has dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      // Show prompt if never dismissed or dismissed more than 7 days ago
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS, show prompt after some time if not dismissed recently
    if (isIOSDevice && !standalone) {
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      
      if (!dismissed || daysSinceDismissed > 7) {
        setTimeout(() => setShowPrompt(true), 5000); // Show after 5 seconds
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPrompt(false);
        localStorage.removeItem('pwa-install-dismissed');
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[100]"
      >
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 md:p-6 shadow-2xl border border-white/20 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Download size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Installer l'app</h3>
                <p className="text-xs text-white/80">
                  {isIOS ? 'Ajoutez à votre écran d\'accueil' : 'Accès rapide depuis votre écran d\'accueil'}
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {isIOS ? (
            <div className="bg-white/10 rounded-lg p-3 text-xs text-white/90 mb-3">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Share2 size={14} />
                Instructions pour iPhone/iPad :
              </p>
              <ol className="space-y-1.5 ml-1">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>Appuyez sur le bouton <Share2 size={12} className="inline" /> Partager en bas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Faites défiler et sélectionnez <Plus size={12} className="inline" /> "Sur l'écran d'accueil"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Appuyez sur "Ajouter"</span>
                </li>
              </ol>
            </div>
          ) : isAndroid ? (
            <div className="bg-white/10 rounded-lg p-3 text-xs text-white/90 mb-3">
              <p className="font-semibold mb-1">Avantages :</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Accès instantané</li>
                <li>Fonctionne hors ligne</li>
                <li>Notifications en temps réel</li>
              </ul>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors text-sm"
            >
              Plus tard
            </button>
            {!isIOS && deferredPrompt && (
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Installer
              </button>
            )}
            {isIOS && (
              <button
                onClick={handleDismiss}
                className="flex-1 px-4 py-2.5 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Compris
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
