<script setup>
import {RouterView} from 'vue-router';
import Banner from '@/views/poet/banner/banner.vue';


</script>

<template>
  <div class="poet-container">
    <div class="poet-content">
      <aside class="sidebar">
        <Banner />
      </aside>
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.poet-container {
  min-height: 100vh;
  width: 100%;
  background: url('@/assets/pic/poet/微信图片_20241016040103.jpg') no-repeat center center;
  background-size: cover;
  .poet-content {
    width: min(1300px, 90%);
    margin: 0 auto;
    display: flex;
    gap: 20px;
    box-sizing: border-box;

    .sidebar {
      width: 200px;
      flex-shrink: 0;
    }

    .main-content {
      flex: 1;
      max-width: 1100px;
    }
  }
}


</style>
