import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
              'animation-vendor': ['framer-motion', 'gsap'],
            },
          },
        },
        chunkSizeWarningLimit: 1000,
        minify: 'esbuild',
        cssCodeSplit: true,
        sourcemap: mode !== 'production',
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei'],
        exclude: ['@google/genai'],
      },
    };
});
