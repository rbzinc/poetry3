import permissionRoutes from './permission/index.js'
const routes = [ ...permissionRoutes]

export const rootRoute = {
  path: '/',
  name: 'Layout',
  redirect: '/home',
  children: [
    {
      path: '/home',
      component: () => import('@/Layout/index.vue'),
    },
    ...routes
  ]
}

export const loginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue')
}

export const notFoundRoutes = [
  {
    path: "/:path(.*)*",
    name: "NotFound",
    redirect: "/404",
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/errors/404/index.vue"),
  },
];

const basicRoutes = [rootRoute, loginRoute, ...notFoundRoutes]


export default basicRoutes

