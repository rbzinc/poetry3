<script setup>
import { ref, computed } from 'vue'
import { goVrDetail } from '@/router/helpers.js'
import { STUDY_BG } from '@/constants/bgUrl.js'
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

const vrScenes = ref([
  {
    id: 1,
    url: qjt,
    poem: '大漠孤烟直，长河落日圆',
    author: '王维',
    title: '塞上风光',
  },
  {
    id: 2,
    url: qjt2,
    poem: '青山横北郭，白水绕东城',
    author: '韦应物',
    title: '山水之景',
  },
  {
    id: 3,
    url: qjt3,
    poem: '会当凌绝顶，一览众山小',
    author: '杜甫',
    title: '登高远眺',
  },
  {
    id: 4,
    url: qjt4,
    poem: '落霞与孤鹜齐飞，秋水共长天一色',
    author: '王勃',
    title: '秋日晚景',
  },
  {
    id: 5,
    url: qjt5,
    poem: '千山鸟飞绝，万径人踪灭',
    author: '柳宗元',
    title: '雪景山林',
  },
  {
    id: 6,
    url: qjt6,
    poem: '一道残阳铺水中，半江瑟瑟半江红',
    author: '白居易',
    title: '江上夕阳',
  },
  {
    id: 7,
    url: qjt7,
    poem: '白日依山尽，黄河入海流',
    author: '刘长卿',
    title: '山村暮景',
  },
  {
    id: 8,
    url: qjt8,
    poem: '海日生残夜，江春入旧年',
    author: '张继',
    title: '江边夜景',
  },
  {
    id: 9,
    url: qjt9,
    poem: '停车坐爱枫林晚，霜叶红于二月花',
    author: '王维',
    title: '竹林晚照',
  },
  {
    id: 10,
    url: qjt10,
    poem: '大漠孤烟直，长河落日圆',
    author: '杨万里',
    title: '荷塘胜景',
  },
  {
    id: 11,
    url: qjt11,
    poem: '飞流直下三千尺，疑是银河落九天',
    author: '苏轼',
    title: '湖光山色',
  },
  {
    id: 12,
    url: qjt12,
    poem: '忽如一夜春风来，千树万树梨花开',
    author: '王维',
    title: '江山胜境',
  },
  {
    id: 13,
    url: qjt13,
    poem: '会当凌绝顶，一览众山小',
    author: '林逋',
    title: '梅花夜景',
  },
  {
    id: 14,
    url: qjt14,
    poem: '云霞出海曙，梅柳渡江春',
    author: '苏轼',
    title: '春江景色',
  },
  {
    id: 15,
    url: qjt15,
    poem: '孤山寺北贾亭西，水面初平云脚低',
    author: '杜甫',
    title: '春雨景致',
  },
])

// 搜索和分页处理
const filteredScenes = computed(() => {
  return vrScenes.value.filter(
    (scene) =>
      scene.poem.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scene.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
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
</script>

<template>
  <div class="vr-container" :style="{ backgroundImage: `${STUDY_BG}` }">
    <div class="header">
      <h2 class="title">VR助学</h2>
      <div class="search-box">
        <el-input v-model="searchQuery" placeholder="搜索场景或诗句" prefix-icon="Search" clearable />
      </div>
    </div>

    <div class="scenes-grid">
      <el-card
        v-for="scene in paginatedScenes"
        :key="scene.id"
        class="scene-card"
        :body-style="{ padding: '0px' }"
        shadow="hover"
        @click="goToDetail(scene)"
      >
        <div class="scene-image">
          <img :src="scene.url" :alt="scene.title" />
        </div>
        <div class="scene-info">
          <div class="poem">{{ scene.poem }}</div>
        </div>
      </el-card>
    </div>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        background
        layout="prev, pager, next"
        :total="total"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.vr-container {
  padding: 20px;
  background-size: cover;
  height: calc(100vh - 120px);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding: 0 20px;

    .title {
      font-size: 28px;
      color: #333;
      margin: 0;
    }

    .search-box {
      width: 300px;
    }
  }

  .scenes-grid {
    display: grid;
    grid-template-columns: repeat(4, 2fr);
    gap: 20px;
    padding: 0 20px;
    margin: 0 auto;
    max-width: 1400px;
    .scene-card {
      width: 100%;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);

        .scene-overlay {
          opacity: 1;
        }
      }

      .scene-image {
        position: relative;
        height: 180px;

        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
      }

      .scene-info {
        padding: 6px;
        text-align: center;
        .poem {
          font-size: 14px;
          color: #333;
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
