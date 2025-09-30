<script setup>
import { User, Search, Bell, Setting } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/index.js'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'

const useUser = useUserInfoStore()
const route = useRoute()
const router = useRouter()
const activeIndex = ref(ROUTES.HOME)
const searchQuery = ref('')
const isScrolled = ref(false)
const showMobileMenu = ref(false)

// 监听路由变化，更新激活菜单
onMounted(() => {
  activeIndex.value = route.path
  
  // 监听页面滚动
  window.addEventListener('scroll', handleScroll)
})

watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = newPath
  }
)

// 处理滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

// 退出登录
const logout = () => {
  useUser.clearUserInfo()
  router.push(ROUTES.LOGIN)
}

// 处理菜单点击事件
const handleSelect = (key) => {
  router.push(key)
  showMobileMenu.value = false
}

// 处理搜索
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索:', searchQuery.value)
    // TODO: 实现搜索功能
  }
}

// 用户简称
const userNickname = computed(() => {
  if (useUser.userInfo?.username) {
    return useUser.userInfo.username.slice(0, 2).toUpperCase()
  }
  return 'U'
})

// 导航菜单配置
const menuItems = [
  { index: ROUTES.HOME, label: '首页', icon: '🏠' },
  { index: ROUTES.POET, label: '书阁', icon: '📚' },
  { 
    index: ROUTES.STUDY, 
    label: '学习', 
    icon: '🎓',
    children: [
      { index: ROUTES.STUDY_AI, label: 'AI助学' },
      { index: ROUTES.DICTIONARY, label: '游戏助学' },
      { index: ROUTES.VR, label: 'VR助学' }
    ]
  },
  { index: ROUTES.FORUM, label: '论坛', icon: '💬' },
  { 
    index: ROUTES.TOURISM_DOMESTIC, 
    label: '诗意之旅', 
    icon: '🗺️',
    children: [
      { index: ROUTES.TOURISM_DOMESTIC, label: '景点概览' },
      { index: ROUTES.TOURISM_MAP, label: '诗途地图' }
    ]
  }
]
</script>

<template>
  <header class="modern-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- Logo 和品牌 -->
      <div class="header-brand" @click="handleSelect(ROUTES.HOME)">
        <div class="brand-icon">📖</div>
        <div class="brand-info">
          <h1 class="brand-title">古韵传习堂</h1>
          <p class="brand-slogan">诗词学习平台</p>
        </div>
      </div>

      <!-- 导航菜单 - 桌面端 -->
      <nav class="header-nav desktop-only">
        <template v-for="item in menuItems" :key="item.index">
          <!-- 普通菜单项 -->
          <div 
            v-if="!item.children" 
            class="nav-item"
            :class="{ 'active': activeIndex === item.index || activeIndex.startsWith(item.index) }"
            @click="handleSelect(item.index)"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </div>
          
          <!-- 下拉菜单 -->
          <el-dropdown 
            v-else 
            class="nav-dropdown"
            trigger="hover"
            @command="handleSelect"
          >
            <div 
              class="nav-item dropdown-trigger"
              :class="{ 'active': activeIndex.startsWith(item.index) }"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
              <span class="dropdown-arrow">▾</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="modern-dropdown">
                <el-dropdown-item 
                  v-for="child in item.children" 
                  :key="child.index"
                  :command="child.index"
                  :class="{ 'active': activeIndex === child.index }"
                >
                  {{ child.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </nav>

      <!-- 右侧功能区 -->
      <div class="header-actions">
        <!-- 搜索框 -->
        <div class="search-box desktop-only">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗词、作者..."
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon class="search-icon"><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- 通知图标 -->
        <div class="action-icon desktop-only" v-if="useUser.userInfo">
          <el-badge :value="3" class="notification-badge">
            <el-icon :size="20"><Bell /></el-icon>
          </el-badge>
        </div>

        <!-- 用户信息 -->
        <div class="user-section" v-if="useUser.userInfo">
          <el-dropdown trigger="hover" @command="handleSelect">
            <div class="user-avatar-wrapper">
              <div class="user-avatar">{{ userNickname }}</div>
              <span class="user-name desktop-only">{{ useUser.userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="modern-dropdown user-dropdown">
                <div class="dropdown-header">
                  <div class="user-avatar large">{{ userNickname }}</div>
                  <div class="user-info">
                    <div class="username">{{ useUser.userInfo.username }}</div>
                    <div class="user-email">{{ useUser.userInfo.email || '未设置邮箱' }}</div>
                  </div>
                </div>
                <el-dropdown-item divided :command="ROUTES.USER">
                  <el-icon><User /></el-icon>
                  <span>个人主页</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
                </el-dropdown-item>
                <el-dropdown-item divided @click="logout">
                  <span class="logout-text">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 未登录状态 -->
        <div class="login-btn" v-else @click="handleSelect(ROUTES.LOGIN)">
          <el-icon class="login-icon"><User /></el-icon>
          <span class="desktop-only">登录</span>
        </div>

        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-btn mobile-only" @click="showMobileMenu = !showMobileMenu">
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
          <span class="menu-bar"></span>
        </div>
      </div>
    </div>

    <!-- 移动端导航菜单 -->
    <transition name="slide-down">
      <div class="mobile-nav" v-show="showMobileMenu">
        <div class="mobile-search">
          <el-input
            v-model="searchQuery"
            placeholder="搜索诗词、作者..."
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="mobile-menu-items">
          <template v-for="item in menuItems" :key="item.index">
            <div 
              v-if="!item.children"
              class="mobile-menu-item"
              :class="{ 'active': activeIndex === item.index }"
              @click="handleSelect(item.index)"
            >
              <span class="item-icon">{{ item.icon }}</span>
              <span class="item-label">{{ item.label }}</span>
            </div>
            
            <div v-else class="mobile-menu-group">
              <div class="group-title">
                <span class="item-icon">{{ item.icon }}</span>
                <span class="item-label">{{ item.label }}</span>
              </div>
              <div class="group-children">
                <div 
                  v-for="child in item.children"
                  :key="child.index"
                  class="mobile-menu-item child"
                  :class="{ 'active': activeIndex === child.index }"
                  @click="handleSelect(child.index)"
                >
                  {{ child.label }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped lang="scss">
.modern-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.scrolled {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    
    .header-container {
      height: 70px;
      padding: 0 40px;
    }
    
    .brand-icon {
      width: 42px;
      height: 42px;
      font-size: 24px;
    }
  }
  
  .header-container {
    max-width: 1400px;
    margin: 0 auto;
    height: 80px;
    padding: 0 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
  }
}

// Logo 和品牌
.header-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 16px 8px 8px;
  border-radius: 16px;
  
  &:hover {
    background: rgba(102, 126, 234, 0.05);
    transform: translateX(4px);
    
    .brand-icon {
      transform: rotate(10deg) scale(1.1);
    }
  }
  
  .brand-icon {
    width: 48px;
    height: 48px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
  }
  
  .brand-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .brand-title {
      font-size: 22px;
      font-weight: 700;
      color: #2C3E50;
      margin: 0;
      line-height: 1.2;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #2C3E50 0%, #667eea 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .brand-slogan {
      font-size: 11px;
      color: #7F8C8D;
      margin: 0;
      line-height: 1;
      font-weight: 500;
    }
  }
}

// 导航菜单
.header-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  
  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    
    .nav-icon {
      font-size: 18px;
      transition: transform 0.3s ease;
    }
    
    .nav-label {
      font-size: 15px;
      font-weight: 500;
      color: #2C3E50;
      transition: color 0.3s ease;
    }
    
    .dropdown-arrow {
      font-size: 12px;
      color: #7F8C8D;
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      background: rgba(102, 126, 234, 0.08);
      
      .nav-icon {
        transform: scale(1.1);
      }
      
      .dropdown-arrow {
        transform: rotate(180deg);
      }
    }
    
    &.active {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      
      .nav-label {
        color: #667eea;
        font-weight: 600;
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 30px;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 3px 3px 0 0;
      }
    }
  }
  
  .nav-dropdown {
    .dropdown-trigger {
      &:hover {
        .dropdown-arrow {
          transform: rotate(180deg);
        }
      }
    }
  }
}

// 右侧功能区
.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  
  .search-box {
    .search-input {
      width: 260px;
      
      :deep(.el-input__wrapper) {
        background: #F8F9FA;
        border: 2px solid transparent;
        border-radius: 24px;
        padding: 8px 20px;
        box-shadow: none;
        transition: all 0.3s ease;
        
        &:hover {
          background: #ECF0F1;
        }
        
        &.is-focus {
          background: white;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
      }
      
      :deep(.el-input__inner) {
        color: #2C3E50;
        font-size: 14px;
        
        &::placeholder {
          color: #BDC3C7;
        }
      }
      
      .search-icon {
        color: #7F8C8D;
      }
    }
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #F8F9FA;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #7F8C8D;
    
    &:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
    }
    
    .notification-badge {
      :deep(.el-badge__content) {
        background: #E74C3C;
        border: 2px solid white;
      }
    }
  }
  
  .user-section {
    .user-avatar-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 6px 16px 6px 6px;
      border-radius: 24px;
      transition: all 0.3s ease;
      
      &:hover {
        background: #F8F9FA;
      }
      
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: 600;
        
        &.large {
          width: 50px;
          height: 50px;
          font-size: 18px;
        }
      }
      
      .user-name {
        font-size: 14px;
        font-weight: 500;
        color: #2C3E50;
      }
    }
  }
  
  .login-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 24px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }
    
    .login-icon {
      font-size: 18px;
    }
  }
}

// 下拉菜单样式
:deep(.modern-dropdown) {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  padding: 8px;
  margin-top: 8px;
  
  .el-dropdown-menu__item {
    padding: 12px 20px;
    border-radius: 8px;
    color: #2C3E50;
    font-size: 14px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    
    &:hover {
      background: rgba(102, 126, 234, 0.08);
      color: #667eea;
    }
    
    &.active {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      font-weight: 600;
    }
    
    .el-icon {
      font-size: 16px;
    }
  }
  
  &.user-dropdown {
    min-width: 240px;
    
    .dropdown-header {
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #ECF0F1;
      margin-bottom: 8px;
      
      .user-info {
        flex: 1;
        
        .username {
          font-size: 16px;
          font-weight: 600;
          color: #2C3E50;
          margin-bottom: 4px;
        }
        
        .user-email {
          font-size: 12px;
          color: #7F8C8D;
        }
      }
    }
    
    .logout-text {
      color: #E74C3C;
    }
  }
}

// 移动端菜单按钮
.mobile-menu-btn {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  
  .menu-bar {
    width: 24px;
    height: 3px;
    background: #2C3E50;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  &:hover .menu-bar {
    background: #667eea;
  }
}

// 移动端导航
.mobile-nav {
  background: white;
  border-top: 1px solid #ECF0F1;
  padding: 20px;
  
  .mobile-search {
    margin-bottom: 20px;
    
    :deep(.el-input__wrapper) {
      background: #F8F9FA;
      border-radius: 12px;
      padding: 10px 16px;
    }
  }
  
  .mobile-menu-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .mobile-menu-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      .item-icon {
        font-size: 20px;
      }
      
      .item-label {
        font-size: 15px;
        font-weight: 500;
        color: #2C3E50;
      }
      
      &:hover {
        background: #F8F9FA;
      }
      
      &.active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        
        .item-label {
          color: #667eea;
          font-weight: 600;
        }
      }
      
      &.child {
        padding-left: 50px;
        font-size: 14px;
      }
    }
    
    .mobile-menu-group {
      .group-title {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 16px;
        font-weight: 600;
        color: #2C3E50;
        
        .item-icon {
          font-size: 20px;
        }
      }
      
      .group-children {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
    }
  }
}

// 响应式
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .modern-header {
    .header-container {
      padding: 0 30px;
    }
    
    .header-nav {
      gap: 4px;
      
      .nav-item {
        padding: 10px 16px;
        
        .nav-label {
          font-size: 14px;
        }
      }
    }
    
    .search-box .search-input {
      width: 200px;
    }
  }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  
  .mobile-only {
    display: flex !important;
  }
  
  .modern-header {
    .header-container {
      height: 60px;
      padding: 0 20px;
    }
    
    &.scrolled .header-container {
      height: 60px;
    }
    
    .brand-icon {
      width: 40px !important;
      height: 40px !important;
      font-size: 22px !important;
    }
    
    .brand-info {
      .brand-title {
        font-size: 16px;
      }
      
      .brand-slogan {
        font-size: 10px;
      }
    }
  }
  
  .header-actions {
    gap: 12px;
  }
}

// 动画
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>