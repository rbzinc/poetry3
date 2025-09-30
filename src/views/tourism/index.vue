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
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);

  .main-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 30px 40px;
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .tourism-container {
    .main-content {
      padding: 20px;
    }
  }
}

@media (max-width: 768px) {
  .tourism-container {
    .main-content {
      padding: 15px;
    }
  }
}
</style>
