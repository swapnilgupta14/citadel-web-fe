import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
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
          target: (() => {
            const apiBaseUrl = env.VITE_API_BASE_URL;
            if (apiBaseUrl) {
              return apiBaseUrl.endsWith('/api')
                ? apiBaseUrl.replace('/api', '')
                : apiBaseUrl;
            }
          })(),
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path,
          configure: (proxy, _options) => {
            proxy.on('error', (_err, _req, _res) => {
            });
            proxy.on('proxyReq', (_proxyReq, _req, _res) => {
            });
            proxy.on('proxyRes', (_proxyRes, _req, _res) => {
            });
          },
        },
      },
    },
  }
})
