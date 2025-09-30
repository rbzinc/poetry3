<script setup>
import { ref, computed } from 'vue'
import SceneryCard from '../components/SceneryCard/index.vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { useSceneryStore } from '@/stores/modules/scenery.js'

const router = useRouter()
const activeProvince = ref('all')
const currentPage = ref(1) // 新增：当前页
const pageSize = 6 // 每页4条
const provinces = ref([
  { value: 'all', label: '全部' },
  { value: 'beijing', label: '北京' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'anhui', label: '安徽' },
  { value: 'sichuan', label: '四川' },
  { value: 'shanxi', label: '陕西' },
])

// 使用 Pinia Store
const sceneryStore = useSceneryStore()
const sceneryList = computed(() => sceneryStore.getSceneryByProvince(activeProvince.value))

const getProvinceImage = (province) => {
  const imageMap = {
    beijing:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%8C%97%E4%BA%AC/%E5%A4%A9%E5%AE%89%E9%97%A8%E5%B9%BF%E5%9C%BA.jpeg',
    jiangsu: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B1%9F%E8%8B%8F/%E5%8D%97%E4%BA%AC.jpeg',
    zhejiang: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B5%99%E6%B1%9F/%E6%9D%AD%E5%B7%9E.jpeg',
    anhui: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%AE%89%E5%BE%BD/%E5%90%88%E8%82%A5.jpeg',
    sichuan:
      'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%9B%9B%E5%B7%9D/%E4%B9%9D%E5%AF%A8%E6%B2%9F.png',
    shanxi: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E9%99%95%E8%A5%BF/%E8%A5%BF%E5%AE%89.jpeg',
  }
  return imageMap[province] || 'https://img.zcool.cn/community/01c2665541f3210000019ae9b8cd33.jpg@1280w_1l_2o_100sh.jpg'
}
// 新增：分页后的景点列表
const paginatedSceneryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sceneryList.value.slice(start, start + pageSize)
})

const handleProvinceChange = () => {
  currentPage.value = 1 // 切换省份时重置到第一页
}
const goToProvince = (province) => {
  router.push({
    path: ROUTES.TOURISM_PROVINCE,
    query: { province: province.value },
  })
}
</script>

<template>
  <div class="domestic-container">
    <!-- 页面标题区 -->
    <div class="page-header">
      <div class="header-content">
        <el-icon class="header-icon"><Location /></el-icon>
        <div>
          <h1>诗意之旅</h1>
          <p class="subtitle">探索诗词中的山水胜景，品味千年文化</p>
        </div>
      </div>
    </div>

    <!-- 省份导航 -->
    <div class="province-nav">
      <div class="nav-title">
        <el-icon><Guide /></el-icon>
        <span>选择省份</span>
      </div>
      <div class="province-tabs">
        <div
          v-for="province in provinces"
          :key="province.value"
          class="province-tab"
          :class="{ active: activeProvince === province.value }"
          @click="activeProvince = province.value; handleProvinceChange()"
        >
          <span>{{ province.label }}</span>
        </div>
      </div>
    </div>

    <!-- 热门省份 -->
    <div class="section">
      <div class="section-header">
        <el-icon class="section-icon"><Sunny /></el-icon>
        <h2 class="section-title">热门省份</h2>
        <p class="section-desc">点击探索各省诗词名胜</p>
      </div>
      
      <div class="province-grid">
        <div
          v-for="province in provinces.filter((p) => p.value !== 'all')"
          :key="province.value"
          class="province-card"
          @click="goToProvince(province)"
        >
          <div class="card-image" :style="{ backgroundImage: `url(${getProvinceImage(province.value)})` }">
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3>{{ province.label }}</h3>
            <div class="arrow-icon">
              <el-icon><Right /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐景点 -->
    <div class="section">
      <div class="section-header">
        <el-icon class="section-icon"><Picture /></el-icon>
        <h2 class="section-title">推荐景点</h2>
        <p class="section-desc">{{ activeProvince === 'all' ? '全部精选景点' : provinces.find(p => p.value === activeProvince)?.label + '热门景点' }}</p>
      </div>
      
      <div class="scenery-grid">
        <SceneryCard v-for="scenery in paginatedSceneryList" :key="scenery.id" :scenery="scenery" />
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="sceneryList.length > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="sceneryList.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.domestic-container {
  // 页面标题区
  .page-header {
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 30px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;

      .header-icon {
        font-size: 56px;
        color: #667eea;
        filter: drop-shadow(0 2px 8px rgba(102, 126, 234, 0.3));
      }

      h1 {
        margin: 0 0 8px 0;
        font-size: 36px;
        font-weight: 700;
        color: #333;
      }

      .subtitle {
        margin: 0;
        font-size: 15px;
        color: #999;
      }
    }
  }

  // 省份导航
  .province-nav {
    background: white;
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 30px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

    .nav-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 600;
      color: #333;

      .el-icon {
        font-size: 22px;
        color: #667eea;
      }
    }

    .province-tabs {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;

      .province-tab {
        padding: 10px 24px;
        background: #f5f5f5;
        border-radius: 12px;
        font-size: 15px;
        color: #666;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;

        &:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
        }

     
      }
    }
  }

  // 区块样式
  .section {
    margin-bottom: 40px;

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;

      .section-icon {
        font-size: 28px;
      }

      .section-title {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #333;
      }

      .section-desc {
        margin: 0 0 0 auto;
        font-size: 14px;
        color: #999;
      }
    }

    // 省份网格
    .province-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      margin-bottom: 20px;

      .province-card {
        position: relative;
        height: 180px;
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
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 3;
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.4s ease;

          .card-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transition: all 0.4s ease;
          }
        }

        .card-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
          padding: 20px;

          h3 {
            color: white;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.4s ease;
          }

          .arrow-icon {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transform: translateX(-10px);
            transition: all 0.4s ease;

            .el-icon {
              font-size: 20px;
              color: white;
            }
          }
        }

        &:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.25);

          &::before {
            opacity: 1;
          }

          .card-image {
            transform: scale(1.1);

          }

          .card-content {
            h3 {
              transform: translateY(-10px);
            }

            .arrow-icon {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      }
    }

    // 景点网格
    .scenery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    // 分页
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 32px;
    }
  }
}


</style>
