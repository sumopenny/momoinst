import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './', // 使用相对路径，方便部署到任意路径
  server: {
    proxy: {
      '/api': {
        target: 'https://mvsep.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
