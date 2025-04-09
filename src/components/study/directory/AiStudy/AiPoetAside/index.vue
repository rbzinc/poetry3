<script setup>
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/modules/user.js'
import {
  goChatToChat,
  goChatToPic,
  goChatToRefine,
  goPicToChat,
  goPoetWriterDetail,
  goStudyAI,
} from '@/router/helpers.js'
import { STUDY_AI } from '@/constants/router.js'

const userInfo = useUserInfoStore()
const menuItems = ref([
  { label: '1', icon: 'iconfont icon-liaotianduihua', tooltip: '诗人对话' },
  { label: '2', icon: 'iconfont icon-shengchengtupian', tooltip: '生成图片' },
  { label: '3', icon: 'iconfont icon-tupianzhuanwenzi', tooltip: '图片转古诗' },
  { label: '4', icon: 'iconfont icon-gudaishici', tooltip: '诗句优化' },
])

const navigate = (label) => {
  if (!label) return // 如果没有路由，直接返回
  try {
    switch (label) {
      case '1':
        goChatToChat(1)
        break
      case '2':
        goChatToPic()
        break
      case '3':
        goPicToChat()
        break
      case '4':
        goChatToRefine()
        break
      case '0':
        goStudyAI()
        break
    }
  } catch (error) {
    console.error('导航错误:', error)
  }
}
</script>

<template>
  <div class="sidebar">
    <ul class="sidebar-menu">
      <li class="sidebar-item home-item">
        <el-tooltip content="返回AI学习首页" placement="right">
          <img :src="userInfo.userInfo.touxiang" alt="用户头像" class="avatar" @click="navigate('0')" />
        </el-tooltip>
      </li>
      <el-divider style="margin: 8px 0; border-color: rgba(255, 255, 255, 0.2)" />
      <li v-for="(item, index) in menuItems" :key="index" class="sidebar-item">
        <el-tooltip :content="item.tooltip" placement="right">
          <i :class="item.icon" @click="navigate(item.label)"></i>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  position: sticky;
  height: 80vh;
  margin-left: 20px;
  margin-top: 20px;
  z-index: 100;
  border-radius: 15px;
  transition: all 0.3s ease;
  align-self: flex-start;
  backdrop-filter: blur(5px);

  .sidebar-menu {
    list-style: none;
    padding: 10px 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 5px 0;

    &.home-item {
      margin-bottom: 5px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        border-color: #fff;
        transform: scale(1.05);
      }
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    i {
      width: 24px;
      height: 24px;
      font-size: 22px;
      color: #fff;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}
</style>
