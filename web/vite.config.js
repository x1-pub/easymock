import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    host: '127.0.0.1',
    port: 8001,
    proxy: {
      '/api/v1': {
        target: 'http://127.0.0.1:9907/',
        changeOrigin: false,
      },
    }
  }
});