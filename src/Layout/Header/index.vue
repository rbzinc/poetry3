<script setup>
import { User } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/index.js'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { LOGO_URL } from '@/constants/bgUrl.js'

const useUser = useUserInfoStore()
const route = useRoute()
const router = useRouter()
const activeIndex = ref(ROUTES.HOME)

// 监听路由变化，更新激活菜单
onMounted(() => {
  activeIndex.value = route.path
})

watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  },
)

// 退出登录
const logout = () => {
  useUser.clearUserInfo()
  router.push(ROUTES.LOGIN)
}

// 处理菜单点击事件
const handleSelect = (key) => {
  router.push(key)
}
</script>

<template>
  <div class="leader">
    <div class="left">
      <img :src="LOGO_URL" alt="" width="250px" height="80px" />
    </div>
    <div class="right">
      <el-menu
        :default-active="activeIndex"
        class="header-menu"
        mode="horizontal"
        @select="handleSelect"
        :ellipsis="false"
        router
      >
        <el-menu-item :index="ROUTES.HOME">首页</el-menu-item>
        <el-menu-item :index="ROUTES.POET">书阁</el-menu-item>

        <el-sub-menu :index="ROUTES.STUDY" popper-class="custom-dropdown">
          <template #title>
            <span class="submenu-title">学习</span>
          </template>
          <el-menu-item :index="ROUTES.STUDY_AI">AI助学</el-menu-item>
          <el-menu-item :index="ROUTES.DICTIONARY">游戏助学</el-menu-item>
          <el-menu-item :index="ROUTES.VR">vr助学</el-menu-item>
        </el-sub-menu>

        <el-menu-item :index="ROUTES.FORUM">论坛</el-menu-item>

        <el-menu-item :index="ROUTES.TOURISM_DOMESTIC">诗意之旅</el-menu-item>

        <template v-if="useUser.userInfo">
          <el-sub-menu :index="ROUTES.USER" popper-class="custom-dropdown">
            <template #title>
              我的
              <el-icon class="user-icon"><User /></el-icon>
            </template>
            <el-menu-item :index="ROUTES.USER">个人主页</el-menu-item>

            <el-menu-item @click="logout">退出登录</el-menu-item>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item :index="ROUTES.LOGIN">
            登录
            <el-icon class="user-icon"><User /></el-icon>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-icon {
  width: 20px;
  height: 20px;
  margin-left: 5px;
}

.leader {
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-evenly;
  margin: 0 auto;
}

:deep(.header-menu) {
  background-color: transparent;
  border-bottom: none;
  height: 80px;

  .el-menu-item {
    height: 80px;
    line-height: 80px;
    font-size: 18px;
    color: #8d8c8c;
    padding: 0 40px;

    &:hover,
    &.is-active {
      color: rgb(137, 137, 137);
      border-bottom: 4px solid rgb(137, 137, 137);
      background-color: transparent;
    }
  }

  .el-sub-menu {
    height: 80px;
    line-height: 80px;

    .el-sub-menu__title {
      height: 80px;
      line-height: 80px;
      font-size: 18px;
      color: #8d8c8c;
      padding: 0 40px;

      &:hover {
        color: rgb(137, 137, 137);
        background-color: transparent;
      }
    }

    &:hover > .el-sub-menu__title,
    &.is-active > .el-sub-menu__title {
      color: rgb(137, 137, 137);
      border-bottom: 4px solid rgb(137, 137, 137);
    }
  }
}
.submenu-title {
  margin-right: 15px;
}
/* 添加全局样式，控制下拉菜单宽度 */
:global(.custom-dropdown) {
  min-width: 150px !important; /* 设置下拉菜单的最小宽度 */
  width: auto !important; /* 允许宽度自适应内容 */
}

:global(.custom-dropdown .el-menu--popup) {
  min-width: 150px !important;
}

:global(.custom-dropdown .el-menu-item) {
  justify-content: center;
  padding: 0 15px !important;
  min-width: 150px !important;
  text-align: center;
}

:global(.el-menu--horizontal .el-sub-menu.is-active .el-sub-menu__title) {
  border-bottom: 4px solid rgb(137, 137, 137) !important;
  color: rgb(137, 137, 137) !important;
}
</style>
