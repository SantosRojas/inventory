import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar React y dependencias principales
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Separar librerías de UI
          'ui-vendor': ['lucide-react', '@hookform/resolvers', 'react-hook-form'],
          
          // Separar Zustand y estado
          'state-vendor': ['zustand'],
          
          // Separar validaciones
          'validation-vendor': ['zod'],
          
          // Separar gráficos/charts si los hay
          'charts-vendor': ['recharts']
        }
      }
    },
    // Aumentar el límite de advertencia a 1MB
    chunkSizeWarningLimit: 1000
  }
})
