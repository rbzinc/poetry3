<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch } from 'vue'
import * as ROUTERS from '@/router/constants.js'
const route = useRoute()
const router = useRouter()

// 根据当前路由设置默认激活菜单项
const getDefaultActive = (path) => {
  if (path.includes(ROUTERS.POET_WRITER)) return ROUTERS.POET_WRITER
  if (path.includes(ROUTERS.POET_SENTENCE)) return ROUTERS.POET_SENTENCE
  return ROUTERS.POET
}

const activeIndex = ref(getDefaultActive(route.path))

// 监听路由变化，更新激活菜单项
watch(
  () => route.path,
  (newPath) => {
    activeIndex.value = getDefaultActive(newPath)
  },
)

// 处理菜单点击
const handleSelect = (key) => {
  router.push(key)
}
</script>

<template>
  <div class="banner-container">
    <!-- 其余部分保持不变 -->
    <div class="banner-header">
      <h2>诗词书阁</h2>
      <div class="divider"></div>
    </div>

    <el-menu :default-active="activeIndex" class="banner-menu" @select="handleSelect" :router="true">
      <el-menu-item :index="ROUTERS.POET" class="nav-item">
        <i class="nav-icon poem-icon"></i>
        <span>古诗词</span>
      </el-menu-item>

      <el-menu-item :index="ROUTERS.POET_WRITER" class="nav-item">
        <i class="nav-icon writer-icon"></i>
        <span>诗人作家</span>
      </el-menu-item>

      <el-menu-item :index="ROUTERS.POET_SENTENCE" class="nav-item">
        <i class="nav-icon sentence-icon"></i>
        <span>经典名句</span>
      </el-menu-item>
    </el-menu>

    <!-- 其余部分保持不变 -->
    <div class="banner-image">
      <img src="@/assets/pic/banner/banner.jpg" alt="书阁装饰图" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.banner-container {
  width: 230px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;

  .banner-header {
    padding: 20px 15px;
    text-align: center;

    h2 {
      font-size: 22px;
      color: #333;
      margin: 0;
      font-weight: 600;
      letter-spacing: 2px;
    }

    .divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #d1d1d1, transparent);
      margin: 15px auto 5px;
      width: 80%;
    }
  }

  // 自定义 el-menu 样式
  .banner-menu {
    border-right: none;
    background-color: transparent;

    :deep(.el-menu-item) {
      display: flex;
      align-items: center;
      padding: 16px 20px;
      height: auto;
      line-height: normal;
      color: #666;
      font-size: 16px;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        background-color: #f5f5f5;
        color: #333;
        border-left: 4px solid #a0a0a0;
      }

      &.is-active {
        background-color: #f0f0f0;
        color: #333;
        border-left: 4px solid #666;
        font-weight: 500;
      }

      .nav-icon {
        width: 24px;
        height: 24px;
        margin-right: 12px;
        opacity: 0.7;
      }

      // 可以使用伪元素添加图标，或者使用实际图标
      .poem-icon::before {
        content: '📜';
      }

      .writer-icon::before {
        content: '✍️';
      }

      .sentence-icon::before {
        content: '💬';
      }
    }
  }

  .banner-image {
    margin-top: auto;

    img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
  }
}
</style>
