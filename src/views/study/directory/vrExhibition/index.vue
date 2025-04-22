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
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt7.jpg',
    poem: '日暮苍山远，天寒白屋贫',
    author: '刘长卿',
    title: '山村暮景',
  },
  {
    id: 8,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt8.jpg',
    poem: '月落乌啼霜满天，江枫渔火对愁眠',
    author: '张继',
    title: '江边夜景',
  },
  {
    id: 9,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt9.jpg',
    poem: '山际见来烟，竹中窥落日',
    author: '王维',
    title: '竹林晚照',
  },
  {
    id: 10,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt10.jpg',
    poem: '接天莲叶无穷碧，映日荷花别样红',
    author: '杨万里',
    title: '荷塘胜景',
  },
  {
    id: 11,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt11.jpg',
    poem: '水光潋滟晴方好，山色空蒙雨亦奇',
    author: '苏轼',
    title: '湖光山色',
  },
  {
    id: 12,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt12.jpg',
    poem: '江流天地外，山色有无中',
    author: '王维',
    title: '江山胜境',
  },
  {
    id: 13,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt13.jpg',
    poem: '疏影横斜水清浅，暗香浮动月黄昏',
    author: '林逋',
    title: '梅花夜景',
  },
  {
    id: 14,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt14.jpg',
    poem: '竹外桃花三两枝，春江水暖鸭先知',
    author: '苏轼',
    title: '春江景色',
  },
  {
    id: 15,
    url: 'https://takeaway-hei.oss-cn-hangzhou.aliyuncs.com/qjt15.jpg',
    poem: '随风潜入夜，润物细无声',
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
