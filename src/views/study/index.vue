<script setup>
import AiPoetAside from '@/components/study/directory/AiStudy/AiPoetAside/index.vue'

</script>

<template>

  <div class="bgc">
    <AiPoetAside/>
    <router-view />
  </div>

</template>

<style scoped lang="scss">
.bgc {
  background: url('@/assets/pic/study/9a9e79bde1bccac83dc7413c3035a26.png');
  background-size: cover;
  height: 100vh;

}

</style>
