import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('../views/login/LoginPage.vue')
    },
    {
      path: '/register',
      component: () => import('../views/register/register.vue')
    },

    {
      path: '/email',
      component: () => import('../views/login/EmailLogin.vue')
    },
    //首页
    {
      path: '/',
      component: () => import('../Layout/index.vue'),
      redirect: '/layout/home',
      children: [
        {
          path: '/layout/home',
          component: () => import('../Layout/home/home.vue')
        },
        {
          path: '/components/header',
          component: () => import('../components/header/header.vue')
        },
        {
          path: '/layout/banner',
          component: () => import('../Layout/banner/banner.vue'),
        },
        {
          path: '/components/search',
          component: () => import('../components/search/search.vue'),
        }
      ]
    },
    //书阁
    {
      path: '/poet',
      component: () => import('../views/poet/poet.vue'),
      redirect: '/poet/class',
      children: [
        {
          path: '/poet/class',
          component: () => import('../views/poet/class/classPoetry.vue'),
        },
        {
          path: '/poet/portry',
          component: () => import('../views/poet/portry/poetryPage.vue'),
        },
        {
          path: '/poet/sentence',
          component: () => import('../views/poet/sentence/porSence.vue'),
        },
        {
          path: '/poet/writer',
          component: () => import('../views/poet/writer/poeWriter.vue'),
        }
      ]
    },

    {
      path: '/poetryAi',
      component: () => import('../views/poetryAi/poetryAi.vue')
    },

    {
      path: '/aiChat',
      component: () => import('../views/aiChat/aichat.vue')
    },


    {
      path: '/writer',
      component: () => import('../views/writer/writer.vue')
    },

    {
      path: '/poedetails',
      component: () => import('../views/poedetails/poedetails.vue')
    },

    {
      path: '/user',
      component: () => import('../views/user/index.vue'),

    },
    {
      path: '/editUserInfo',
      component: () => import('../views/user/editUserInfo/index.vue'),
    },
    {
      path: '/talksquare',
      component: () => import('../views/talksquare/index.vue'),
    },
    {
      path:'/talksquareDetail/:id',
      component: ()=>import('../views/talksquare/talksquareDetail/index.vue')

    },
    {
      path:'/editTalk',
      component :() => import('../views/talksquare/editTalk/index.vue')
    },

    {
      path: '/study',
      component: () => import('../views/study/index.vue'),
    },

    {
      path: '/search',
      component: () => import('../views/search/index.vue'),
      redirect: '/poetsearch',
      children: [
        {
          path: '/poetsearch',
          component: () => import('../views/search/poetsearch.vue'),
        },
        {
          path: '/writersearch',
          component: () => import('../views/search/writersearch.vue'),
        },
        {
          path: '/sensearch',
          component: () => import('../views/search/sensearch.vue'),
        },
      ]
    },
  ]
})

export default router
