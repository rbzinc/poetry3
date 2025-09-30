<script setup>
import { ref, onMounted } from 'vue'
import { userPoetryGetVeryGoodPoemGetApi } from '@/api/modules/talkSquare.js'

const todayPoemData = ref({}) // 今日古诗推荐

const userPoetryGetVeryGoodPoem = async () => {
  const res = await userPoetryGetVeryGoodPoemGetApi()
  todayPoemData.value = res.data
}

onMounted(() => {
  userPoetryGetVeryGoodPoem()
})
</script>

<template>
  <div class="day-recommend">
    <div class="card-header">
      <el-icon class="header-icon"><Calendar /></el-icon>
      <h3>今日古诗推荐</h3>
    </div>
    
    <div class="poem-content">
      <h4 class="poem-title">{{ todayPoemData.title }}</h4>
      <p class="poem-author">{{ todayPoemData.writer }}</p>
      <div class="poem-text" v-html="todayPoemData.content"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.day-recommend {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(102, 126, 234, 0.1);

  .card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid rgba(102, 126, 234, 0.1);

    .header-icon {
      font-size: 24px;
      color: #667eea;
    }

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
  }

  .poem-content {
    .poem-title {
      text-align: center;
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      line-height: 1.6;
    }

    .poem-author {
      text-align: center;
      margin: 0 0 20px 0;
      font-size: 14px;
      color: #667eea;
      font-weight: 500;
    }

    .poem-text {
      line-height: 2;
      font-size: 15px;
      color: #555;
      text-indent: 2em;
      word-spacing: 4px;

      :deep(p) {
        margin: 8px 0;
      }
    }
  }
}
</style>
