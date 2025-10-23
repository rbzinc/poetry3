<script setup>
import { User, Search, Bell, Setting, ChatDotRound, Star, Message, WarningFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/index.js'
import { ref, watch, onMounted, computed, markRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as ROUTES from '@/constants/router.js'
import { ElMessage } from 'element-plus'

const useUser = useUserInfoStore()
const route = useRoute()
const router = useRouter()
const activeIndex = ref(ROUTES.HOME)
const searchQuery = ref('')
const isScrolled = ref(false)
const showMobileMenu = ref(false)

// 通知系统 - 假数据
const notifications = ref([
  {
    id: 1,
    type: 'like',
    icon: markRaw(Star),
    iconColor: '#FFC107',
    title: '新的点赞',
    content: '用户"诗词爱好者"赞了你的帖子《春江花月夜赏析》',
    time: '2分钟前',
    isRead: false
  },
  {
    id: 2,
    type: 'comment',
    icon: markRaw(ChatDotRound),
    iconColor: '#667eea',
    title: '新的评论',
    content: '用户"李白粉丝"评论了你的帖子：写得真好，受益匪浅！',
    time: '15分钟前',
    isRead: false
  },
  {
    id: 3,
    type: 'system',
    icon: markRaw(Bell),
    iconColor: '#E74C3C',
    title: '系统通知',
    content: '你的学习积分已达到1000分，获得"诗词学者"称号！',
    time: '1小时前',
    isRead: false
  },
  {
    id: 4,
    type: 'message',
    icon: markRaw(Message),
    iconColor: '#3498DB',
    title: '私信提醒',
    content: '用户"杜甫研究"向你发送了一条私信',
    time: '3小时前',
    isRead: true
  },
  {
    id: 5,
    type: 'system',
    icon: markRaw(WarningFilled),
    iconColor: '#F39C12',
    title: '学习提醒',
    content: '你已经3天没有完成每日诗词学习任务，继续加油！',
    time: '昨天',
    isRead: true
  },
  {
    id: 6,
    type: 'like',
    icon: markRaw(Star),
    iconColor: '#FFC107',
    title: '收藏提醒',
    content: '你收藏的诗词《将进酒》有新的赏析内容更新',
    time: '2天前',
    isRead: true
  }
])

// 计算未读通知数量
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length
})

// 标记单条通知为已读
const markAsRead = (notificationId) => {
  const notification = notifications.value.find(n => n.id === notificationId)
  if (notification) {
    notification.isRead = true
    ElMessage.success('已标记为已读')
  }
}

// 全部标记为已读
const markAllAsRead = () => {
  notifications.value.forEach(n => n.isRead = true)
  ElMessage.success('所有通知已标记为已读')
}

// 清空所有通知
const clearAllNotifications = () => {
  notifications.value = []
  ElMessage.success('已清空所有通知')
}

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
  { index: ROUTES.HOME, label: '主页', icon: '🏠' },
  { index: ROUTES.POET, label: '典藏', icon: '📜' },
  { 
    index: ROUTES.STUDY, 
    label: '学堂', 
    icon: '🎯',
    children: [
      { index: ROUTES.STUDY_AI, label: '智能对话' },
      { index: ROUTES.DICTIONARY, label: '互动闯关' },
      { index: ROUTES.VR, label: '沉浸体验' }
    ]
  },
  { index: ROUTES.FORUM, label: '社区', icon: '💭' },
  { 
    index: ROUTES.TOURISM_DOMESTIC, 
    label: '漫游', 
    icon: '🧭',
    children: [
      { index: ROUTES.TOURISM_DOMESTIC, label: '胜地探索' },
      { index: ROUTES.TOURISM_MAP, label: '文化地图' }
    ]
  }
]
</script>

<template>
  <header class="modern-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      <!-- Logo 和品牌 -->
      <div class="header-brand" @click="handleSelect(ROUTES.HOME)">
        <div class="brand-icon">🎐</div>
        <div class="brand-info">
          <h1 class="brand-title">墨韵书院</h1>
          <p class="brand-slogan">传承经典·启迪智慧</p>
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
        <el-dropdown v-if="useUser.userInfo" trigger="click" class="notification-dropdown desktop-only" placement="bottom-end">
          <div class="action-icon">
            <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="notification-badge">
              <el-icon :size="20"><Bell /></el-icon>
            </el-badge>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="notification-menu">
              <!-- 通知头部 -->
              <div class="notification-header">
                <div class="notification-title">
                  <el-icon :size="18"><Bell /></el-icon>
                  <span>通知中心</span>
                  <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="unread-badge" />
                </div>
                <div class="notification-actions">
                  <el-button link size="small" @click="markAllAsRead" v-if="unreadCount > 0">
                    全部已读
                  </el-button>
                </div>
              </div>
              
              <!-- 通知列表 -->
              <div class="notification-list" v-if="notifications.length > 0">
                <div 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  class="notification-item"
                  :class="{ 'unread': !notification.isRead }"
                  @click="markAsRead(notification.id)"
                >
                  <div class="notification-icon" :style="{ background: notification.iconColor + '15' }">
                    <el-icon :size="20" :style="{ color: notification.iconColor }">
                      <component :is="notification.icon" />
                    </el-icon>
                  </div>
                  <div class="notification-content">
                    <div class="notification-text">
                      <div class="notification-item-title">{{ notification.title }}</div>
                      <div class="notification-item-content">{{ notification.content }}</div>
                    </div>
                    <div class="notification-meta">
                      <span class="notification-time">{{ notification.time }}</span>
                      <div class="unread-dot" v-if="!notification.isRead"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <div class="notification-empty" v-else>
                <el-icon :size="48" class="empty-icon"><Bell /></el-icon>
                <p>暂无通知</p>
              </div>
              
              <!-- 底部操作 -->
              <div class="notification-footer" v-if="notifications.length > 0">
                <el-button link class="clear-btn" @click="clearAllNotifications">
                  清空所有通知
                </el-button>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 用户信息 -->
        <div class="user-section" v-if="useUser.userInfo">
          <el-dropdown trigger="hover" @command="handleSelect">
            <div class="user-avatar-wrapper">
              <div 
                class="user-avatar" 
                :class="{ 'has-image': useUser.userInfo.touxiang }"
                :style="useUser.userInfo.touxiang ? { backgroundImage: `url(${useUser.userInfo.touxiang})` } : {}"
              >
                <span v-if="!useUser.userInfo.touxiang">{{ userNickname }}</span>
              </div>
              <span class="user-name desktop-only">{{ useUser.userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu class="custom-user-dropdown">
                <div class="custom-dropdown-header">
                  <div 
                    class="custom-avatar" 
                    :class="{ 'has-image': useUser.userInfo.touxiang }"
                    :style="useUser.userInfo.touxiang ? { backgroundImage: `url(${useUser.userInfo.touxiang})` } : {}"
                  >
                    <span v-if="!useUser.userInfo.touxiang">{{ userNickname }}</span>
                  </div>
                  <div class="custom-user-info">
                    <div class="custom-username">{{ useUser.userInfo.username }}</div>
                    <div class="custom-email">{{ useUser.userInfo.email || '未设置邮箱' }}</div>
                  </div>
                </div>
                <div class="custom-menu-item" @click="handleSelect(ROUTES.USER)">
                  <el-icon><User /></el-icon>
                  <span>个人主页</span>
                </div>
                <div class="custom-menu-item" @click="handleSelect(ROUTES.USER)">
                  <el-icon><Setting /></el-icon>
                  <span>设置</span>
                </div>
                <div class="custom-divider"></div>
                <div class="custom-menu-item logout-item" @click="logout">
                  <span>👋 退出登录</span>
                </div>
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
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        
        &.has-image {
          background-blend-mode: normal;
          
          span {
            display: none;
          }
        }
        
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
  
  // 通知下拉菜单样式
  .notification-dropdown {
    .action-icon {
      position: relative;
    }
  }
}

// 通知菜单样式
.notification-menu {
  min-width: 400px !important;
  max-width: 400px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden !important;
  margin-top: 12px !important;
  
  .notification-header {
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%);
    border-bottom: 1px solid #ECF0F1;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    .notification-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #2C3E50;
      
      .el-icon {
        color: #667eea;
      }
      
      .unread-badge {
        margin-left: 4px;
        
        :deep(.el-badge__content) {
          background: #E74C3C;
          border: none;
          font-size: 11px;
          height: 18px;
          line-height: 18px;
          padding: 0 6px;
        }
      }
    }
    
    .notification-actions {
      :deep(.el-button) {
        color: #667eea;
        font-weight: 500;
        
        &:hover {
          color: #764ba2;
        }
      }
    }
  }
  
  .notification-list {
    max-height: 450px;
    overflow-y: auto;
    
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #F8F9FA;
    }
    
    &::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 3px;
    }
    
    .notification-item {
      display: flex;
      gap: 12px;
      padding: 16px 20px;
      border-bottom: 1px solid #F8F9FA;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      
      &:last-child {
        border-bottom: none;
      }
      
      &.unread {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.02) 100%);
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      }
      
      &:hover {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.03) 100%);
      }
      
      .notification-icon {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      
      .notification-content {
        flex: 1;
        min-width: 0;
        
        .notification-text {
          .notification-item-title {
            font-size: 14px;
            font-weight: 600;
            color: #2C3E50;
            margin-bottom: 4px;
          }
          
          .notification-item-content {
            font-size: 13px;
            color: #7F8C8D;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        
        .notification-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 8px;
          
          .notification-time {
            font-size: 12px;
            color: #BDC3C7;
          }
          
          .unread-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
            animation: pulse 2s ease-in-out infinite;
          }
        }
      }
    }
  }
  
  .notification-empty {
    padding: 60px 20px;
    text-align: center;
    
    .empty-icon {
      color: #BDC3C7;
      margin-bottom: 16px;
    }
    
    p {
      font-size: 14px;
      color: #7F8C8D;
      margin: 0;
    }
  }
  
  .notification-footer {
    padding: 12px 20px;
    text-align: center;
    border-top: 1px solid #ECF0F1;
    background: #F8F9FA;
    
    .clear-btn {
      color: #E74C3C;
      font-size: 13px;
      
      &:hover {
        color: #C0392B;
      }
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

// 自定义用户下拉菜单 - 完全自定义样式
.custom-user-dropdown {
  min-width: 280px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 16px !important;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden !important;
  margin-top: 12px !important;
  
  // 头部区域
  .custom-dropdown-header {
    padding: 24px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%);
    position: relative;
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    
    // 顶部渐变装饰条
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    }
    
    .custom-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
      border: 3px solid white;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      
      &.has-image {
        background-blend-mode: normal;
        
        span {
          display: none;
        }
      }
    }
    
    .custom-user-info {
      flex: 1;
      
      .custom-username {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 6px;
        background: linear-gradient(135deg, #2C3E50 0%, #667eea 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .custom-email {
        font-size: 13px;
        color: #7F8C8D;
        
        &::before {
          content: '📧 ';
        }
      }
    }
  }
  
  // 自定义菜单项
  .custom-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    margin: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    color: #2C3E50;
    font-size: 15px;
    font-weight: 500;
    background: transparent;
    
    .el-icon {
      font-size: 18px;
      transition: transform 0.3s ease;
    }
    
    // Hover效果 - 渐变背景
    &:hover {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%);
      color: #667eea;
      transform: translateX(6px);
      box-shadow: 0 2px 12px rgba(102, 126, 234, 0.12);
      
      .el-icon {
        transform: scale(1.15) rotate(5deg);
      }
    }
    
    // 退出登录特殊样式
    &.logout-item {
      color: #E74C3C;
      
      &:hover {
        background: linear-gradient(135deg, rgba(231, 76, 60, 0.12) 0%, rgba(231, 76, 60, 0.08) 100%);
        color: #C0392B;
        box-shadow: 0 2px 12px rgba(231, 76, 60, 0.12);
      }
    }
  }
  
  // 分隔线
  .custom-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #ECF0F1 50%, transparent 100%);
    margin: 8px 0;
  }
}

// 导航下拉菜单样式
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
    transition: all 0.3s ease;
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