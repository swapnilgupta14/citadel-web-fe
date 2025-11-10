import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL
          ? (process.env.VITE_API_BASE_URL.endsWith('/api')
            ? process.env.VITE_API_BASE_URL.replace('/api', '')
            : process.env.VITE_API_BASE_URL)
          : '',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
      },
    },
  },
})
