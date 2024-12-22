import {createRouter, createWebHistory} from 'vue-router'
import { useUserInfoStore} from '@/stores/modules/user.js'


import { ref } from 'vue';
export const key = ref(0);
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('../views/login/index.vue')
    },
    //首页
    {
      path: '/',
      component: () => import('../Layout/index.vue'),

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
      path: '/chattochat/:id',
      component: () => import('../views/aiChat/chatToChat/index.vue')
    },
    {
      path: '/chattopic',
      component: () => import('../views/aiChat/chatToPic/index.vue')
    },
    {
      path: '/pictochat',
      component: () => import('../views/aiChat/picToChat/index.vue')
    },
    {
      path: '/poemrefine',
      component: () => import('../views/aiChat/poemRefine/index.vue')
    },
    {
      path: '/game',
      component: () => import('../views/game/index.vue'),
      redirect: '/dictronary',
      children: [
        {
          path: '/dictronary',
          component: () => import('../views/game/dictionaty.vue'),
        },
        {
          path: '/textlist',
          component: () => import('../views/game/textlist.vue'),
        },
        {
          path: '/poetgame',
          component: () => import('../views/game/poetgame.vue'),
        },
        {
          path: '/fillpoetgame',
          component: () => import('../views/game/fillpoetgame.vue'),
        },
      ]
    },
    {
      path:'/vrExhibition',
      component: () => import('../views/vrExhibition/index.vue')
    },
    {
      path:'/vrExhibitionDetail/:id',
      component: () => import('../views/vrExhibition/vrExhibitionDetail/index.vue')
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
      path: '/talksquareDetail/:id',
      component: () => import('../views/talksquare/talksquareDetail/index.vue')

    },

    {
      path: '/editTalk',
      component: () => import('../views/talksquare/editTalk/index.vue')
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


router.beforeEach((to, from, next) => {
  const userInfo = useUserInfoStore();
  console.log(userInfo);
  if(to.path !== '/login' && userInfo.userInfo === null){
    next('/login');
  }else{
    next();
  }
})

// 添加全局错误处理
router.onError((error) => {
  console.error('路由错误:', error);
  // 这里可以添加更多的错误处理逻辑，例如通知用户
});
export default router
