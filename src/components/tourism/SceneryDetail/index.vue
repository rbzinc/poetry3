<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PoetryRelated from '../PoetryRelated/index.vue'

const route = useRoute()
const sceneryDetail = ref({
  id: 1,
  name: '拙政园',
  images: [
    'https://example.com/zhuozhengyuan1.jpg',
    'https://example.com/zhuozhengyuan2.jpg',
    'https://example.com/zhuozhengyuan3.jpg',
  ],
  location: '江苏省苏州市姑苏区',
  description: '拙政园是中国四大名园之一，始建于明正德初年...',
  history: '园始建于明正德初年（1509－1513）...',
  culturalValue: '拙政园是中国私家园林的代表作...',
  bestVisitTime: '春季和秋季最佳，尤其是春季花开时节',
  relatedPoems: [
    {
      title: '游拙政园',
      content: '咫尺山林藏古寺，数重门户隐幽居...',
      poet: '王维',
      dynasty: '唐',
    },
  ],
})

onMounted(() => {
  // 根据route.query.id获取景点详情
  console.log('Scenery ID:', route.query.id)
})
</script>

<template>
  <div class="scenery-detail">
    <div class="image-gallery">
      <el-carousel height="400px">
        <el-carousel-item v-for="(image, index) in sceneryDetail.images" :key="index">
          <img :src="image" :alt="sceneryDetail.name" />
        </el-carousel-item>
      </el-carousel>
    </div>

    <div class="detail-content">
      <div class="basic-info">
        <h1>{{ sceneryDetail.name }}</h1>
        <p class="location">
          <el-icon><Location /></el-icon>
          {{ sceneryDetail.location }}
        </p>
      </div>

      <el-tabs>
        <el-tab-pane label="景点介绍">
          <div class="description">
            <h3>概述</h3>
            <p>{{ sceneryDetail.description }}</p>

            <h3>历史沿革</h3>
            <p>{{ sceneryDetail.history }}</p>

            <h3>文化价值</h3>
            <p>{{ sceneryDetail.culturalValue }}</p>

            <h3>最佳游览时间</h3>
            <p>{{ sceneryDetail.bestVisitTime }}</p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="相关诗词">
          <PoetryRelated :poems="sceneryDetail.relatedPoems" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scenery-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .image-gallery {
    margin-bottom: 30px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .detail-content {
    .basic-info {
      margin-bottom: 30px;

      h1 {
        font-size: 32px;
        margin-bottom: 10px;
      }

      .location {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #666;
      }
    }

    .description {
      h3 {
        font-size: 20px;
        margin: 20px 0 10px;
        color: #333;
      }

      p {
        font-size: 16px;
        line-height: 1.6;
        color: #666;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
