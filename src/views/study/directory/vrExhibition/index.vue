<script setup>
import { ref, computed } from 'vue'
import { goVrDetail } from '@/router/helpers.js'
import qjt from '@/assets/Panorama/qjt.jpg'
import qjt2 from '@/assets/Panorama/qjt2.jpg'
import qjt3 from '@/assets/Panorama/qjt3.jpg'
import qjt4 from '@/assets/Panorama/qjt4.jpg'
import qjt5 from '@/assets/Panorama/qjt5.jpg'
import qjt6 from '@/assets/Panorama/qjt6.jpg'
import qjt7 from '@/assets/Panorama/1.jpg'
import qjt8 from '@/assets/Panorama/2.jpg'
import qjt9 from '@/assets/Panorama/3.jpg'
import qjt10 from '@/assets/Panorama/4.jpg'
import qjt11 from '@/assets/Panorama/5.jpg'
import qjt12 from '@/assets/Panorama/6.jpg'
import qjt13 from '@/assets/Panorama/7.jpg'
import qjt14 from '@/assets/Panorama/8.jpg'
import qjt15 from '@/assets/Panorama/9.jpg'

// 分页相关
const currentPage = ref(1)
const pageSize = ref(8)
const searchQuery = ref('')

// 视图模式
const viewMode = ref('grid') // grid 或 list

const vrScenes = ref([
  {
    id: 1,
    url: qjt,
    poem: '大漠孤烟直，长河落日圆',
    author: '王维',
    title: '塞上风光',
    category: '边塞诗',
    views: 1234,
  },
  {
    id: 2,
    url: qjt2,
    poem: '青山横北郭，白水绕东城',
    author: '韦应物',
    title: '山水之景',
    category: '山水诗',
    views: 856,
  },
  {
    id: 3,
    url: qjt3,
    poem: '会当凌绝顶，一览众山小',
    author: '杜甫',
    title: '登高远眺',
    category: '登高诗',
    views: 2341,
  },
  {
    id: 4,
    url: qjt4,
    poem: '落霞与孤鹜齐飞，秋水共长天一色',
    author: '王勃',
    title: '秋日晚景',
    category: '写景诗',
    views: 1567,
  },
  {
    id: 5,
    url: qjt5,
    poem: '千山鸟飞绝，万径人踪灭',
    author: '柳宗元',
    title: '雪景山林',
    category: '山水诗',
    views: 987,
  },
  {
    id: 6,
    url: qjt6,
    poem: '一道残阳铺水中，半江瑟瑟半江红',
    author: '白居易',
    title: '江上夕阳',
    category: '写景诗',
    views: 1456,
  },
  {
    id: 7,
    url: qjt7,
    poem: '白日依山尽，黄河入海流',
    author: '刘长卿',
    title: '山村暮景',
    category: '山水诗',
    views: 1123,
  },
  {
    id: 8,
    url: qjt8,
    poem: '海日生残夜，江春入旧年',
    author: '张继',
    title: '江边夜景',
    category: '写景诗',
    views: 876,
  },
  {
    id: 9,
    url: qjt9,
    poem: '停车坐爱枫林晚，霜叶红于二月花',
    author: '王维',
    title: '竹林晚照',
    category: '田园诗',
    views: 1678,
  },
  {
    id: 10,
    url: qjt10,
    poem: '大漠孤烟直，长河落日圆',
    author: '杨万里',
    title: '荷塘胜景',
    category: '田园诗',
    views: 1234,
  },
  {
    id: 11,
    url: qjt11,
    poem: '飞流直下三千尺，疑是银河落九天',
    author: '苏轼',
    title: '湖光山色',
    category: '山水诗',
    views: 2098,
  },
  {
    id: 12,
    url: qjt12,
    poem: '忽如一夜春风来，千树万树梨花开',
    author: '王维',
    title: '江山胜境',
    category: '写景诗',
    views: 1567,
  },
  {
    id: 13,
    url: qjt13,
    poem: '会当凌绝顶，一览众山小',
    author: '林逋',
    title: '梅花夜景',
    category: '咏物诗',
    views: 1345,
  },
  {
    id: 14,
    url: qjt14,
    poem: '云霞出海曙，梅柳渡江春',
    author: '苏轼',
    title: '春江景色',
    category: '写景诗',
    views: 987,
  },
  {
    id: 15,
    url: qjt15,
    poem: '孤山寺北贾亭西，水面初平云脚低',
    author: '杜甫',
    title: '春雨景致',
    category: '写景诗',
    views: 1876,
  },
])

// 分类统计
const categories = computed(() => {
  const cats = ['全部']
  vrScenes.value.forEach((scene) => {
    if (!cats.includes(scene.category)) {
      cats.push(scene.category)
    }
  })
  return cats
})

const selectedCategory = ref('全部')

// 搜索和分类过滤
const filteredScenes = computed(() => {
  let result = vrScenes.value

  // 分类过滤
  if (selectedCategory.value !== '全部') {
    result = result.filter((scene) => scene.category === selectedCategory.value)
  }

  // 搜索过滤
  if (searchQuery.value) {
    result = result.filter(
      (scene) =>
        scene.poem.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        scene.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        scene.author.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  return result
})

const paginatedScenes = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredScenes.value.slice(start, end)
})

const total = computed(() => filteredScenes.value.length)

// 场景详情跳转
const goToDetail = (scene) => {
  try {
    goVrDetail(scene.id)
  } catch (error) {
    console.error('场景加载失败：', error)
  }
}

// 切换分类
const handleCategoryChange = (category) => {
  selectedCategory.value = category
  currentPage.value = 1
}
</script>

<template>
  <div class="vr-container">
    <!-- Hero区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <el-icon class="title-icon"><View /></el-icon>
          VR诗词展览
        </h1>
        <p class="hero-subtitle">沉浸式体验诗词中的美景，让经典文学跃然眼前</p>

        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-value">{{ vrScenes.length }}</div>
            <div class="stat-label">场景总数</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ categories.length - 1 }}</div>
            <div class="stat-label">诗词分类</div>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <div class="stat-value">{{ Math.round(vrScenes.reduce((sum, s) => sum + s.views, 0) / 1000) }}K+</div>
            <div class="stat-label">累计浏览</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <!-- 分类标签 -->
        <div class="category-tags">
          <div
            v-for="category in categories"
            :key="category"
            class="category-tag"
            :class="{ active: selectedCategory === category }"
            @click="handleCategoryChange(category)"
          >
            {{ category }}
          </div>
        </div>
      </div>

      <div class="toolbar-right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索场景、诗句或作者..."
          prefix-icon="Search"
          clearable
          class="search-input"
        />

        <el-button-group class="view-switcher">
          <el-button :type="viewMode === 'grid' ? 'primary' : ''" @click="viewMode = 'grid'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'list' ? 'primary' : ''" @click="viewMode = 'list'">
            <el-icon><List /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 场景网格 -->
    <div class="scenes-section">
      <transition-group name="scene-list" tag="div" :class="['scenes-grid', viewMode]">
        <div v-for="scene in paginatedScenes" :key="scene.id" class="scene-card" @click="goToDetail(scene)">
          <div class="scene-image-wrapper">
            <img :src="scene.url" :alt="scene.title" class="scene-image" />
            <div class="scene-overlay">
              <div class="overlay-icon">
                <el-icon><View /></el-icon>
              </div>
              <div class="overlay-text">点击进入VR体验</div>
            </div>
            <div class="scene-badge">360°</div>
          </div>

          <div class="scene-info">
            <div class="scene-header">
              <h3 class="scene-title">{{ scene.title }}</h3>
              <span class="scene-category">{{ scene.category }}</span>
            </div>

            <p class="scene-poem">{{ scene.poem }}</p>

            <div class="scene-footer">
              <div class="scene-author">
                <el-icon><User /></el-icon>
                {{ scene.author }}
              </div>
              <div class="scene-views">
                <el-icon><View /></el-icon>
                {{ scene.views }}
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- 空状态 -->
      <div v-if="paginatedScenes.length === 0" class="empty-state">
        <el-empty description="未找到相关场景">
          <el-button
            type="primary"
            @click="searchQuery = ''; selectedCategory = '全部'"
          >
            重置筛选
          </el-button>
        </el-empty>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="total > pageSize" class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vr-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
  backdrop-filter: blur(10px);
  overflow: hidden;

  .hero-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 50px 40px;
    color: white;
    text-align: center;

    .hero-content {
      max-width: 900px;
      margin: 0 auto;

      .hero-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin: 0 0 16px 0;
        font-size: 42px;
        font-weight: 700;

        .title-icon {
          font-size: 48px;
        }
      }

      .hero-subtitle {
        margin: 0 0 40px 0;
        font-size: 18px;
        opacity: 0.95;
      }

      .hero-stats {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 32px;
        padding: 32px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 16px;

        .stat-item {
          .stat-value {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
          }

          .stat-label {
            font-size: 14px;
            opacity: 0.9;
          }
        }

        .stat-divider {
          width: 1px;
          height: 50px;
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 40px;
    background: white;
    border-bottom: 1px solid #f0f0f0;

    .toolbar-left {
      flex: 1;

      .category-tags {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;

        .category-tag {
          padding: 8px 20px;
          background: #f5f5f5;
          border-radius: 20px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;

          &:hover {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
          }

          &.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
          }
        }
      }
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .search-input {
        width: 300px;
      }

      .view-switcher {
        :deep(.el-button) {
          padding: 8px 12px;
        }
      }
    }
  }

  .scenes-section {
    flex: 1;
    padding: 30px 40px;
    overflow-y: auto;

    .scenes-grid {
      display: grid;
      gap: 24px;
      margin-bottom: 30px;

      &.grid {
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      }

      &.list {
        grid-template-columns: 1fr;

        .scene-card {
          display: flex;
          flex-direction: row;

          .scene-image-wrapper {
            width: 320px;
            height: 200px;
          }

          .scene-info {
            flex: 1;
          }
        }
      }

      .scene-card {
        background: white;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);

          .scene-image {
            transform: scale(1.1);
          }

          .scene-overlay {
            opacity: 1;
          }
        }

        .scene-image-wrapper {
          position: relative;
          height: 220px;
          overflow: hidden;

          .scene-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .scene-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;

            .overlay-icon {
              .el-icon {
                font-size: 48px;
                color: white;
              }
            }

            .overlay-text {
              font-size: 16px;
              font-weight: 600;
              color: white;
            }
          }

          .scene-badge {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            color: #667eea;
          }
        }

        .scene-info {
          padding: 20px;

          .scene-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .scene-title {
              margin: 0;
              font-size: 18px;
              font-weight: 600;
              color: #333;
            }

            .scene-category {
              padding: 4px 12px;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
              border-radius: 12px;
              font-size: 12px;
              color: #667eea;
              font-weight: 500;
            }
          }

          .scene-poem {
            margin: 0 0 16px 0;
            font-size: 14px;
            color: #666;
            line-height: 1.6;
          }

          .scene-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px solid #f0f0f0;

            .scene-author,
            .scene-views {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              color: #999;

              .el-icon {
                font-size: 16px;
              }
            }
          }
        }
      }
    }

    .empty-state {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    padding: 20px 40px;
    background: white;
    border-top: 1px solid #f0f0f0;
  }
}

// 场景卡片动画
.scene-list-enter-active,
.scene-list-leave-active {
  transition: all 0.3s ease;
}

.scene-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.scene-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 滚动条样式
.scenes-section::-webkit-scrollbar {
  width: 8px;
}

.scenes-section::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.scenes-section::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 4px;
}

// 响应式
@media (max-width: 1200px) {
  .vr-container {
    .scenes-section {
      .scenes-grid {
        &.grid {
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .vr-container {
    .hero-section {
      padding: 30px 20px;

      .hero-content {
        .hero-title {
          font-size: 32px;

          .title-icon {
            font-size: 36px;
          }
        }

        .hero-subtitle {
          font-size: 16px;
        }

        .hero-stats {
          flex-direction: column;
          gap: 20px;

          .stat-divider {
            width: 100px;
            height: 1px;
          }
        }
      }
    }

    .toolbar {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
      padding: 20px;

      .toolbar-left,
      .toolbar-right {
        width: 100%;
      }

      .toolbar-right {
        .search-input {
          flex: 1;
        }
      }
    }

    .scenes-section {
      padding: 20px;

      .scenes-grid {
        &.grid {
          grid-template-columns: 1fr;
        }

        &.list .scene-card {
          flex-direction: column;

          .scene-image-wrapper {
            width: 100%;
          }
        }
      }
    }

    .pagination {
      padding: 15px 20px;
    }
  }
}
</style>
