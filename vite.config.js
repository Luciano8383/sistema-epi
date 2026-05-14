import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Isso ensina o Vite que "@" aponta para a pasta "src"
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
