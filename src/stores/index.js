import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export * from './modules/poepavilion'
export * from './modules/search'
export * from './modules/user'
export * from './modules/talksquare'
export * from './modules/poemImg.js'
const pinia = createPinia()
pinia.use(persist)
export default pinia
