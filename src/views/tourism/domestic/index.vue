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
