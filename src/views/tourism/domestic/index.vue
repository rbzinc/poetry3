<script setup>
import { ref, computed } from 'vue'
import SceneryCard from '../components/SceneryCard/index.vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { useSceneryStore } from '@/stores/modules/scenery.js'
const router = useRouter()
const activeProvince = ref('all')
const currentPage = ref(1) // 新增：当前页
const pageSize = 4 // 每页4条
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
    beijing: 'https://img.zcool.cn/community/01f9ea5541f3210000019ae9df1533.jpg@1280w_1l_2o_100sh.jpg',
    jiangsu: 'https://img.zcool.cn/community/0183465541f3220000019ae9b8cd33.jpg@1280w_1l_2o_100sh.jpg',
    zhejiang: 'https://img.zcool.cn/community/01a0f75541f3220000019ae9f12f18.jpg@1280w_1l_2o_100sh.jpg',
    anhui: 'https://img.zcool.cn/community/01f4f65541f31f0000019ae9f8ff6a.jpg@1280w_1l_2o_100sh.jpg',
    sichuan: 'https://img.zcool.cn/community/01f1c65541f3210000019ae9df1533.jpg@1280w_1l_2o_100sh.jpg',
  }
  return imageMap[province] || 'https://img.zcool.cn/community/01c2665541f3210000019ae9b8cd33.jpg@1280w_1l_2o_100sh.jpg'
}
// 新增：分页后的景点列表
const paginatedSceneryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return sceneryList.value.slice(start, start + pageSize)
})

const handleProvinceChange = (province) => {
  activeProvince.value = province
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
    <div class="province-nav">
      <el-tabs v-model="activeProvince" @tab-click="handleProvinceChange">
        <el-tab-pane v-for="province in provinces" :key="province.value" :label="province.label" :name="province.value">
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 优化后的省份快速访问区域 -->
    <h2 class="section-title">热门省份</h2>
    <div class="quick-access">
      <div
        v-for="province in provinces.filter((p) => p.value !== 'all')"
        :key="province.value"
        class="province-card"
        @click="goToProvince(province)"
        :style="{ backgroundImage: `url(${getProvinceImage(province.value)})` }"
      >
        <div class="card-content">
          <h3>{{ province.label }}</h3>
          <div class="card-overlay"></div>
        </div>
      </div>
    </div>

    <h2 class="section-title">推荐景点</h2>
    <div class="scenery-list">
      <SceneryCard v-for="scenery in paginatedSceneryList" :key="scenery.id" :scenery="scenery" />
    </div>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="sceneryList.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.domestic-container {
  padding: 20px;

  .section-title {
    font-size: 24px;
    margin: 30px 0 20px;
    padding-left: 10px;
    border-left: 4px solid #409eff;
    color: #333;
  }

  .province-nav {
    margin-bottom: 20px;
  }

  .quick-access {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 30px;

    .province-card {
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      background-size: cover;
      background-position: center;
      position: relative;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .card-content {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
      }

      .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6));
        z-index: 1;
      }

      h3 {
        color: white;
        font-size: 18px;
        text-align: center;
        margin: 0;
        font-weight: 600;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        z-index: 3;
      }

      &:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);

        .card-overlay {
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
        }
      }
    }
  }

  .scenery-list {
    display: grid;
    grid-template-columns: repeat(4, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
