<script setup>
import AiPoetAside from '@/components/study/directory/AiStudy/AiPoetAside/index.vue'
import { STUDY_BG } from '@/constants/bgUrl.js'
</script>

<template>
  <div
    class="study-container"
    :style="{
      backgroundImage: `url(${STUDY_BG})`,
    }"
  >
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
  background-size: cover;
  position: relative;

  .content-area {
    flex: 1;
    display: flex;
  }
}
</style>
