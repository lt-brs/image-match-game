// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/image-match-game/',
  plugins: [react()],
  server: {
        host: true, // Needed for mobile testing
  }
})
