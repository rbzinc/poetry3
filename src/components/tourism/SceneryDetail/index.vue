<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PoetryRelated from '../PoetryRelated/index.vue'
import { useSceneryStore } from '@/stores/modules/scenery.js'
import { ArrowLeftBold, Location, Calendar, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const sceneryStore = useSceneryStore()
const loading = ref(true)

// 获取路由参数中的景点ID
const sceneryId = computed(() => Number(route.query.id) || 0)

// 从store中获取景点详情
const sceneryDetail = computed(() => {
  const allScenery = sceneryStore.allScenery
  const scenery = allScenery.find((item) => item.id === sceneryId.value)

  if (!scenery) {
    return {
      id: 0,
      name: '未找到景点',
      images: ['https://img.zcool.cn/community/01c2665541f3210000019ae9b8cd33.jpg@1280w_1l_2o_100sh.jpg'],
      location: '未知位置',
      description: '未找到该景点的详细信息',
      history: '暂无历史信息',
      culturalValue: '暂无文化价值信息',
      bestVisitTime: '暂无最佳游览时间信息',
      relatedPoems: [],
    }
  }

  // 构建完整的景点详情对象
  return {
    ...scenery,
    // 如果景点没有多张图片，则使用主图片
    images: [scenery.image, scenery.image],
    // 补充可能缺失的字段
    history: scenery.history || `${scenery.name}有着悠久的历史，是中国传统文化的重要载体。`,
    culturalValue:
      scenery.culturalValue ||
      `${scenery.name}在文学、艺术等方面有着重要的文化价值，多位文人墨客在此留下了不朽的诗篇。`,
    bestVisitTime: scenery.bestVisitTime || '春季和秋季是最佳游览时间，气候宜人，景色优美。',
    // 构建相关诗词
    relatedPoems: scenery.relatedPoems || [
      {
        title: `咏${scenery.name}`,
        content: scenery.poem || '暂无相关诗词内容',
        poet: scenery.poet || '佚名',
        dynasty: scenery.dynasty || '未知',
      },
    ],
  }
})
console.log(sceneryDetail.value, '123')
// 返回上一页
const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  if (sceneryId.value === 0) {
    ElMessage.warning('未指定景点ID，将显示默认内容')
  } else if (!sceneryDetail.value || sceneryDetail.value.id === 0) {
    ElMessage.error('未找到指定景点信息')
  }

  // 模拟加载过程
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <div class="scenery-detail">
    <div class="back-button" @click="goBack">
      <el-icon><ArrowLeftBold /></el-icon> 返回
    </div>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="skeleton-container">
          <el-skeleton-item variant="image" style="width: 100%; height: 400px" />
          <div style="padding: 20px">
            <el-skeleton-item variant="h1" style="width: 50%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 30%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 100%" />
            <el-skeleton-item variant="text" style="margin-top: 16px; width: 100%" />
          </div>
        </div>
      </template>

      <template #default>
        <div class="image-gallery">
          <el-carousel height="400px" indicator-position="outside" arrow="always">
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

            <div class="tags" v-if="sceneryDetail.tags && sceneryDetail.tags.length">
              <el-tag
                v-for="tag in sceneryDetail.tags"
                :key="tag"
                type="success"
                effect="light"
                size="small"
                class="tag-item"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <el-tabs>
            <el-tab-pane label="景点介绍">
              <div class="description">
                <div class="info-section">
                  <div class="section-header">
                    <el-icon><InfoFilled /></el-icon>
                    <h3>概述</h3>
                  </div>
                  <p>{{ sceneryDetail.description }}</p>
                </div>

                <div class="info-section">
                  <div class="section-header">
                    <el-icon><Calendar /></el-icon>
                    <h3>历史沿革</h3>
                  </div>
                  <p>{{ sceneryDetail.history }}</p>
                </div>

                <div class="info-section">
                  <div class="section-header">
                    <el-icon><InfoFilled /></el-icon>
                    <h3>文化价值</h3>
                  </div>
                  <p>{{ sceneryDetail.culturalValue }}</p>
                </div>

                <div class="info-section">
                  <div class="section-header">
                    <el-icon><Calendar /></el-icon>
                    <h3>最佳游览时间</h3>
                  </div>
                  <p>{{ sceneryDetail.bestVisitTime }}</p>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="相关诗词">
              <PoetryRelated :poems="sceneryDetail.relatedPoems" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-skeleton>
  </div>
</template>

<style scoped lang="scss">
.scenery-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;

  .back-button {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 10;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(5px);
    border-radius: 30px;
    transition: all 0.3s;
    font-weight: 500;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    &:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }
  }

  .skeleton-container {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    background: white;
  }

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
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .basic-info {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;

      h1 {
        font-size: 32px;
        margin-bottom: 15px;
        color: #303133;
      }

      .location {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #606266;
        font-size: 16px;
        margin-bottom: 15px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;

        .tag-item {
          padding: 6px 12px;
          border-radius: 4px;
        }
      }
    }

    .description {
      .info-section {
        margin-bottom: 30px;

        .section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;

          h3 {
            font-size: 20px;
            color: #303133;
            margin: 0;
          }

          .el-icon {
            color: #67c23a;
            font-size: 20px;
          }
        }

        p {
          font-size: 16px;
          line-height: 1.8;
          color: #606266;
          margin: 0;
          padding-left: 30px;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .scenery-detail {
    padding: 10px;

    .back-button {
      top: 20px;
      left: 20px;
      padding: 8px 15px;
      font-size: 14px;
    }

    .detail-content {
      padding: 20px;

      .basic-info h1 {
        font-size: 24px;
      }

      .description .info-section {
        .section-header h3 {
          font-size: 18px;
        }

        p {
          font-size: 14px;
          padding-left: 15px;
        }
      }
    }
  }
}
</style>
