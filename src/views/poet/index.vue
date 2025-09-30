<script setup>
import { ref} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as ROUTERS from '@/constants/router.js'
import Search from '@/components/poet/search/index.vue'

const route = useRoute()
const router = useRouter()

// 根据当前路由设置默认激活标签
const getDefaultActive = (path) => {
  if (path.includes(ROUTERS.POET_WRITER)) return ROUTERS.POET_WRITER
  if (path.includes(ROUTERS.POET_SENTENCE)) return ROUTERS.POET_SENTENCE
  return ROUTERS.POET
}

const activeTab = ref(getDefaultActive(route.path))

// 标签配置
const tabs = [
  { name: ROUTERS.POET, label: '古诗词', icon: '📜' },
  { name: ROUTERS.POET_WRITER, label: '诗人作家', icon: '✍️' },
  { name: ROUTERS.POET_SENTENCE, label: '经典名句', icon: '💎' }
]

// 处理标签切换
const handleTabClick = (tab) => {
  activeTab.value = tab.name
  router.push(tab.name)
}

// 监听路由变化
import { watch } from 'vue'
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = getDefaultActive(newPath)
  }
)
</script>

<template>
  <div class="poet-modern-container">
    <!-- 顶部Banner区域 -->
    <section class="poet-hero">
      <div class="hero-background">
        <div class="gradient-overlay"></div>
      </div>
      <div class="hero-content">
        <div class="hero-icon">📚</div>
        <h1 class="hero-title">诗词书阁</h1>
        <p class="hero-subtitle">品读千古诗词，领略文化之美</p>
      </div>
    </section>

    <!-- 主内容区 -->
    <div class="poet-main">
      <div class="poet-container">
        <!-- 顶部标签导航 -->
        <nav class="poet-tabs">
          <div 
            v-for="tab in tabs" 
            :key="tab.name"
            class="tab-item"
            :class="{ 'active': activeTab === tab.name }"
            @click="handleTabClick(tab)"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-label">{{ tab.label }}</span>
            <div class="tab-indicator"></div>
          </div>
        </nav>

        <!-- 搜索框 -->
        <div class="search-section">
          <Search />
        </div>

        <!-- 内容区域 -->
        <div class="content-section">
          <router-view v-slot="{ Component }">
            <transition name="fade-slide" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.poet-modern-container {
  width: 100%;
  min-height: 100vh;
  background: #F8F9FA;
}

// Hero区域
.poet-hero {
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  
  .hero-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    .gradient-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
      animation: gradientMove 10s ease-in-out infinite;
    }
  }
  
  .hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
    color: white;
    
    .hero-icon {
      font-size: 64px;
      margin-bottom: 16px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
      animation: float 3s ease-in-out infinite;
    }
    
    .hero-title {
      font-size: 48px;
      font-weight: 800;
      margin: 0 0 12px 0;
      letter-spacing: 2px;
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
    
    .hero-subtitle {
      font-size: 18px;
      margin: 0;
      opacity: 0.95;
      font-weight: 400;
    }
  }
}

// 主内容区
.poet-main {
  margin-top: -60px;
  position: relative;
  z-index: 2;
  
  .poet-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }
}

// 标签导航
.poet-tabs {
  display: flex;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
  
  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px 24px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    background: transparent;
    
    .tab-icon {
      font-size: 24px;
      transition: transform 0.3s ease;
    }
    
    .tab-label {
      font-size: 16px;
      font-weight: 500;
      color: #7F8C8D;
      transition: color 0.3s ease;
    }
    
    .tab-indicator {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 60%;
      height: 3px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px 3px 0 0;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      background: rgba(102, 126, 234, 0.05);
      
      .tab-icon {
        transform: scale(1.1) rotate(5deg);
      }
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      
      .tab-label {
        color: #667eea;
        font-weight: 600;
      }
      
      .tab-indicator {
        transform: translateX(-50%) scaleX(1);
      }
    }
  }
}

// 搜索区域
.search-section {
  background: white;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

// 内容区域
.content-section {
  background: white;
  min-height: 500px;
  padding: 32px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

// 动画
@keyframes gradientMove {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

// 过渡动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// 响应式
@media (max-width: 768px) {
  .poet-hero {
    height: 220px;
    
    .hero-content {
      .hero-icon {
        font-size: 48px;
      }
      
      .hero-title {
        font-size: 32px;
      }
      
      .hero-subtitle {
        font-size: 14px;
      }
    }
  }
  
  .poet-main {
    margin-top: -40px;
    
    .poet-container {
      padding: 0 20px;
    }
  }
  
  .poet-tabs {
    .tab-item {
      flex-direction: column;
      gap: 4px;
      padding: 12px 16px;
      
      .tab-icon {
        font-size: 20px;
      }
      
      .tab-label {
        font-size: 12px;
      }
    }
  }
  
  .search-section,
  .content-section {
    padding: 16px;
  }
}
</style>