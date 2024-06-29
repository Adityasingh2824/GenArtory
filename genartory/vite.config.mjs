// vite.config.mjs
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // For easy imports from the src directory
    },
  },
  server: {
    host: true, // Enable network access
    port: 5173,
  },
  build: {
    outDir: '../dist', // Output build to the 'dist' directory at the project root
  },
});
