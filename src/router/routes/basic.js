import permissionRoutes from './permission/index.js'
const routes = [
//书阁
  {
    path: '/poet',
    component: () => import('@/views/poet/index.vue'),
    redirect: '/poet/class',
    children:
      [
        {
          path: '/poet/class',
          component: () => import('@/views/poet/children/class/index.vue'),
        },
        {
          path: '/poet/sentence',
          component: () => import('@/views/poet/children/sentence/index.vue'),
        },
        {
          path: '/poet/writer',
          component: () => import('@/views/poet/children/writer/index.vue'),
        }
      ]
  },
  {
    path: '/poetryAi',
    component:
      () => import('@/views/study/index.vue')
  },
  {
    path: '/chattochat/:id',
    component:
      () => import('@/views/study/directory/aiChat/chatToChat/index.vue')
  },
  {
    path: '/chattopic',
    component:
      () => import('@/views/study/directory/aiChat/chatToPic/index.vue')
  },
  {
    path: '/pictochat',
    component:
      () => import('@/views/study/directory/aiChat/picToChat/index.vue')
  },
  {
    path: '/poemrefine',
    component:
      () => import('@/views/study/directory/aiChat/poemRefine/index.vue')
  },
  {
    path: '/dictionary',
    component: () => import('@/views/study/directory/gameStudy/index.vue'),
    children:
      [
        {
          path: '/dictionary',
          component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue.vue'),
        },
        {
          path: '/textlist',
          component: () => import('@/views/study/directory/gameStudy/ProgressPage/textList/index.vue'),
        },
        {
          path: '/poetgame',
          component: () => import('@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue'),
        },
        {
          path: '/fillpoetgame',
          component: () => import('@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue'),
        },
      ]
  },
  {
    path: '/vrExhibition',
    component:
      () => import('@/views/study/directory/vrExhibition/index.vue')
  },
  {
    path: '/vrExhibitionDetail/:id',
    component:
      () => import('@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue')
  },
  {
    path: '/writerDetails',
    component:
      () => import('@/views/poet/details/writerDetails/index.vue')
  },
  {
    path: '/poetDetails',
    component:
      () => import('@/views/poet/details/poetDetails/index.vue')
  },
  {
    path: '/user',
    component:
      () => import('@/views/user/index.vue'),

  },
  {
    path: '/editUserInfo',
    component:
      () => import('@/views/user/editUserInfo/index.vue'),
  },
  {
    path: '/talksquare',
    component:
      () => import('@/views/talksquare/index.vue'),
  },
  {
    path: '/talksquareDetail/:id',
    component:
      () => import('@/views/talksquare/talksquareDetail/index.vue')

  },
  {
    path: '/editTalk',
    component:
      () => import('@/views/talksquare/editTalk/index.vue')
  },
  {
    path: '/study.js',
    component:
      () => import('@/views/study/index.vue'),
  },
]

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

