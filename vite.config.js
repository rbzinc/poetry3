import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Inspect from 'vite-plugin-inspect'

const pathSrc = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    AutoImport({
      imports: ['vue'],    
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      dts: path.resolve(pathSrc, 'auto-imports.d.ts'),
    }),

    Components({
      resolvers: [
        IconsResolver({
          enabledCollections: ['ep'],
        }),
        ElementPlusResolver(),
      ],

      dts: path.resolve(pathSrc, 'components.d.ts'),
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '^/api': {
        target: "http://192.168.43.174:8080", //目标源，目标服务器，真实请求地址
        changeOrigin: true, //支持跨域
      
      }
    }
  },

})
console.log(path.resolve(__dirname, 'src'))