<script setup>
import Ranking from '@/components/study/directory/GameStudy/ranking/index.vue'
import Forget from '@/components/study/directory/GameStudy/forget/index.vue'
</script>
<template>
  <div class="game">
    <div class="content">
      <router-view></router-view>
    </div>
    <div class="sidebar">
      <Ranking />
      <Forget class="forget-card" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game {
  display: flex;
  gap: 20px;
  padding: 20px;
  min-height: 100vh;
  
  .content {
    flex: 1;
    min-width: 0; // 防止内容溢出
  }
  
  .sidebar {
    width: 320px; // 固定侧边栏宽度
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    height: 100%; 
    
    .forget-card {
      flex: 1;
      min-height: 320px; // 设置最小高度
     
    }
  }
}
</style>