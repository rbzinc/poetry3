<script setup>
import { ref, computed } from 'vue'
import SceneryCard from '../components/SceneryCard/index.vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { useSceneryStore } from '@/stores/modules/scenery.js'

const router = useRouter()

// 筛选状态
const activeProvince = ref('all')
const activeDynasty = ref('all')
const currentPage = ref(1)
const pageSize = 6

// 朝代主题配置
const dynastyThemes = ref({
  tang: {
    name: '唐',
    icon: '🏛️',
    color: '#667eea',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '盛世华章'
  },
  song: {
    name: '宋',
    icon: '🎨',
    color: '#f093fb',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '风雅传承'
  },
  yuan: {
    name: '元',
    icon: '🏹',
    color: '#4facfe',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: '马背诗篇'
  },
  ming: {
    name: '明',
    icon: '🏯',
    color: '#43e97b',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    description: '文化复兴'
  },
  qing: {
    name: '清',
    icon: '📜',
    color: '#fa709a',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    description: '余韵绵长'
  }
})

// 省份配置
const provinces = ref([
  { value: 'all', label: '全部', count: 43 },
  { value: 'beijing', label: '北京', count: 8 },
  { value: 'jiangsu', label: '江苏', count: 7 },
  { value: 'zhejiang', label: '浙江', count: 7 },
  { value: 'anhui', label: '安徽', count: 6 },
  { value: 'sichuan', label: '四川', count: 5 },
  { value: 'shanxi', label: '陕西', count: 6 },
])

// 文学大师数据
const literaryMasters = ref([
  {
    id: 1,
    name: '李白',
    dynasty: '唐',
    avatar: '🎭',
    masterwork: '《静夜思》《将进酒》',
    locations: ['扬州', '黄山', '峨眉山', '长安'],
    count: 12,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 2,
    name: '杜甫',
    dynasty: '唐',
    avatar: '📝',
    masterwork: '《登高》《春望》',
    locations: ['长安', '成都', '三峡'],
    count: 8,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 3,
    name: '苏轼',
    dynasty: '宋',
    avatar: '🖋️',
    masterwork: '《水调歌头》《赤壁赋》',
    locations: ['杭州', '黄州', '惠州'],
    count: 10,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 4,
    name: '李清照',
    dynasty: '宋',
    avatar: '🌸',
    masterwork: '《声声慢》《如梦令》',
    locations: ['济南', '金陵', '杭州'],
    count: 6,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    id: 5,
    name: '王维',
    dynasty: '唐',
    avatar: '🏔️',
    masterwork: '《山居秋暝》《使至塞上》',
    locations: ['长安', '终南山', '敦煌'],
    count: 7,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    id: 6,
    name: '白居易',
    dynasty: '唐',
    avatar: '🎵',
    masterwork: '《琵琶行》《长恨歌》',
    locations: ['长安', '洛阳', '苏州'],
    count: 9,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }
])

// 使用 Pinia Store
const sceneryStore = useSceneryStore()

// 扩展景点数据结构（在实际数据中添加朝代和关联信息）
const enhancedSceneryList = computed(() => {
  const baseList = sceneryStore.getSceneryByProvince(activeProvince.value)
  
  // 为每个景点添加朝代和关联作家信息
  return baseList.map(scenery => {
    const enhanced = { ...scenery }
    
    // 根据诗人判断朝代
    if (scenery.poet.includes('李白') || scenery.poet.includes('杜甫') || 
        scenery.poet.includes('王维') || scenery.poet.includes('白居易') || 
        scenery.poet.includes('王昌龄')) {
      enhanced.dynasty = 'tang'
      enhanced.dynastyLabel = '唐'
    } else if (scenery.poet.includes('苏轼') || scenery.poet.includes('李清照')) {
      enhanced.dynasty = 'song'
      enhanced.dynastyLabel = '宋'
    } else if (scenery.poet.includes('明')) {
      enhanced.dynasty = 'ming'
      enhanced.dynastyLabel = '明'
    } else if (scenery.poet.includes('清')) {
      enhanced.dynasty = 'qing'
      enhanced.dynastyLabel = '清'
    } else {
      enhanced.dynasty = 'other'
      enhanced.dynastyLabel = '其他'
    }
    
    // 提取作家名字
    enhanced.relatedPoets = [scenery.poet.replace(/唐·|宋·|明·|清·|现代/g, '')]
    
    return enhanced
  })
})

// 按朝代和省份双重筛选
const filteredSceneryList = computed(() => {
  let list = enhancedSceneryList.value
  
  // 朝代筛选
  if (activeDynasty.value !== 'all') {
    list = list.filter(item => item.dynasty === activeDynasty.value)
  }
  
  return list
})

// 分页后的景点列表
const paginatedSceneryList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredSceneryList.value.slice(start, start + pageSize)
})

// 省份图片映射
const getProvinceImage = (province) => {
  const imageMap = {
    beijing: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%8C%97%E4%BA%AC/%E5%A4%A9%E5%AE%89%E9%97%A8%E5%B9%BF%E5%9C%BA.jpeg',
    jiangsu: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B1%9F%E8%8B%8F/%E5%8D%97%E4%BA%AC.jpeg',
    zhejiang: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E6%B5%99%E6%B1%9F/%E6%9D%AD%E5%B7%9E.jpeg',
    anhui: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%AE%89%E5%BE%BD/%E5%90%88%E8%82%A5.jpeg',
    sichuan: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E5%9B%9B%E5%B7%9D/%E4%B9%9D%E5%AF%A8%E6%B2%9F.png',
    shanxi: 'https://ancient-poem-img.oss-cn-beijing.aliyuncs.com/tourist/%E9%99%95%E8%A5%BF/%E8%A5%BF%E5%AE%89.jpeg',
  }
  return imageMap[province] || 'https://img.zcool.cn/community/01c2665541f3210000019ae9b8cd33.jpg@1280w_1l_2o_100sh.jpg'
}

// 获取省份统计信息
const getProvinceStats = (provinceValue) => {
  const sceneryCount = sceneryStore.getSceneryByProvince(provinceValue).length
  const poets = new Set()
  sceneryStore.getSceneryByProvince(provinceValue).forEach(s => {
    if (s.poet) poets.add(s.poet.replace(/唐·|宋·|明·|清·|现代/g, ''))
  })
  
  return {
    sceneryCount,
    poetCount: poets.size
  }
}

// 事件处理
const handleProvinceChange = (province) => {
  activeProvince.value = province
  currentPage.value = 1
}

const handleDynastyChange = (dynasty) => {
  activeDynasty.value = dynasty
  currentPage.value = 1
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
      <div class="header-background">
        <div class="bg-pattern"></div>
      </div>
      <div class="header-content">
        <div class="header-icon-wrapper">
          <div class="icon-circle">
            <el-icon class="header-icon"><LocationFilled /></el-icon>
          </div>
        </div>
        <div class="header-text">
          <h1>文学胜地探索</h1>
          <p class="subtitle">追寻文学大师足迹，探访千古名篇诞生地</p>
          
          <!-- 统计数据卡片 -->
          <div class="stats-row">
            <div class="stat-item">
              <div class="stat-value">{{ filteredSceneryList.length }}</div>
              <div class="stat-label">经典胜地</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">6</div>
              <div class="stat-label">文化省份</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-value">5</div>
              <div class="stat-label">历史朝代</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 朝代筛选导航 -->
    <div class="dynasty-filter">
      <div class="filter-header">
        <div class="header-icon">
          <el-icon><Clock /></el-icon>
        </div>
        <h3>历史朝代</h3>
        <span class="filter-desc">按朝代筛选文学胜地</span>
      </div>
      <div class="dynasty-tabs">
        <div
          class="dynasty-tab"
          :class="{ active: activeDynasty === 'all' }"
          @click="handleDynastyChange('all')"
        >
          <span class="tab-icon">🌟</span>
          <span class="tab-label">全部</span>
        </div>
        <div
          v-for="(theme, key) in dynastyThemes"
          :key="key"
          class="dynasty-tab"
          :class="{ active: activeDynasty === key }"
          :style="{ '--dynasty-color': theme.color }"
          @click="handleDynastyChange(key)"
        >
          <span class="tab-icon">{{ theme.icon }}</span>
          <div class="tab-content">
            <span class="tab-label">{{ theme.name }}代</span>
            <span class="tab-desc">{{ theme.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 省份导航 -->
    <div class="province-nav">
      <div class="nav-title">
        <el-icon><Guide /></el-icon>
        <span>地理分布</span>
      </div>
      <div class="province-tabs">
        <div
          v-for="province in provinces"
          :key="province.value"
          class="province-tab"
          :class="{ active: activeProvince === province.value }"
          @click="handleProvinceChange(province.value)"
        >
          <span class="province-name">{{ province.label }}</span>
          <span class="province-count">{{ province.count }}</span>
        </div>
      </div>
    </div>

    <!-- 文学大师足迹 -->
    <div class="section masters-section">
      <div class="section-header">
        <div class="header-left">
          <div class="section-icon-wrapper">
            <el-icon class="section-icon"><User /></el-icon>
          </div>
          <div class="header-text">
            <h2 class="section-title">文学大师足迹</h2>
            <p class="section-subtitle">探寻大师游历路线，感受文学创作背景</p>
          </div>
        </div>
      </div>
      
      <div class="masters-grid">
        <div
          v-for="master in literaryMasters"
          :key="master.id"
          class="master-card"
          :style="{ '--master-gradient': master.gradient }"
        >
          <div class="card-background"></div>
          <div class="card-content">
            <div class="master-avatar">{{ master.avatar }}</div>
            <div class="master-info">
              <h3 class="master-name">{{ master.name }}</h3>
              <div class="master-dynasty">{{ master.dynasty }}代诗人</div>
            </div>
            <div class="master-details">
              <div class="detail-item">
                <el-icon><Document /></el-icon>
                <span>{{ master.masterwork }}</span>
              </div>
              <div class="detail-item">
                <el-icon><Location /></el-icon>
                <span>{{ master.locations.join('、') }}</span>
              </div>
              <div class="master-count">
                <span class="count-number">{{ master.count }}</span>
                <span class="count-label">相关胜地</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文学地理分布 -->
    <div class="section provinces-section">
      <div class="section-header">
        <div class="header-left">
          <div class="section-icon-wrapper">
            <el-icon class="section-icon"><MapLocation /></el-icon>
          </div>
          <div class="header-text">
            <h2 class="section-title">文学地理分布</h2>
            <p class="section-subtitle">探索各地文学遗迹与经典诞生地</p>
          </div>
        </div>
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
            <h3 class="province-name">{{ province.label }}</h3>
            <div class="province-stats">
              <div class="stat-badge">
                <el-icon><Picture /></el-icon>
                <span>{{ getProvinceStats(province.value).sceneryCount }} 处</span>
              </div>
              <div class="stat-badge">
                <el-icon><User /></el-icon>
                <span>{{ getProvinceStats(province.value).poetCount }} 位</span>
              </div>
            </div>
            <div class="card-arrow">
              <el-icon><Right /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 经典胜地推荐 -->
    <div class="section scenery-section">
      <div class="section-header">
        <div class="header-left">
          <div class="section-icon-wrapper">
            <el-icon class="section-icon"><PictureFilled /></el-icon>
          </div>
          <div class="header-text">
            <h2 class="section-title">经典胜地推荐</h2>
            <p class="section-subtitle">
              {{ activeProvince === 'all' ? '全部精选胜地' : provinces.find(p => p.value === activeProvince)?.label + '热门胜地' }}
              {{ activeDynasty !== 'all' ? ' · ' + dynastyThemes[activeDynasty].name + '代' : '' }}
            </p>
          </div>
        </div>
        <div class="filter-summary">
          <el-tag v-if="activeDynasty !== 'all'" :style="{ background: dynastyThemes[activeDynasty].gradient, border: 'none', color: 'white' }">
            {{ dynastyThemes[activeDynasty].name }}代
          </el-tag>
          <el-tag v-if="activeProvince !== 'all'" type="info">
            {{ provinces.find(p => p.value === activeProvince)?.label }}
          </el-tag>
        </div>
      </div>
      
      <div class="scenery-grid">
        <SceneryCard 
          v-for="scenery in paginatedSceneryList" 
          :key="scenery.id" 
          :scenery="scenery"
        />
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="filteredSceneryList.length > pageSize">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="filteredSceneryList.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>

      <!-- 空状态 -->
      <div v-if="filteredSceneryList.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>暂无符合条件的胜地</p>
        <el-button type="primary" @click="activeDynasty = 'all'; activeProvince = 'all'">
          重置筛选
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.domestic-container {
  // 页面标题区
  .page-header {
    position: relative;
    background: white;
    border-radius: 24px;
    padding: 50px;
    margin-bottom: 30px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
    overflow: hidden;

    .header-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      opacity: 0.05;
      z-index: 0;

      .bg-pattern {
        width: 100%;
        height: 100%;
        background: 
          radial-gradient(circle at 20% 50%, #667eea 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #764ba2 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    }

    .header-content {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 30px;

      .header-icon-wrapper {
        flex-shrink: 0;

        .icon-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          animation: pulse-ring 3s ease-in-out infinite;

      .header-icon {
        font-size: 56px;
            color: white;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          }
        }
      }

      .header-text {
        flex: 1;

        h1 {
          margin: 0 0 12px 0;
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #2C3E50 0%, #667eea 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }

        .subtitle {
          margin: 0 0 24px 0;
          font-size: 17px;
          color: #7F8C8D;
          line-height: 1.6;
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 24px;

          .stat-item {
            .stat-value {
              font-size: 32px;
        font-weight: 700;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              background-clip: text;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              line-height: 1.2;
            }

            .stat-label {
              font-size: 13px;
              color: #999;
              margin-top: 4px;
            }
          }

          .stat-divider {
            width: 1px;
            height: 40px;
            background: linear-gradient(to bottom, transparent, #E0E0E0, transparent);
          }
        }
      }
    }
  }

  // 朝代筛选
  .dynasty-filter {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

    .filter-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;

      .header-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      }

      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #2C3E50;
      }

      .filter-desc {
        margin-left: auto;
        font-size: 14px;
        color: #999;
      }
    }

    .dynasty-tabs {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .dynasty-tab {
        flex: 1;
        min-width: 140px;
        padding: 20px;
        background: #F8F9FA;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid transparent;
        display: flex;
        align-items: center;
        gap: 12px;

        .tab-icon {
          font-size: 32px;
          transition: transform 0.3s ease;
        }

        .tab-content {
          display: flex;
          flex-direction: column;
          gap: 4px;

          .tab-label {
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .tab-desc {
            font-size: 12px;
            color: #999;
          }
        }

        &:hover {
          background: white;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

          .tab-icon {
            transform: scale(1.1);
          }
        }

        &.active {
          background: white;
          border-color: var(--dynasty-color, #667eea);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);

          .tab-label {
            color: var(--dynasty-color, #667eea);
          }
        }
      }
    }
  }

  // 省份导航
  .province-nav {
    background: white;
    border-radius: 20px;
    padding: 24px 30px;
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
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        background: #F5F5F5;
        border-radius: 12px;
        font-size: 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;

        .province-name {
          color: #666;
          font-weight: 500;
        }

        .province-count {
          padding: 2px 8px;
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
        }

        &:hover {
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);

          .province-name {
          color: #667eea;
          }
        }

        &.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

          .province-name {
            color: white;
            font-weight: 600;
          }

          .province-count {
            background: rgba(255, 255, 255, 0.25);
            color: white;
          }
        }
      }
    }
  }

  // 区块样式
  .section {
    margin-bottom: 50px;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;

      .header-left {
        display: flex;
        align-items: center;
        gap: 20px;

        .section-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25);

      .section-icon {
            font-size: 32px;
            color: white;
          }
      }

        .header-text {
      .section-title {
            margin: 0 0 6px 0;
            font-size: 32px;
            font-weight: 800;
            color: #2C3E50;
          }

          .section-subtitle {
        margin: 0;
            font-size: 15px;
            color: #7F8C8D;
          }
        }
      }

      .filter-summary {
        display: flex;
        gap: 8px;
      }
    }

    // 文学大师卡片网格
    &.masters-section {
      .masters-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        gap: 24px;

        .master-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 28px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          .card-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--master-gradient);
            opacity: 0;
            transition: opacity 0.4s ease;
          }

          .card-content {
            position: relative;
            z-index: 1;

            .master-avatar {
              width: 80px;
              height: 80px;
              border-radius: 20px;
              background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              margin-bottom: 20px;
              transition: all 0.4s ease;
            }

            .master-info {
              margin-bottom: 20px;

              .master-name {
                font-size: 26px;
                font-weight: 700;
                color: #2C3E50;
                margin: 0 0 8px 0;
                transition: color 0.4s ease;
              }

              .master-dynasty {
                display: inline-block;
                padding: 4px 12px;
                background: var(--master-gradient);
                color: white;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 500;
              }
            }

            .master-details {
              .detail-item {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                margin-bottom: 12px;
                font-size: 14px;
                color: #666;
                transition: color 0.4s ease;

                .el-icon {
                  flex-shrink: 0;
                  margin-top: 2px;
                  color: #667eea;
                }

                span {
                  line-height: 1.6;
                }
              }

              .master-count {
                margin-top: 16px;
                padding-top: 16px;
                border-top: 2px solid #F0F0F0;
                display: flex;
                align-items: baseline;
                gap: 8px;

                .count-number {
                  font-size: 32px;
                  font-weight: 700;
                  background: var(--master-gradient);
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }

                .count-label {
        font-size: 14px;
        color: #999;
                }
              }
            }
          }

          &:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);

            .card-background {
              opacity: 1;
            }

            .card-content {
              .master-avatar {
                transform: scale(1.1) rotate(5deg);
                background: rgba(255, 255, 255, 0.25);
              }

              .master-info .master-name {
                color: white;
              }

              .master-details .detail-item {
                color: white;

                .el-icon {
                  color: white;
                }
              }
            }
          }
        }
      }
    }

    // 省份网格
    &.provinces-section {
    .province-grid {
      display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 24px;

      .province-card {
        position: relative;
          height: 240px;
          border-radius: 20px;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

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
              background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%);
            transition: all 0.4s ease;
          }
        }

        .card-content {
          position: relative;
          height: 100%;
          display: flex;
          flex-direction: column;
            justify-content: flex-end;
          z-index: 2;
            padding: 24px;

            .province-name {
            color: white;
              font-size: 32px;
            font-weight: 700;
              margin: 0 0 12px 0;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.4s ease;
          }

            .province-stats {
              display: flex;
              gap: 12px;
              margin-bottom: 8px;

              .stat-badge {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                background: rgba(255, 255, 255, 0.25);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                font-size: 13px;
                color: white;
                font-weight: 500;

                .el-icon {
                  font-size: 14px;
                }
              }
            }

            .card-arrow {
            position: absolute;
              bottom: 24px;
              right: 24px;
              width: 44px;
              height: 44px;
              background: rgba(255, 255, 255, 0.25);
              backdrop-filter: blur(10px);
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
            transform: translateY(-10px);
            box-shadow: 0 16px 48px rgba(102, 126, 234, 0.25);

          .card-image {
            transform: scale(1.1);

              .card-overlay {
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);
              }
          }

          .card-content {
              .province-name {
                transform: translateY(-8px);
            }

              .card-arrow {
              opacity: 1;
              transform: translateX(0);
              }
            }
          }
        }
      }
    }

    // 景点网格
    &.scenery-section {
    .scenery-grid {
      display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 28px;
        margin-bottom: 32px;
    }

    // 分页
    .pagination {
      display: flex;
      justify-content: center;
        margin-top: 40px;
      }

      // 空状态
      .empty-state {
        text-align: center;
        padding: 80px 20px;
        background: white;
        border-radius: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

        .empty-icon {
          font-size: 80px;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        p {
          font-size: 16px;
          color: #999;
          margin: 0 0 24px 0;
        }
      }
    }
  }
}

// 动画
@keyframes pulse-ring {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .domestic-container {
    .page-header .header-content {
      flex-direction: column;
      text-align: center;

      .header-text .stats-row {
        justify-content: center;
      }
    }

    .dynasty-filter .dynasty-tabs .dynasty-tab {
      min-width: 120px;
    }

    .section {
      &.masters-section .masters-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }

      &.provinces-section .province-grid {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      }
    }
  }
}

@media (max-width: 768px) {
  .domestic-container {
    .page-header {
      padding: 30px 20px;

      .header-content {
        .header-icon-wrapper .icon-circle {
          width: 70px;
          height: 70px;

          .header-icon {
            font-size: 40px;
          }
        }

        .header-text {
          h1 {
            font-size: 28px;
          }

          .subtitle {
            font-size: 15px;
          }

          .stats-row {
            flex-direction: column;
            gap: 16px;

            .stat-divider {
              display: none;
            }
          }
        }
      }
    }

    .dynasty-filter {
      padding: 20px;

      .dynasty-tabs {
        .dynasty-tab {
          min-width: 100%;
        }
      }
    }

    .section {
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;

        .header-left {
          flex-direction: column;
          align-items: flex-start;

          .section-icon-wrapper {
            width: 50px;
            height: 50px;

            .section-icon {
              font-size: 26px;
            }
          }

          .header-text .section-title {
            font-size: 24px;
          }
        }
      }

      &.masters-section .masters-grid {
        grid-template-columns: 1fr;
      }

      &.provinces-section .province-grid {
        grid-template-columns: 1fr;
      }

      &.scenery-section .scenery-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  }
}
</style>
