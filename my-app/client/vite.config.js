import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Explicitly set the output to a folder named 'dist' inside 'client'
    outDir: 'dist', 
    emptyOutDir: true,
  }
})