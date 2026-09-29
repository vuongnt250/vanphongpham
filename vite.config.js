import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  test: {
    globals: true,
    fileParallelism: false,
    env: {
      NODE_ENV: 'test'
    },
    environmentMatchGlobs: [
      ['may_chu/kiem_thu/**', 'node'],
      ['giao_dien/kiem_thu/**', 'jsdom']
    ],
    setupFiles: ['./giao_dien/kiem_thu/thiet_lap_kiem_thu.js']
  }
});