import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import * as echarts from 'echarts'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VChart from 'vue-echarts';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import "./assets/scss/highLight.scss"
import 'highlight.js/scss/atom-one-dark.scss'
import '@/iconfont/iconfont.css'
//全局组件
import Header from './components/header/header.vue'
import Pagenation from './components/pagenation/pagenation.vue'
const app = createApp(App)
const pinia =createPinia()
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(mavonEditor)
app.component('Header',Header)
app.component('Pagenation',Pagenation)
app.config.globalProperties.$echarts = echarts
app.component('v-chart', VChart);
app.use(router)
app.use(pinia.use(persist))
app.use(ElementPlus)
app.mount('#app')

