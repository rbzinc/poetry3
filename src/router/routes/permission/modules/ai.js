// 学习页面
const AiMain = [
  {
    path: "/ai/changePoet",
    component: () =>
      import("@/views/study/directory/aiChat/studyHome/index.vue"),
  },
  {
    path: "/ai/chattochat/:id",
    component: () =>
      import("@/views/study/directory/aiChat/chatToChat/index.vue"),
  },
  {
    path: "/ai/chattopic",
    component: () =>
      import("@/views/study/directory/aiChat/chatToPic/index.vue"),
  },
  {
    path: "/ai/pictochat",
    component: () =>
      import("@/views/study/directory/aiChat/picToChat/index.vue"),
  },
  {
    path: "/ai/poemrefine",
    component: () =>
      import("@/views/study/directory/aiChat/poemRefine/index.vue"),
  },
  // 新增VR展厅相关路由
  {
    path: "/ai/vrExhibition",
    component: () => import("@/views/study/directory/vrExhibition/index.vue"),
  },
  {
    path: "/ai/vrExhibitionDetail",
    component: () =>
      import(
        "@/views/study/directory/vrExhibition/vrExhibitionDetail/index.vue"
      ),
  },
];

const ai = {
  path: "/ai",
  component: () => import("@/views/study/index.vue"),
  redirect: "/ai/changePoet",
  children: [...AiMain],
};
export default ai;
