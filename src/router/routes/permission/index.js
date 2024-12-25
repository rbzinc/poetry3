// TODO 可以对子模块进行更细的划分，等路由重构完成后再进行调整
import individualPageRoutes from './modules/individualPage/index.js'

const permissionRoutes = []
const routesFiles = import.meta.glob('./modules/*.js', {eager: true})

Object.entries(routesFiles).forEach(([, module]) => {
  permissionRoutes.push(module.default)
})
permissionRoutes.push(...individualPageRoutes)
export default permissionRoutes
