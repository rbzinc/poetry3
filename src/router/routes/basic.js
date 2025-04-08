import permissionRoutes from './permission/index.js'
import * as ROUTES from '../constants.js'

const routes = [...permissionRoutes]

export const rootRoute = {
  path: '/',
  name: 'Layout',
  redirect: ROUTES.HOME,
  children: [
    {
      path: ROUTES.HOME,
      component: () => import('@/Layout/index.vue'),
    },
    ...routes,
  ],
}

export const loginRoute = {
  path: ROUTES.LOGIN,
  name: 'Login',
  component: () => import('@/views/login/index.vue'),
}

export const notFoundRoutes = [
  {
    path: '/:path(.*)*',
    name: 'NotFound',
    redirect: ROUTES.NOT_FOUND,
  },
  {
    path: ROUTES.NOT_FOUND,
    name: '404',
    component: () => import('@/views/errors/404/index.vue'),
  },
]

export const vrAll = [
  {
    path: ROUTES.VR,
    component: () => import('@/views/study/directory/vrExhibition/index.vue'),
  },
  {
    path: ROUTES.VR_EXHIBITION,
    component: () => import('@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue'),
  },
]

export const userRoutes = [
  {
    path: ROUTES.USER,
    component: () => import('@/views/user/index.vue'),
  },
  {
    path: ROUTES.USER_EDIT,
    component: () => import('@/views/user/editUserInfo/index.vue'),
  },
]

export const dictionaryRoutes = [
  {
    path: ROUTES.DICTIONARY,
    component: () => import('@/views/study/directory/gameStudy/index.vue'),
    redirect: ROUTES.DICTIONARY_INDEX,
    children: [
      {
        path: ROUTES.DICTIONARY_INDEX.replace(ROUTES.DICTIONARY + '/', ''),
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue'),
      },
      {
        path: ROUTES.DICTIONARY_TEXT_LIST.replace(ROUTES.DICTIONARY + '/', ''),
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/textList/index.vue'),
      },
      {
        path: ROUTES.DICTIONARY_POET_GAME.replace(ROUTES.DICTIONARY + '/', ''),
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue'),
      },
      {
        path: ROUTES.DICTIONARY_FILL_POET_GAME.replace(ROUTES.DICTIONARY + '/', ''),
        component: () => import('@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue'),
      },
    ],
  },
]

export const forumRoutes = [
  {
    path: ROUTES.FORUM,
    component: () => import('@/views/talksquare/index.vue'),
  },
  {
    path: ROUTES.FORUM_EDIT,
    component: () => import('@/views/talksquare/editTalk/index.vue'),
    params: {
      id: '',
    },
  },
  {
    path: ROUTES.FORUM_DETAIL,
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
