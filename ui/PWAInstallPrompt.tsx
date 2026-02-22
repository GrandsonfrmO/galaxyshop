import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Handle beforeinstallprompt for Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
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
      }
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

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
                <p className="text-xs text-white/80">Accès rapide depuis votre écran d'accueil</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={18} className="text-white" />
            </button>
          </div>

          {isIOS ? (
            <div className="bg-white/10 rounded-lg p-3 text-xs text-white/90 mb-3">
              <p className="font-semibold mb-2">Sur iPhone/iPad :</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Appuyez sur le bouton Partager</li>
                <li>Sélectionnez "Sur l'écran d'accueil"</li>
                <li>Appuyez sur "Ajouter"</li>
              </ol>
            </div>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors text-sm"
            >
              Plus tard
            </button>
            {!isIOS && (
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 rounded-lg bg-white text-purple-600 font-semibold hover:bg-gray-100 transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Installer
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
