<script setup>
import Header from '@/Layout/Header/index.vue'
</script>

<template>
  <div class="app-container">
    <Header v-show="$route.path !== '/login'" />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F8F9FA;
  color: #2C3E50;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #F8F9FA;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #BDC3C7;
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #95A5A6;
}

/* Element Plus 组件样式优化 */
.el-button {
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.el-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.el-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

/* 输入框样式优化 */
.el-input__wrapper {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.el-input__wrapper:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.el-input__wrapper.is-focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 表格样式优化 */
.el-table {
  border-radius: 12px;
  overflow: hidden;
}

.el-table th {
  background: #F8F9FA;
  color: #2C3E50;
  font-weight: 600;
}

/* 对话框样式优化 */
.el-dialog {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.el-dialog__header {
  border-bottom: 1px solid #ECF0F1;
  padding: 24px 24px 20px;
}

.el-dialog__title {
  font-size: 20px;
  font-weight: 600;
  color: #2C3E50;
}

.el-dialog__body {
  padding: 24px;
}

/* 消息提示样式优化 */
.el-message {
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  border: none;
}

.el-message--success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.el-message--error {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.el-message--warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.el-message--info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

/* 标签样式优化 */
.el-tag {
  border-radius: 8px;
  border: none;
  font-weight: 500;
}

/* 徽章样式优化 */
.el-badge__content {
  border-radius: 10px;
  font-weight: 600;
}

/* 分页样式优化 */
.el-pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}

.el-pagination button,
.el-pager li {
  border-radius: 8px;
  border: none;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.el-pagination button:hover,
.el-pager li:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-pager li.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
</style>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #F8F9FA;
}

.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 80px);
}

/* 页面过渡动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .main-content {
    min-height: calc(100vh - 60px);
  }
}
</style>