import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wreath-sale/', // Matches GitHub repo name for GitHub Pages
  server: {
    port: 3000,
  },
})
