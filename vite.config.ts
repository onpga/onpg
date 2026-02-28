import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    cssMinify: true,
    minify: 'esbuild', // Utilise esbuild (inclus avec Vite) au lieu de terser
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Séparer les node_modules dans un chunk séparé
          if (id.includes('node_modules')) {
            // Grouper React et React-DOM ensemble (souvent utilisés ensemble)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Grouper les autres vendors ensemble pour éviter trop de chunks
            return 'vendor';
          }
          // Code splitting par domaine fonctionnel
          if (id.includes('modules/Admin')) {
            return 'admin';
          }
          if (id.includes('modules/Pharmacien')) {
            return 'pharmacien';
          }
          if (id.includes('modules/Ressources')) {
            return 'ressources';
          }
          if (id.includes('modules/Ordre')) {
            return 'ordre';
          }
          if (id.includes('modules/Membres')) {
            return 'membres';
          }
          if (id.includes('modules/Pratique')) {
            return 'pratique';
          }
          if (id.includes('hooks')) {
            return 'hooks';
          }
        },
      },
    },
  },
  css: {
    devSourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});

