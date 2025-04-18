<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SceneryCard from '../../components/SceneryCard/index.vue'
import { useSceneryStore } from '@/stores/modules/scenery.js'
import { ArrowLeftBold } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
const currentPage = ref(1)
const pageSize = ref(4)
const route = useRoute()
const router = useRouter()
const sceneryStore = useSceneryStore()
// 分页后的景点列表
const paginatedSceneryList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredSceneryList.value.slice(startIndex, startIndex + pageSize.value)
})
// 处理页码变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到内容区域顶部
  document.querySelector('.content-section').scrollIntoView({ behavior: 'smooth' })
}
// 获取路由参数中的省份值
const provinceCode = ref(route.query.province || 'beijing')

// 省份信息映射
const provinceInfoMap = {
  beijing: {
    name: '北京',
    description:
      '北京是中国的首都，拥有悠久的历史和丰富的文化遗产。这里有故宫、长城、天坛等众多世界文化遗产，是中国古代建筑艺术的瑰宝。千百年来，无数文人墨客在此留下了不朽的诗篇。',
    features: ['古都文化', '皇家建筑', '现代都市'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%8C%97%E4%BA%AC/%E5%A4%A9%E5%AE%89%E9%97%A8%E5%B9%BF%E5%9C%BA.jpeg',
  },
  jiangsu: {
    name: '江苏',
    description:
      '江苏省位于中国东部沿海地区，自古就是诗人墨客吟咏的重地。这里有江南水乡的婉约，有运河古韵的悠长，有园林之美的精致。苏州园林、扬州瘦西湖、南京秦淮河等都是文人骚客笔下的胜景。',
    features: ['园林文化', '水乡古镇', '文人雅致'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B1%9F%E8%8B%8F/%E5%8D%97%E4%BA%AC.jpeg',
  },
  zhejiang: {
    name: '浙江',
    description:
      '浙江省山水秀美，人文荟萃。西湖、乌镇、西塘等景点闻名遐迩，自古以来就是文人墨客吟咏的对象。"欲把西湖比西子，淡妆浓抹总相宜"道出了西湖的万种风情。',
    features: ['山水胜景', '古镇水乡', '文化底蕴'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B5%99%E6%B1%9F/%E6%9D%AD%E5%B7%9E.jpeg',
  },
  anhui: {
    name: '安徽',
    description:
      '安徽省山水秀丽，人文底蕴深厚。黄山、徽州古村落等是中国传统文化的重要载体。"黄山归来不看岳"道出了黄山的独特魅力，徽派建筑的精美也吸引了无数文人墨客。',
    features: ['徽派文化', '山水风光', '古村古镇'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%AE%89%E5%BE%BD/%E9%BB%84%E5%B1%B1.jpeg',
  },
  sichuan: {
    name: '四川',
    description:
      '四川省地处中国西南，自然风光壮丽多姿，人文历史悠久厚重。这里有九寨沟的碧水蓝天，有峨眉山的云雾缭绕，有都江堰的千年智慧。"蜀道难，难于上青天"描绘了这片土地的险峻与神秘。',
    features: ['自然风光', '蜀文化', '美食之乡'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%9B%9B%E5%B7%9D/%E4%B9%9D%E5%AF%A8%E6%B2%9F.png',
  },
  shanxi: {
    name: '陕西',
    description:
      '陕西省是中华文明的重要发祥地，历史文化底蕴深厚。这里有兵马俑、华清池、大雁塔等历史文化遗迹，也有华山、终南山等自然胜景。"长安回望绣成堆，山顶千门次第开"描绘了古都长安的繁华景象。',
    features: ['古都文化', '历史遗迹', '黄土高原'],
    coverImage:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E9%99%95%E8%A5%BF/%E8%A5%BF%E5%AE%89.jpeg',
  },
}

// 当前省份信息
const provinceInfo = computed(() => {
  return provinceInfoMap[provinceCode.value] || provinceInfoMap.beijing
})

// 获取当前省份的景点列表
const sceneryList = computed(() => {
  return sceneryStore.getSceneryByProvince(provinceCode.value)
})

// 景点分类
const activeCategory = ref('all')
const categories = ref([{ key: 'all', label: '全部景点' }])

// 根据标签生成分类
onMounted(() => {
  // 收集所有标签
  const tagSet = new Set()
  sceneryList.value.forEach((scenery) => {
    scenery.tags.forEach((tag) => {
      if (!tag.includes(provinceInfo.value.name)) {
        // 排除省份名称标签
        tagSet.add(tag)
      }
    })
  })

  // 添加到分类中
  tagSet.forEach((tag) => {
    categories.value.push({
      key: tag,
      label: tag,
    })
  })
})

// 筛选后的景点列表
const filteredSceneryList = computed(() => {
  if (activeCategory.value === 'all') {
    return sceneryList.value
  }
  return sceneryList.value.filter((scenery) => scenery.tags.includes(activeCategory.value))
})

// 统计信息
const statistics = computed(() => {
  return {
    poetCount: Math.floor(Math.random() * 100) + 50, // 模拟数据，实际应从API获取
    poemCount: Math.floor(Math.random() * 400) + 100,
    sceneryCount: sceneryList.value.length,
  }
})

// 返回上一页
const goBack = () => {
  router.go(-1)
}
// 当筛选条件变化时，重置页码
watch(activeCategory, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="province-detail">
    <!-- 优化头部区域 -->
    <div class="province-header" :style="{ backgroundImage: `url(${provinceInfo.coverImage})` }">
      <div class="header-overlay"></div>
      <div class="header-content">
        <div class="back-button" @click="goBack">
          <el-icon><ArrowLeftBold /></el-icon> 返回
        </div>

        <div class="province-title">
          <h1>{{ provinceInfo.name }}</h1>
          <div class="title-divider"></div>
        </div>

        <p class="description">{{ provinceInfo.description }}</p>

        <div class="statistics-container">
          <div class="statistics">
            <div class="stat-item">
              <el-icon class="stat-icon"><Reading /></el-icon>
              <div class="stat-content">
                <h4>{{ statistics.poetCount }}</h4>
                <span>历代诗人</span>
              </div>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Collection /></el-icon>
              <div class="stat-content">
                <h4>{{ statistics.poemCount }}</h4>
                <span>相关诗词</span>
              </div>
            </div>
            <div class="stat-item">
              <el-icon class="stat-icon"><Location /></el-icon>
              <div class="stat-content">
                <h4>{{ statistics.sceneryCount }}</h4>
                <span>景点胜地</span>
              </div>
            </div>
          </div>
        </div>

        <div class="features">
          <el-tag v-for="feature in provinceInfo.features" :key="feature" effect="dark" type="success">
            {{ feature }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- 优化内容区域 -->
    <div class="content-section">
      <div class="content-header">
        <h2 class="section-title">景点探索</h2>

        <div class="filter-controls">
          <!-- 分类筛选器 -->
          <div class="category-filter">
            <el-radio-group v-model="activeCategory" size="large">
              <el-radio-button v-for="category in categories" :key="category.key" :label="category.key">
                {{ category.label }}
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </div>

      <!-- 景点列表 -->
      <div class="scenery-container">
        <SceneryCard v-for="scenery in paginatedSceneryList" :key="scenery.id" :scenery="scenery" />
      </div>

      <!-- 添加分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredSceneryList.length"
          layout="prev, pager, next"
          @current-change="handlePageChange"
          background
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredSceneryList.length === 0" class="empty-state">
        <el-empty description="暂无相关景点数据">
          <el-button type="primary" @click="activeCategory = 'all'">查看全部景点</el-button>
        </el-empty>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.province-detail {
  min-height: 100vh;
  background-color: #f8f9fa;

  .province-header {
    height: 500px;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .header-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8));
      z-index: 1;
    }

    .header-content {
      position: relative;
      color: white;
      padding: 60px;
      max-width: 1000px;
      width: 100%;
      z-index: 2;

      .back-button {
        position: absolute;
        top: 0;
        left: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 30px;
        transition: all 0.3s;
        font-weight: 500;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
      }

      .province-title {
        margin-bottom: 30px;
        text-align: center;

        h1 {
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 15px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          letter-spacing: 2px;
        }

        .title-divider {
          height: 3px;
          width: 80px;
          background: linear-gradient(to right, #67c23a, #95d475);
          margin: 0 auto;
        }
      }

      .description {
        font-size: 16px;
        line-height: 1.8;
        margin-bottom: 40px;
        text-align: center;
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
        opacity: 0.9;
      }

      .statistics-container {
        margin-bottom: 40px;
      }

      .statistics {
        display: flex;
        justify-content: center;
        gap: 60px;
        margin-bottom: 30px;

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;

          .stat-icon {
            font-size: 28px;
            color: #67c23a;
          }

          .stat-content {
            h4 {
              font-size: 36px;
              font-weight: 700;
              margin: 0;
              line-height: 1.2;
            }

            span {
              font-size: 14px;
              opacity: 0.8;
            }
          }
        }
      }

      .features {
        display: flex;
        justify-content: center;
        gap: 12px;
        flex-wrap: wrap;

        .el-tag {
          padding: 8px 16px;
          font-size: 14px;
          border-radius: 20px;
        }
      }
    }
  }

  .content-section {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-top: -60px;
    position: relative;
    z-index: 10;

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;

      .section-title {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
        margin: 0;
        position: relative;
        padding-left: 15px;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 5px;
          height: 25px;
          background: #67c23a;
          border-radius: 3px;
        }
      }

      .filter-controls {
        display: flex;
        align-items: center;
        gap: 20px;

        .layout-toggle {
          margin-left: 10px;
        }
      }
    }

    .category-filter {
      margin-bottom: 20px;
    }

    .scenery-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 25px;
      margin-bottom: 30px;
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 20px;
    }

    .empty-state {
      padding: 80px 0;
      text-align: center;
    }
  }
}
</style>
