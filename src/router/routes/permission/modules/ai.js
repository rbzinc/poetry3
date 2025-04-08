import * as ROUTES from '@/router/constants.js'

// AI学习模块路由
const aiRoutes = [
  {
    path: ROUTES.STUDY_AI.replace(ROUTES.STUDY + '/', ''),
    component: () => import('@/views/study/directory/aiChat/studyHome/index.vue'),
  },
  {
    path: ROUTES.STUDY_AI_CHAT_WITH_ID.replace(ROUTES.STUDY + '/', ''),
    component: () => import('@/views/study/directory/aiChat/chatToChat/index.vue'),
  },
  {
    path: ROUTES.STUDY_AI_CHAT_TO_PIC.replace(ROUTES.STUDY + '/', ''),
    component: () => import('@/views/study/directory/aiChat/chatToPic/index.vue'),
  },
  {
    path: ROUTES.STUDY_AI_PIC_TO_CHAT.replace(ROUTES.STUDY + '/', ''),
    component: () => import('@/views/study/directory/aiChat/picToChat/index.vue'),
  },
  {
    path: ROUTES.STUDY_AI_POEM_REFINE.replace(ROUTES.STUDY + '/', ''),
    component: () => import('@/views/study/directory/aiChat/poemRefine/index.vue'),
  },
]

const ai = {
  path: '/study',
  component: () => import('@/views/study/index.vue'),
  children: [...aiRoutes],
}

export default ai
