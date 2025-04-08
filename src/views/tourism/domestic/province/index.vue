<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import SceneryCard from '../../components/SceneryCard/index.vue'

const route = useRoute()
const provinceInfo = ref({
  name: '江苏',
  description: '江苏省位于中国东部沿海地区，自古就是诗人墨客吟咏的重地。这里有江南水乡的婉约，有运河古韵的悠长...',
  poetCount: 156,
  poemCount: 523,
  sceneryCount: 89,
  coverImage: 'https://example.com/jiangsu-cover.jpg',
  features: ['园林文化', '水乡古镇', '文人雅致']
})

const sceneryList = ref([
  {
    id: 1,
    name: '拙政园',
    image: 'https://example.com/zhuozhengyuan.jpg',
    location: '苏州市',
    poem: '咫尺山林藏古寺，数重门户隐幽居。',
    poet: '王维',
    description: '拙政园是苏州古典园林的代表作...',
    tags: ['园林', '世界遗产', '苏州园林']
  },
  // 更多景点数据...
])

const activeCategory = ref('all')
const categories = [
  { key: 'all', label: '全部景点' },
  { key: 'garden', label: '园林景观' },
  { key: 'temple', label: '寺庙古迹' },
  { key: 'watertown', label: '水乡古镇' }
]

onMounted(() => {
  // 这里可以根据 route.query.province 获取具体省份数据
  console.log('Province:', route.query.province)
})
</script>

<template>
  <div class="province-detail">
    <div class="province-header" :style="{ backgroundImage: `url(${provinceInfo.coverImage})` }">
      <div class="header-content">
        <h1>{{ provinceInfo.name }}</h1>
        <p class="description">{{ provinceInfo.description }}</p>
        <div class="statistics">
          <div class="stat-item">
            <h4>{{ provinceInfo.poetCount }}</h4>
            <span>历代诗人</span>
          </div>
          <div class="stat-item">
            <h4>{{ provinceInfo.poemCount }}</h4>
            <span>相关诗词</span>
          </div>
          <div class="stat-item">
            <h4>{{ provinceInfo.sceneryCount }}</h4>
            <span>景点胜地</span>
          </div>
        </div>
        <div class="features">
          <el-tag v-for="feature in provinceInfo.features" :key="feature">
            {{ feature }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="content-section">
      <div class="category-filter">
        <el-radio-group v-model="activeCategory">
          <el-radio-button 
            v-for="category in categories" 
            :key="category.key" 
            :label="category.key"
          >
            {{ category.label }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <div class="scenery-grid">
        <SceneryCard
          v-for="scenery in sceneryList"
          :key="scenery.id"
          :scenery="scenery"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.province-detail {
  .province-header {
    height: 400px;
    background-size: cover;
    background-position: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
    }

    .header-content {
      position: relative;
      color: white;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-size: 48px;
        margin-bottom: 20px;
      }

      .description {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 30px;
      }

      .statistics {
        display: flex;
        gap: 40px;
        margin-bottom: 30px;

        .stat-item {
          text-align: center;

          h4 {
            font-size: 32px;
            margin-bottom: 5px;
          }

          span {
            font-size: 14px;
            opacity: 0.8;
          }
        }
      }

      .features {
        display: flex;
        gap: 10px;
        
        .el-tag {
          padding: 8px 16px;
        }
      }
    }
  }

  .content-section {
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;

    .category-filter {
      margin-bottom: 30px;
      text-align: center;
    }

    .scenery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }
  }
}
</style>