<script setup>
import Banner from './banner/index.vue'
</script>

<template>
  <div class="tourism-container">
    <Banner />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tourism-container {
  min-height: 100vh;
  background-color: #f5f5f5;

  .main-content {
    width: min(1300px, 90%);
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
