import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'

export default defineConfig({
  plugins: [react(), jsconfigPaths()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',  // This is crucial for external access
    strictPort: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})