import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes/index.js'
import { useUserInfoStore } from '@/stores/index.js' // 导入用户状态管理
import * as ROUTES from '@/constants/router.js' // 导入路由常量
import { ElMessage } from 'element-plus' // 导入 ElMessage 用于提示

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return {
      top: 0,
    }
  },
})

const publicRoutes = [ROUTES.LOGIN, ROUTES.NOT_FOUND]

// 添加全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserInfoStore()

  // 检查用户是否登录 (这里假设 userInfo 中有 token 字段，如果不同请修改)
  const isLoggedIn = !!userStore.userInfo?.token

  // 检查目标路由是否需要认证
  // 1. 目标路径不在公开路由列表中
  // 2. 目标路径不是 404 页面 (因为 404 可能由任意未匹配路径触发)
  const requiresAuth = !publicRoutes.includes(to.path) && to.name !== '404' && to.name !== 'NotFound'

  if (requiresAuth && !isLoggedIn) {
    // 如果路由需要认证但用户未登录，提示并重定向到登录页
    ElMessage.warning('请先登录后再访问')
    // 将用户尝试访问的路径作为查询参数传递，以便登录后重定向回去
    next({ path: ROUTES.LOGIN, query: { redirect: to.fullPath } })
  } else if (to.path === ROUTES.LOGIN && isLoggedIn) {
    // 如果用户已登录且尝试访问登录页，重定向到首页
    next({ path: ROUTES.HOME })
  } else {
    // 其他情况（访问公共页面，或已登录访问受保护页面），允许导航
    next()
  }
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  // 这里可以添加更多的错误处理逻辑，例如通知用户
})

export default router
