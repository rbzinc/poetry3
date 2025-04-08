<script setup>
import { defineProps } from 'vue'

defineProps({
  poems: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="poetry-related">
    <el-card v-for="poem in poems" :key="poem.title" class="poem-card">
      <template #header>
        <div class="poem-header">
          <span>《{{ poem.title }}》</span>
          <span class="poet">{{ poem.dynasty }} · {{ poem.poet }}</span>
        </div>
      </template>
      <div class="poem-content">{{ poem.content }}</div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.poetry-related {
  .poem-card {
    margin-bottom: 20px;
    
    .poem-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .poet {
        color: #666;
        font-size: 14px;
      }
    }
    
    .poem-content {
      line-height: 1.8;
      color: #333;
      font-size: 16px;
    }
  }
}
</style>