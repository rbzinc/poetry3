// 论坛模块路由
const forum = {
  path: "/forum",
  component: () => import("@/views/talksquare/index.vue"),
  children: [
    // 合并原individualPage中的路由
    {
      path: "edit",
      component: () => import("@/views/talksquare/editTalk/index.vue"),
    },
    {
      path: "detail",
      component: () => import("@/views/talksquare/talksquareDetail/index.vue"),
    },
  ],
};

export default forum;
