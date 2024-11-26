<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserInfoStore } from '@/stores/modules/user.js'
const userInfo = useUserInfoStore()
const router = useRouter();

const menuItems = ref([
  { label: '1', icon: 'iconfont icon-liaotianduihua', route: '/chattochat/1', tooltip: '诗人对话' },
  { label: '2', icon: 'iconfont icon-shengchengtupian', route: '/chattopic', tooltip: '生成图片' },
  { label: '3', icon: 'iconfont icon-tupianzhuanwenzi', route: '/pictochat', tooltip: '图片转古诗' },
  { label: '4', icon: 'iconfont icon-gudaishici', route: '/poemrefine', tooltip: '诗句优化' }
]);
const navigate = (route) => {
  try {
    if (route) {
      router.push(route);
    }
  } catch (error) {
    console.error('导航错误:', error.message);
  }
};
</script>
<template>
  <div class="sidebar">
    <ul class="sidebar-menu">
      <li class="sidebar-item">
        <img :src="userInfo.userInfo.touxiang"
             alt="" class="avatar" @click="navigate('/poetryAi')"/>
      </li>
      <el-divider style="margin: 5px 0;"/>
      <li
          v-for="(item, index) in menuItems"
          :key="index"
          class="sidebar-item"
      >
        <el-tooltip :content="item.tooltip" placement="right" >
          <i :class="item.icon" @click="navigate(item.route)"></i>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>


<style lang="scss" scoped>
.sidebar {
  width: 50px;
  background-color: #000000;
  opacity: 0.4;
  position: fixed;
  height: 70%;
  margin-top: 60px;
  margin-left: 20px;
  z-index: 9999;
  border-radius: 20px;

  .sidebar-menu {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    color: #fff;
    cursor: pointer;
    .avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    &:hover {
      background-color: #6f5842;
      opacity: 0.8;
      border-radius: 20px;
    }
    i {
      width: 24px;
      height: 24px;
      margin: 0 20px;
      font-size: 20px;
    }
  }
}

@media (min-width: 768px) {
  .sidebar-item span {
    display: inline;
  }
}

.el-divider--horizontal {
  margin: 6px 0;
}
</style>
