import {createRouter, createWebHistory} from 'vue-router'

import routes from './routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    return {
      top: 0
    }
  }
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  // 这里可以添加更多的错误处理逻辑，例如通知用户
});
export default router
