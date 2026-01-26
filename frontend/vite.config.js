import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env from backend folder
  const env = loadEnv(mode, '../backend', '')

  return {
    plugins: [react()],
    define: {
      // Expose TIKTOK_PIXEL_ID to frontend as import.meta.env.VITE_TIKTOK_PIXEL_ID
      'import.meta.env.VITE_TIKTOK_PIXEL_ID': JSON.stringify(env.TIKTOK_PIXEL_ID)
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  }
})
