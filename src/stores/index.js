import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export * from './modules/search'
export * from './modules/user'
export * from './modules/poemImg.js'
export * from './modules/game'
const pinia = createPinia()
pinia.use(persist)
export default pinia
