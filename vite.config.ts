import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: false, // Set to true if you want to test PWA features in development
    host: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
