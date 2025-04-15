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
    description: '苏州园林以其精致典雅的园林艺术闻名于世，是中国古典园林的代表作品。',
    tags: ['园林', '江南风光', '世界遗产'],
  },
  {
    id: 2,
    name: '西湖',
    image: 'https://example.com/xihu.jpg',
    location: '浙江·杭州',
    poem: '欲把西湖比西子，淡妆浓抹总相宜。',
    poet: '苏轼',
    description: '杭州西湖景区融自然与人文景观于一体，是中国最著名的观光胜地之一。',
    tags: ['湖泊', '自然景观', '世界遗产'],
  },
  {
    id: 3,
    name: '黄山',
    image: 'https://example.com/huangshan.jpg',
    location: '安徽·黄山',
    poem: '黄山四千仞，三十二莲峰。',
    poet: '李白',
    description: '黄山以奇松、怪石、云海、温泉"四绝"闻名于世，被誉为"天下第一奇山"。',
    tags: ['山岳', '自然景观', '世界遗产'],
  },
  {
    id: 4,
    name: '故宫',
    image: 'https://example.com/gugong.jpg',
    location: '北京',
    poem: '紫禁城中秋月明，菊花香露湿流萤。',
    poet: '李商隐',
    description: '故宫是中国明清两代的皇家宫殿，是中国古代宫廷建筑的精华。',
    tags: ['古建筑', '历史遗迹', '世界遗产'],
  },
  {
    id: 5,
    name: '九寨沟',
    image: 'https://example.com/jiuzhaigou.jpg',
    location: '四川·阿坝',
    poem: '翠湖碧波映山色，彩林红叶舞秋风。',
    poet: '现代',
    description: '九寨沟以其碧蓝的湖水、叠瀑、彩林和雪山闻名于世，被誉为"人间仙境"。',
    tags: ['自然景观', '湖泊', '世界遗产'],
  },
  {
    id: 6,
    name: '武陵源',
    image: 'https://example.com/wulingyuan.jpg',
    location: '湖南·张家界',
    poem: '峰林倒影入潭中，山色空蒙雨亦空。',
    poet: '现代',
    description: '张家界以其独特的石英砂岩峰林地貌闻名，是《阿凡达》外景地的灵感来源。',
    tags: ['自然景观', '山岳', '世界遗产'],
  },
  {
    id: 7,
    name: '泰山',
    image: 'https://example.com/taishan.jpg',
    location: '山东·泰安',
    poem: '会当凌绝顶，一览众山小。',
    poet: '杜甫',
    description: '泰山是中国五岳之首，以其雄伟的气势和深厚的文化底蕴著称。',
    tags: ['山岳', '文化遗产', '世界遗产'],
  },
  {
    id: 8,
    name: '龙门石窟',
    image: 'https://example.com/longmen.jpg',
    location: '河南·洛阳',
    poem: '石窟千龛佛，雕刻万象新。',
    poet: '现代',
    description: '龙门石窟是中国石窟艺术的巅峰之作，展现了盛唐时期的雕刻艺术。',
    tags: ['石窟', '佛教文化', '世界遗产'],
  },
  {
    id: 9,
    name: '丽江古城',
    image: 'https://example.com/lijiang.jpg',
    location: '云南·丽江',
    poem: '玉龙雪山云缭绕，纳西古城水潺潺。',
    poet: '现代',
    description: '丽江古城是纳西族的传统聚居地，以其独特的民族特色和古城风貌闻名。',
    tags: ['古城', '民族文化', '世界遗产'],
  },
  {
    id: 10,
    name: '莫高窟',
    image: 'https://example.com/mogao.jpg',
    location: '甘肃·敦煌',
    poem: '大漠孤烟直，长河落日圆。',
    poet: '王维',
    description: '莫高窟是世界上现存规模最大、内容最丰富的佛教艺术圣地。',
    tags: ['石窟', '丝绸之路', '世界遗产'],
  },
])

const handleProvinceChange = (province) => {
  activeProvince.value = province
  // 这里可以根据省份筛选景点
}
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
const goToProvince = (province) => {
  router.push({
    path: ROUTES.TOURISM_PROVINCE,
    query: { province: province.value },
  })
}

// 分页逻辑
const currentPage = ref(1)
const pageSize = 8

const paginatedSceneryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return sceneryList.value.slice(start, end)
})

const handlePageChange = (page) => {
  currentPage.value = page
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
