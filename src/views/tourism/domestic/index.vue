<script setup>
import { ref } from 'vue'
import SceneryCard from '../components/SceneryCard/index.vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'

const router = useRouter()
const activeProvince = ref('all')

const provinces = ref([
  { value: 'all', label: '全部' },
  { value: 'beijing', label: '北京' },
  { value: 'jiangsu', label: '江苏' },
  { value: 'zhejiang', label: '浙江' },
  { value: 'anhui', label: '安徽' },
  { value: 'sichuan', label: '四川' },
  { value: 'shanxi', label: '陕西' },
  { value: 'hubei', label: '湖北' },
  { value: 'hunan', label: '湖南' },
  { value: 'shandong', label: '山东' },
  { value: 'henan', label: '河南' },
  { value: 'guangdong', label: '广东' },
  { value: 'fujian', label: '福建' },
  { value: 'jiangxi', label: '江西' },
  { value: 'guizhou', label: '贵州' },
  { value: 'yunnan', label: '云南' },
  { value: 'shaanxi', label: '陕西' },
  { value: 'gansu', label: '甘肃' },
  { value: 'hebei', label: '河北' },
  { value: 'shanxi', label: '山西' },
])

const sceneryList = ref([
  {
    id: 1,
    name: '苏州园林',
    image: 'https://example.com/suzhou.jpg',
    location: '江苏·苏州',
    poem: '吴地能种树，园林半是家。',
    poet: '杜甫',
    description: '苏州园林以其精致典雅的园林艺术闻名于世...',
    tags: ['园林', '江南风光', '世界遗产'],
  },
])

const handleProvinceChange = (province) => {
  activeProvince.value = province
  // 这里可以根据省份筛选景点
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

    <div class="quick-access">
      <el-card
        class="province-card"
        v-for="province in provinces"
        :key="province.value"
        v-show="province.value !== 'all'"
        @click="goToProvince(province)"
      >
        <h3>{{ province.label }}</h3>
        <!-- 这里可以添加省份的缩略图和简介 -->
      </el-card>
    </div>

    <div class="scenery-list">
      <SceneryCard v-for="scenery in sceneryList" :key="scenery.id" :scenery="scenery" />
    </div>

    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="100" :page-size="12" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.domestic-container {
  padding: 20px;

  .province-nav {
    margin-bottom: 20px;
  }

  .quick-access {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;

    .province-card {
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: translateY(-5px);
      }

      h3 {
        text-align: center;
        margin: 10px 0;
      }
    }
  }

  .scenery-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
