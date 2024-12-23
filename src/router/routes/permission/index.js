// TODO 可以对子模块进行更细的划分，等路由重构完成后再进行调整
/*
 * 权限菜单主文件
 */
const permissionRoutes = []
const routesFiles = import.meta.glob('./modules/*.js', { eager: true })

Object.entries(routesFiles).forEach(([, module]) => {
  permissionRoutes.push(module.default)
})

export default permissionRoutes
