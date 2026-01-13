import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://homefinish.runasp.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/proxy': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false
      },
      '/uploads': {
        target: 'http://homefinish.runasp.net',
        changeOrigin: true,
        secure: false
      },
      '/images': {
        target: 'http://homefinish.runasp.net',
        changeOrigin: true,
        secure: false
      },
      '/content': {
        target: 'http://homefinish.runasp.net',
        changeOrigin: true,
        secure: false
      },
      '/product-images': {
        target: 'http://homefinish.runasp.net',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
