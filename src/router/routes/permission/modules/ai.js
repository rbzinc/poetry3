// AI学习模块路由
const aiRoutes = [
  {
    path: '/study/ai',
    component: () => import('@/views/study/directory/aiChat/studyHome/index.vue'),
  },
  {
    path: '/study/ai/chattochat/:id',
    component: () => import('@/views/study/directory/aiChat/chatToChat/index.vue'),
  },
  {
    path: '/study/ai/chattopic',
    component: () => import('@/views/study/directory/aiChat/chatToPic/index.vue'),
  },
  {
    path: '/study/ai/pictochat',
    component: () => import('@/views/study/directory/aiChat/picToChat/index.vue'),
  },
  {
    path: '/study/ai/poemrefine',
    component: () => import('@/views/study/directory/aiChat/poemRefine/index.vue'),
  },
]

const ai = {
  path: '/study',
  component: () => import('@/views/study/index.vue'),
  children: [...aiRoutes],
}

export default ai
