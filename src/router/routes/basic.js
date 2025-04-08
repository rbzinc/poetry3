import permissionRoutes from './permission/index.js'

const routes = [...permissionRoutes]

export const rootRoute = {
  path: '/',
  name: 'Layout',
  redirect: '/home',
  children: [
    {
      path: '/home',
      component: () => import('@/Layout/index.vue'),
    },
    ...routes,
  ],
}

export const loginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
}

export const notFoundRoutes = [
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    redirect: '/404',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errors/404/index.vue'),
  },
]

export const vrAll = [
  {
    path: '/vr',
    component: () => import('@/views/study/directory/vrExhibition/index.vue'),
  },
  {
    path: '/vrExhibition',
    component: () => import('@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue'),
  },
]

export const userRoutes = [
  {
    path: '/user',
    component: () => import('@/views/user/index.vue'),
  },
  {
    path: '/user/editUserInfo',
    component: () => import('@/views/user/editUserInfo/index.vue'),
  },
]

export const dictionaryRoutes = [
  {
    path: '/study/dictionary',
    component: () => import('@/views/study/directory/gameStudy/index.vue'),
    redirect: '/study/dictionary/index',
    children: [
      {
        path: '/study/dictionary/index',
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue'),
      },
      {
        path: '/study/dictionary/textlist',
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/textList/index.vue'),
      },
      {
        path: '/study/dictionary/poetgame',
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue'),
      },
      {
        path: '/study/dictionary/fillpoetgame',
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue'),
      },
    ],
  },
]

export const forumRoutes = [
  {
    path: '/forum',
    component: () => import('@/views/talksquare/index.vue'),
  },
  {
    path: '/edit',
    component: () => import('@/views/talksquare/editTalk/index.vue'),
    params: {
      id: '',
    },
  },
  {
    path: '/detail',
    component: () => import('@/views/talksquare/talksquareDetail/index.vue'),
  },
]
const basicRoutes = [
  rootRoute,
  loginRoute,
  ...notFoundRoutes,
  ...vrAll,
  ...userRoutes,
  ...dictionaryRoutes,
  ...forumRoutes,
]

export default basicRoutes
