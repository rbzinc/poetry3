// 改进后
import { rootRoute, loginRoute, notFoundRoutes } from "./basic";
import permissionRoutes from "./permission";

// 扁平化处理所有路由
const routes = [rootRoute, loginRoute, ...permissionRoutes, ...notFoundRoutes];

export default routes;
