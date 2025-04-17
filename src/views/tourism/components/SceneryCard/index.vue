<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'

const router = useRouter()

const props = defineProps({
  scenery: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      image: '',
      location: '',
      poem: '',
      poet: '',
      description: '',
      tags: [],
    }),
  },
})

const goToDetail = () => {
  router.push({
    path: ROUTES.TOURISM_SCENERY,
    query: { id: props.scenery.id },
  })
}
</script>

<template>
  <div class="scenery-card" @click="goToDetail">
    <div class="card-image">
      <img :src="scenery.image" :alt="scenery.name" />
      <div class="location-tag">
        <el-tag size="small" effect="dark">{{ scenery.location }}</el-tag>
      </div>
    </div>
    <div class="card-content">
      <h3 class="title">{{ scenery.name }}</h3>
      <div class="poem-section">
        <p class="poem">{{ scenery.poem }}</p>
        <span class="poet">—— {{ scenery.poet }}</span>
      </div>
      <p class="description">{{ scenery.description }}</p>
      <div class="tags">
        <el-tag v-for="tag in scenery.tags" :key="tag" size="small" class="tag">
          {{ tag }}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scenery-card {
  background-color: #a0d9f1;
  width: 300px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }

  .card-image {
    position: relative;
    height: 200px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .location-tag {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }

  .card-content {
    padding: 15px;

    .title {
      font-size: 18px;
      margin-bottom: 10px;
      color: #333;
    }

    .poem-section {
      margin: 10px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;

      .poem {
        font-size: 14px;
        color: #666;
        font-style: italic;
        margin-bottom: 5px;
      }

      .poet {
        font-size: 12px;
        color: #999;
      }
    }

    .description {
      font-size: 14px;
      color: #666;
      margin: 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;

      .tag {
        margin-right: 5px;
      }
    }
  }
}
</style>
