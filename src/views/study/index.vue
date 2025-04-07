<script setup>
import AiPoetAside from '@/components/study/directory/AiStudy/AiPoetAside/index.vue'
</script>

<template>
  <div class="study-container">
    <AiPoetAside />
    <div class="content-area">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.study-container {
  display: flex;
  min-height: calc(100vh - 80px);
  background: url('@/assets/pic/study/9a9e79bde1bccac83dc7413c3035a26.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  position: relative;

  .content-area {
    flex: 1;
    display: flex;
  }
}
</style>
