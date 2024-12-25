// 游戏助学栏目
const dictionaryMain = [
  {
    path: '/dictionary',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue'),
  },
  {
    path: '/dictionary/textlist',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/textList/index.vue'),
  },
  {
    path: '/dictionary/poetgame',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue'),
  },
  {
    path: '/dictionary/fillpoetgame',
    component: () => import('@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue'),
  },
]

const dictionary = {
  path: '/dictionary',
  component: () => import('@/views/study/directory/gameStudy/index.vue'),
  children: [...dictionaryMain]
}
export default dictionary



