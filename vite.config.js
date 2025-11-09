import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wreath-sale/', // Change this to match your GitHub repo name
  server: {
    port: 3000,
  },
})
