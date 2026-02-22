import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { toggleAdmin } = useStore();

  // Admin password - change this to your desired password
  const ADMIN_PASSWORD = 'grandson2024';

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === ADMIN_PASSWORD) {
      toggleAdmin();
      setPassword('');
      setError('');
      onClose();
    } else {
      setError('Mot de passe incorrect');
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Prevent closing when clicking on backdrop
    e.preventDefault();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center pointer-events-auto"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 border border-purple-500/50 rounded-lg p-8 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Admin Access</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              ref={inputRef}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Entrez le mot de passe admin"
              className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition"
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm font-medium bg-red-900/20 p-2 rounded border border-red-500/30">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
          >
            Se connecter
          </button>
        </form>

        <p className="text-gray-400 text-xs mt-4 text-center">
          Accès réservé aux administrateurs
        </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
