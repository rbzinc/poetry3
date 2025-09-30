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
      <div class="image-overlay"></div>
      <div class="location-badge">
        <el-icon><Location /></el-icon>
        <span>{{ scenery.location }}</span>
      </div>
    </div>
    
    <div class="card-content">
      <h3 class="title">{{ scenery.name }}</h3>
      
      <div class="poem-section">
        <div class="poem-icon">
          <el-icon><Document /></el-icon>
        </div>
        <div class="poem-content">
          <p class="poem">{{ scenery.poem }}</p>
          <span class="poet">—— {{ scenery.poet }}</span>
        </div>
      </div>
      
      <p class="description">{{ scenery.description }}</p>
      
      <div class="card-footer">
        <div class="tags">
          <el-tag v-for="tag in scenery.tags.slice(0, 3)" :key="tag" size="small" class="tag">
            {{ tag }}
          </el-tag>
        </div>
        <div class="view-more">
          <span>查看详情</span>
          <el-icon><Right /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.scenery-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);

    &::before {
      opacity: 1;
    }

    .card-image {
      img {
        transform: scale(1.1);
      }

      .image-overlay {
        opacity: 1;
      }
    }

    .title {
      color: #667eea;
    }

    .view-more {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .card-image {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .location-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1;

      .el-icon {
        font-size: 14px;
      }
    }
  }

  .card-content {
    padding: 20px;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0 0 16px 0;
      transition: color 0.3s ease;
    }

    .poem-section {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      border-left: 3px solid #667eea;
      border-radius: 8px;
      margin-bottom: 16px;

      .poem-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 8px;
        color: white;

        .el-icon {
          font-size: 18px;
        }
      }

      .poem-content {
        flex: 1;

        .poem {
          font-size: 14px;
          color: #555;
          font-style: italic;
          line-height: 1.6;
          margin: 0 0 8px 0;
        }

        .poet {
          font-size: 12px;
          color: #999;
          font-weight: 500;
        }
      }
    }

    .description {
      font-size: 14px;
      color: #666;
      line-height: 1.7;
      margin: 0 0 16px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        flex: 1;

        .tag {
          border-color: #667eea;
          color: #667eea;
          background: rgba(102, 126, 234, 0.08);
        }
      }

      .view-more {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: #667eea;
        font-weight: 500;
        opacity: 0;
        transform: translateX(-10px);
        transition: all 0.4s ease;

        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
