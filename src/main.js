import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router/index'
import './assets/main.scss'
import * as echarts from 'echarts'
import VChart from 'vue-echarts';


//全局组件
import Header from './components/header/header.vue'
import Search from './components/search/search.vue'
import Pagenation from './components/pagenation/pagenation.vue'
const app = createApp(App)
const pinia =createPinia()
app.component('Search',Search)
app.component('Header',Header)
app.component('Pagenation',Pagenation)
app.config.globalProperties.$echarts = echarts
app.component('v-chart', VChart);
app.use(router)
app.use(pinia.use(persist))
app.use(ElementPlus)
app.mount('#app')

