// 改进后
import { rootRoute, loginRoute, notFoundRoutes, vrAll, userRoutes, dictionaryRoutes, forumRoutes } from './basic'
import permissionRoutes from './permission'

// 扁平化处理所有路由
const routes = [
  rootRoute,
  loginRoute,
  ...permissionRoutes,
  ...notFoundRoutes,
  ...vrAll,
  ...userRoutes,
  ...dictionaryRoutes,
  ...forumRoutes,
]

export default routes
