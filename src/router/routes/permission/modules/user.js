// 用户模块路由
const user = {
  path: "/user",
  component: () => import("@/views/user/index.vue"),
  children: [
    // 合并原individualPage中的路由
    {
      path: "editUserInfo",
      component: () => import("@/views/user/editUserInfo/index.vue"),
    },
  ],
};

export default user;
