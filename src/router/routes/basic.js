import permissionRoutes from './permission/index.js'
const routes = [
//书阁
  {
    path: '/poet',
    component: () => import('@/views/poet/poet.vue'),
    redirect: '/poet/class',
    children:
      [
        {
          path: '/poet/class',
          component: () => import('@/views/poet/class/classPoetry.vue'),
        },
        {
          path: '/poet/sentence',
          component: () => import('@/views/poet/sentence/porSence.vue'),
        },
        {
          path: '/poet/writer',
          component: () => import('@/views/poet/writer/poeWriter.vue'),
        }
      ]
  },
  {
    path: '/poetryAi',
    component:
      () => import('@/views/poetryAi/poetryAi.vue')
  },
  {
    path: '/chattochat/:id',
    component:
      () => import('@/views/aiChat/chatToChat/index.vue')
  },
  {
    path: '/chattopic',
    component:
      () => import('@/views/aiChat/chatToPic/index.vue')
  },
  {
    path: '/pictochat',
    component:
      () => import('@/views/aiChat/picToChat/index.vue')
  },
  {
    path: '/poemrefine',
    component:
      () => import('@/views/aiChat/poemRefine/index.vue')
  },
  {
    path: '/dictionary',
    component: () => import('@/views/game/index.vue'),
    children:
      [
        {
          path: '/dictionary',
          component: () => import('@/views/game/dictionary.vue'),
        },
        {
          path: '/textlist',
          component: () => import('@/views/game/textlist.vue'),
        },
        {
          path: '/poetgame',
          component: () => import('@/views/game/poetgame.vue'),
        },
        {
          path: '/fillpoetgame',
          component: () => import('@/views/game/fillpoetgame.vue'),
        },
      ]
  },
  {
    path: '/vrExhibition',
    component:
      () => import('@/views/vrExhibition/index.vue')
  },
  {
    path: '/vrExhibitionDetail/:id',
    component:
      () => import('@/views/vrExhibition/vrExhibitionDetail/index.vue')
  },
  {
    path: '/writer',
    component:
      () => import('@/views/writer/writer.vue')
  },
  {
    path: '/poedetails',
    component:
      () => import('@/views/poedetails/poedetails.vue')
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
  {
    path: '/search',
    component:
      () => import('@/views/search/index.vue'),
    redirect:
      '/poetsearch',
    children:
      [
        {
          path: '/poetsearch',
          component: () => import('@/views/search/poetsearch.vue'),
        },
        {
          path: '/writersearch',
          component: () => import('@/views/search/writersearch.vue'),
        },
        {
          path: '/sensearch',
          component: () => import('@/views/search/sensearch.vue'),
        },
      ]
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

