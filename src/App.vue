<script setup>
import Header from '@/Layout/Header/index.vue'
</script>

<template>
  <div>
    <el-scrollbar>
      <Header v-show="$route.path !== '/login'"> </Header>
      <router-view></router-view>
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
