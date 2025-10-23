<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { getPoetryPoemPage } from '@/api/modules/poePavilion.js'
import { goPoetClassDetail } from '@/router/helpers.js'
import Poetryitem from '@/components/poet/poetryitem/index.vue'

const router = useRouter()

// 数字动画
const showNumber = ref(0)
const poetNumber = ref(0)
const fontNumber = ref(0)

// 统计数据动画
const animateNumbers = () => {
  let frame = 0
  const duration = 2000 // 2秒动画
  const frames = 60
  const increment = duration / frames

  const animate = () => {
    frame++
    const progress = frame / frames
    
    showNumber.value = Math.round(478462 * progress)
    poetNumber.value = Math.round(5646 * progress)
    fontNumber.value = Math.round(765742565 * progress)
    
    if (frame < frames) {
      setTimeout(animate, increment)
    }
  }
  
  animate()
}

onMounted(() => {
  animateNumbers()
  fetchHotPoems() // 获取热门诗词数据
})

// 功能卡片数据
const featureCards = ref([
  {
    icon: '📜',
    title: '经典典藏',
    description: '丰富文学资源，领略华夏文明之美',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: ROUTES.POET
  },
  {
    icon: '🎯',
    title: '互动闯关',
    description: '趣味挑战游戏，轻松掌握文学知识',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    route: ROUTES.DICTIONARY
  },
  {
    icon: '🤖',
    title: '智能对话',
    description: '与文学大师对话，感受智慧的碰撞',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: ROUTES.AI_CHAT
  },
  {
    icon: '🧭',
    title: '文化漫游',
    description: '探索经典背后的名胜古迹',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    route: ROUTES.TOURISM
  },
  {
    icon: '💭',
    title: '学习社区',
    description: '交流心得体会，与同好共同进步',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    route: ROUTES.TALKSQUARE
  },
  {
    icon: '🎨',
    title: '创意画廊',
    description: '用AI将文字转化为艺术画作',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    route: ROUTES.CHAT_TO_PIC
  }
])

// 热门推荐诗词 - 从书阁接口获取真实数据
const hotPoems = ref([])
const poemsLoading = ref(false)

// 获取热门诗词数据
const fetchHotPoems = async () => {
  try {
    poemsLoading.value = true
    const res = await getPoetryPoemPage(1, 6) // 获取第1页，6条数据
    
    if (res.data && res.data.records) {
      hotPoems.value = res.data.records
    }
  } catch (error) {
    console.error('获取诗词数据失败:', error)
    hotPoems.value = []
  } finally {
    poemsLoading.value = false
  }
}

// 柱状图配置 - 优化配色
const barChartOption = ref({
  title: {
    text: '朝代收录总览',
    textStyle: {
      fontSize: 28,
      fontWeight: 600,
      color: '#2C3E50',
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    },
    left: 'center',
    top: 20,
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#E8F4FD',
    borderWidth: 1,
    textStyle: {
      color: '#2C3E50'
    },
    formatter: '{b}: {c} 首'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '80px',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['唐', '宋', '元', '明', '清', '其他'],
    axisLabel: {
      fontSize: 16,
      color: '#7F8C8D',
      fontWeight: 500
    },
    axisLine: {
      lineStyle: {
        color: '#E8F4FD'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 14,
      color: '#7F8C8D'
    },
    splitLine: {
      lineStyle: {
        color: '#E8F4FD',
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: '作品数',
      type: 'bar',
      data: [3212, 3250, 2460, 2632, 6943, 423],
      barWidth: '50%',
      itemStyle: {
        borderRadius: [8, 8, 0, 0],
        color: (params) => {
          const colors = [
            { offset: 0, color: '#667eea' },
            { offset: 1, color: '#764ba2' }
          ]
          const colorList = [
            colors,
            [{ offset: 0, color: '#f093fb' }, { offset: 1, color: '#f5576c' }],
            [{ offset: 0, color: '#4facfe' }, { offset: 1, color: '#00f2fe' }],
            [{ offset: 0, color: '#43e97b' }, { offset: 1, color: '#38f9d7' }],
            [{ offset: 0, color: '#fa709a' }, { offset: 1, color: '#fee140' }],
            [{ offset: 0, color: '#30cfd0' }, { offset: 1, color: '#330867' }]
          ]
          return {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: colorList[params.dataIndex % colorList.length]
          }
        }
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      }
    }
  ]
})

// 饼图配置 - 优化配色
const pieChartOption = ref({
  title: {
    text: '名家作品分布',
    textStyle: {
      fontSize: 28,
      fontWeight: 600,
      color: '#2C3E50',
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
    },
    left: 'center',
    top: 20,
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#E8F4FD',
    borderWidth: 1,
    textStyle: {
      color: '#2C3E50'
    },
    formatter: '{b}: {c}首 ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 30,
    top: 'middle',
    itemGap: 20,
    itemWidth: 14,
    itemHeight: 14,
    textStyle: {
      fontSize: 14,
      color: '#7F8C8D'
    }
  },
  series: [
    {
      name: '作品数',
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['60%', '52%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2,
        color: (params) => {
          const colorList = [
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]},
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#f093fb' },
              { offset: 1, color: '#f5576c' }
            ]},
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#4facfe' },
              { offset: 1, color: '#00f2fe' }
            ]},
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#43e97b' },
              { offset: 1, color: '#38f9d7' }
            ]},
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#fa709a' },
              { offset: 1, color: '#fee140' }
            ]},
            { type: 'linear', x: 0, y: 0, x2: 1, y2: 1, colorStops: [
              { offset: 0, color: '#30cfd0' },
              { offset: 1, color: '#330867' }
            ]}
          ]
          return colorList[params.dataIndex % colorList.length]
        }
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2C3E50'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        }
      },
      data: [
        { value: 127, name: '李白' },
        { value: 101, name: '杜甫' },
        { value: 94, name: '白居易' },
        { value: 46, name: '王维' },
        { value: 127, name: '苏轼' },
        { value: 43, name: '李清照' }
      ]
    }
  ]
})

// 导航到功能页面
const navigateTo = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="modern-home">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="particles-bg"></div>
        <div class="gradient-overlay"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line">品味经典文学之美</span>
            <span class="title-line">开启智慧人文之旅</span>
          </h1>
          <p class="hero-subtitle">
            在墨韵书院，与大师对话，与经典同行，体验创新互动学习方式
          </p>
          
          <!-- 统计数据卡片 -->
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon">📖</div>
              <div class="stat-info">
                <div class="stat-number">{{ showNumber.toLocaleString() }}</div>
                <div class="stat-label">经典篇目</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✍️</div>
              <div class="stat-info">
                <div class="stat-number">{{ poetNumber.toLocaleString() }}</div>
                <div class="stat-label">文学大师</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🔤</div>
              <div class="stat-info">
                <div class="stat-number">{{ fontNumber.toLocaleString() }}</div>
                <div class="stat-label">汉字收录</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 滚动提示 -->
      <div class="scroll-indicator">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- 功能卡片区域 -->
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">核心功能</h2>
          <p class="section-subtitle">创新学习模式，让经典文学更有魅力</p>
        </div>
        
        <div class="features-grid">
          <div 
            v-for="(card, index) in featureCards" 
            :key="index" 
            class="feature-card"
            @click="navigateTo(card.route)"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="card-gradient" :style="{ background: card.gradient }"></div>
            <div class="card-content">
              <div class="card-icon">{{ card.icon }}</div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-description">{{ card.description }}</p>
              <div class="card-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 数据统计区域 -->
    <section class="charts-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">数据统计</h2>
          <p class="section-subtitle">一览诗词典藏全貌</p>
        </div>
        
        <div class="charts-grid">
          <div class="chart-card">
            <v-chart class="chart" :option="barChartOption" autoresize />
          </div>
          <div class="chart-card">
            <v-chart class="chart" :option="pieChartOption" autoresize />
          </div>
        </div>
      </div>
    </section>

    <!-- 热门推荐区域 -->
    <section class="hot-poems-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">精品推荐</h2>
          <p class="section-subtitle">精选文学经典，品读千古名篇</p>
        </div>
        
        <div class="poems-grid" v-loading="poemsLoading">
          <Poetryitem
            v-for="item in hotPoems"
            :key="item.id"
            v-bind="{
              ...item,
              id: String(item.id),
              islike: item.islike === true || item.islike === 'true',
            }"
            @click="goPoetClassDetail(item.id)"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.modern-home {
  width: 100%;
  min-height: 100vh;
  background: #F8F9FA;
}

// Hero 区域
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    
    .particles-bg {
      position: absolute;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(237, 100, 166, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(72, 187, 120, 0.15) 0%, transparent 50%);
      animation: particlesFloat 15s ease-in-out infinite;
    }
    
    .gradient-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      opacity: 0.05;
    }
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    padding: 0 40px;
    text-align: center;
    
    .hero-text {
      .hero-title {
        margin: 0 0 30px 0;
        
        .title-line {
          display: block;
          font-size: 56px;
          font-weight: 800;
          background: linear-gradient(135deg, #2C3E50 0%, #667eea 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.3;
          animation: titleFadeIn 1s ease-out forwards;
          opacity: 0;
          
          &:nth-child(2) {
            animation-delay: 0.3s;
          }
        }
      }
      
      .hero-subtitle {
        font-size: 22px;
        color: #7F8C8D;
        margin: 0 0 60px 0;
        line-height: 1.6;
        animation: subtitleFadeIn 1s ease-out 0.6s forwards;
        opacity: 0;
      }
      
      .stats-cards {
        display: flex;
        gap: 30px;
        justify-content: center;
        flex-wrap: wrap;
        
        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 30px 40px;
          display: flex;
          align-items: center;
          gap: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: cardFadeIn 0.6s ease-out forwards;
          opacity: 0;
          
          &:nth-child(1) { animation-delay: 0.9s; }
          &:nth-child(2) { animation-delay: 1.1s; }
          &:nth-child(3) { animation-delay: 1.3s; }
          
          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 50px rgba(102, 126, 234, 0.2);
          }
          
          .stat-icon {
            font-size: 48px;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
          }
          
          .stat-info {
            text-align: left;
            
            .stat-number {
              font-size: 32px;
              font-weight: 700;
              color: #2C3E50;
              line-height: 1.2;
            }
            
            .stat-label {
              font-size: 14px;
              color: #7F8C8D;
              margin-top: 4px;
            }
          }
        }
      }
    }
  }
  
  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    animation: bounce 2s infinite;
    
    .scroll-arrow {
      width: 30px;
      height: 50px;
      border: 2px solid #7F8C8D;
      border-radius: 15px;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 6px;
        height: 6px;
        background: #7F8C8D;
        border-radius: 50%;
        animation: scrollDot 2s infinite;
      }
    }
  }
}

// 功能卡片区域
.features-section {
  padding: 100px 0;
  background: white;
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 30px;
    margin-top: 60px;
    
    .feature-card {
      position: relative;
      background: white;
      border-radius: 24px;
      padding: 40px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: cardSlideUp 0.6s ease-out forwards;
      opacity: 0;
      
      .card-gradient {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      
      .card-content {
        position: relative;
        z-index: 1;
        
        .card-icon {
          font-size: 64px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
          transition: transform 0.4s ease;
        }
        
        .card-title {
          font-size: 24px;
          font-weight: 700;
          color: #2C3E50;
          margin: 0 0 12px 0;
          transition: color 0.4s ease;
        }
        
        .card-description {
          font-size: 15px;
          color: #7F8C8D;
          line-height: 1.6;
          margin: 0;
          transition: color 0.4s ease;
        }
        
        .card-arrow {
          position: absolute;
          right: 0;
          bottom: 0;
          font-size: 32px;
          color: #2C3E50;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.4s ease;
        }
      }
      
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        
        .card-gradient {
          opacity: 1;
        }
        
        .card-content {
          .card-icon {
            transform: scale(1.1) rotate(5deg);
          }
          
          .card-title,
          .card-description {
            color: white;
          }
          
          .card-arrow {
            opacity: 1;
            transform: translateX(0);
            color: white;
          }
        }
      }
    }
  }
}

// 数据统计区域
.charts-section {
  padding: 100px 0;
  background: #F8F9FA;
  
  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 40px;
    margin-top: 60px;
    
    .chart-card {
      background: white;
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
      }
      
      .chart {
        width: 100%;
        height: 450px;
      }
    }
  }
}

// 热门推荐区域
.hot-poems-section {
  padding: 100px 0;
  background: white;
  
  .poems-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
    margin-top: 60px;
    min-height: 200px;
  }
}

// 通用样式
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.section-header {
  text-align: center;
  margin-bottom: 20px;
  
  .section-title {
    font-size: 42px;
    font-weight: 800;
    color: #2C3E50;
    margin: 0 0 16px 0;
  }
  
  .section-subtitle {
    font-size: 18px;
    color: #7F8C8D;
    margin: 0;
  }
}

// 动画
@keyframes titleFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes subtitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardSlideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes particlesFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-30px) rotate(120deg);
  }
  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

@keyframes scrollDot {
  0% {
    opacity: 0;
    top: 8px;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    top: 30px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-section {
    .hero-content {
      padding: 0 20px;
      
      .hero-text {
        .hero-title .title-line {
          font-size: 36px;
        }
        
        .hero-subtitle {
          font-size: 16px;
        }
        
        .stats-cards {
          flex-direction: column;
          gap: 20px;
          
          .stat-card {
            width: 100%;
          }
        }
      }
    }
  }
  
  .features-grid {
    grid-template-columns: 1fr !important;
  }
  
  .charts-grid {
    grid-template-columns: 1fr !important;
  }
  
  .poems-grid {
    grid-template-columns: 1fr !important;
    gap: 16px;
  }
  
  .section-container {
    padding: 0 20px;
  }
  
  .section-header .section-title {
    font-size: 32px;
  }
}

// 平板端
@media (min-width: 769px) and (max-width: 1024px) {
  .poems-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
  }
}
</style>