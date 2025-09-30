import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: "http://fuze1.nat300.top",
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '', // 将 `/api` 替换为空字符串，以便后端能够正确识别路由
        },
      },
    },
    open: true,
  },
})
