<script setup>
import Header from '@/Layout/Header/index.vue'
</script>

<template>
  <div class="app-container">
    <el-scrollbar>
      <Header v-show="$route.path !== '/login'" class="sticky-header"> </Header>
      <div class="content-container">
        <router-view />
      </div>
    </el-scrollbar>
  </div>
</template>

<style scoped>
.app-container {
  position: relative;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #f7f7f7;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.content-container {
  min-height: calc(100vh - 80px);
}
</style>
