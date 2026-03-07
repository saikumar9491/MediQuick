import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  build: {
    // This ensures the production files are placed in a folder named 'dist'
    outDir: 'dist',
    // Cleans the folder before every build to prevent old file errors
    emptyOutDir: true,
  },
  server: {
    // Optional: useful for local development with your backend
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})