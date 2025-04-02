// 布局和基础路由
const layoutRoute = {
  path: "/",
  component: () => import("@/Layout/index.vue"),
  redirect: "/home",
  children: [
    // 首页
    {
      path: "home",
      name: "Home",
      component: () => import("@/Layout/index.vue"),
      meta: { title: "首页" },
    },

    // 用户相关
    {
      path: "user",
      name: "User",
      component: () => import("@/views/user/index.vue"),
      meta: { title: "个人中心" },
    },
    {
      path: "user/editUserInfo",
      name: "EditUserInfo",
      component: () => import("@/views/user/editUserInfo/index.vue"),
      meta: { title: "编辑个人信息" },
    },

    // 诗人相关
    {
      path: "poet/class",
      name: "PoetClass",
      component: () => import("@/views/poet/children/class/index.vue"),
      meta: { title: "诗人分类" },
    },
    {
      path: "poet/detail",
      name: "PoetDetail",
      component: () => import("@/views/poet/details/poetDetails/index.vue"),
      meta: { title: "诗词详情" },
    },
    {
      path: "poet/writer",
      name: "WriterDetail",
      component: () => import("@/views/poet/details/writerDetails/index.vue"),
      meta: { title: "作者详情" },
    },

    // 论坛相关
    {
      path: "forum",
      name: "Forum",
      component: () => import("@/views/talksquare/index.vue"),
      meta: { title: "诗词论坛" },
    },
    {
      path: "forum/edit",
      name: "ForumEdit",
      component: () => import("@/views/talksquare/editTalk/index.vue"),
      meta: { title: "编辑帖子" },
    },
    {
      path: "forum/detail",
      name: "ForumDetail",
      component: () => import("@/views/talksquare/talksquareDetail/index.vue"),
      meta: { title: "帖子详情" },
    },

    // 学习相关
    {
      path: "dictionary",
      name: "Dictionary",
      component: () =>
        import(
          "@/views/study/directory/gameStudy/ProgressPage/dictionary/index.vue"
        ),
      meta: { title: "词典" },
    },
    {
      path: "dictionary/textlist",
      name: "TextList",
      component: () =>
        import(
          "@/views/study/directory/gameStudy/ProgressPage/textList/index.vue"
        ),
      meta: { title: "文本列表" },
    },
    {
      path: "dictionary/poetgame",
      name: "PoetGame",
      component: () =>
        import(
          "@/views/study/directory/gameStudy/ProgressPage/poetGame/index.vue"
        ),
      meta: { title: "诗词游戏" },
    },
    {
      path: "dictionary/fillpoetgame",
      name: "FillPoetGame",
      component: () =>
        import(
          "@/views/study/directory/gameStudy/ProgressPage/fillPoetGame/index.vue"
        ),
      meta: { title: "填词游戏" },
    },

    // AI相关
    {
      path: "ai",
      name: "AI",
      component: () => import("@/views/study/directory/aiChat/index.vue"),
      meta: { title: "AI学习" },
    },
    {
      path: "ai/changePoet",
      name: "AIChangePoet",
      component: () =>
        import("@/views/study/directory/aiChat/studyHome/index.vue"),
      meta: { title: "切换诗人" },
    },
    {
      path: "ai/chattochat/:id",
      name: "ChatToChat",
      component: () =>
        import("@/views/study/directory/aiChat/chatToChat/index.vue"),
      meta: { title: "诗人对话" },
    },
    {
      path: "ai/chattopic",
      name: "ChatToPic",
      component: () =>
        import("@/views/study/directory/aiChat/chatToPic/index.vue"),
      meta: { title: "生成图片" },
    },
    {
      path: "ai/pictochat",
      name: "PicToChat",
      component: () =>
        import("@/views/study/directory/aiChat/picToChat/index.vue"),
      meta: { title: "图片转古诗" },
    },
    {
      path: "ai/poemrefine",
      name: "PoemRefine",
      component: () =>
        import("@/views/study/directory/aiChat/poemRefine/index.vue"),
      meta: { title: "诗句优化" },
    },

    // VR相关
    {
      path: "vrExhibition",
      name: "VRExhibition",
      component: () => import("@/views/study/directory/vrExhibition/index.vue"),
      meta: { title: "VR展厅" },
    },
    {
      path: "vrExhibitionDetail",
      name: "VRExhibitionDetail",
      component: () =>
        import(
          "@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue"
        ),
      meta: { title: "VR展厅详情" },
    },
  ],
};

// 登录相关路由
const loginRoute = {
  path: "/login",
  name: "Login",
  component: () => import("@/views/login/index.vue"),
  meta: { title: "登录" },
};

// 错误页面路由
const errorRoutes = [
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/404",
  },
  {
    path: "/404",
    name: "404",
    component: () => import("@/views/errors/404/index.vue"),
    meta: { title: "页面不存在" },
  },
];

// 导出所有路由
export default [layoutRoute, loginRoute, ...errorRoutes];
