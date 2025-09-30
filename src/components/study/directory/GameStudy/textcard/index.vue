<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { goDictionaryTextList } from '@/router/helpers.js'
import { BOOK_BG, BOOK_CONTAINER_BG } from '@/constants/bgUrl.js'

const router = useRouter()
const props = defineProps({
  title: String,
  content: String,
  icon: String,
  progress: Number,
  description: String,
  learned: Number,
  total: Number,
})
</script>

<template>
  <div class="modern-card" @click="goDictionaryTextList()">
    <div class="card-header">
      <div class="icon-wrapper">
        <span class="category-icon">{{ icon || '📚' }}</span>
      </div>
      <div class="progress-badge">{{ progress || 0 }}%</div>
    </div>

    <div class="card-body">
      <h3 class="card-title">{{ title }}</h3>
      <p class="card-description">{{ description || content }}</p>
    </div>

    <div class="card-footer">
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">已学习</span>
          <span class="stat-value">{{ learned || 0 }}</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-label">总计</span>
          <span class="stat-value">{{ total || 0 }}</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${progress || 0}%` }"></div>
      </div>
    </div>

    <div class="card-overlay">
      <div class="overlay-content">
        <el-icon class="play-icon"><CaretRight /></el-icon>
        <span class="overlay-text">开始学习</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modern-card {
  position: relative;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 24px;
  padding: 24px;
  height: 280px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-12px) scale(1.03);
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.25);

    &::before {
      opacity: 1;
    }

    .icon-wrapper {
      transform: scale(1.15) rotate(5deg);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
    }

    .card-overlay {
      opacity: 1;
      pointer-events: all;
    }

    .card-title {
      color: #667eea;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .icon-wrapper {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .category-icon {
        font-size: 36px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
    }

    .progress-badge {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      letter-spacing: 0.5px;
    }
  }

  .card-body {
    flex: 1;
    margin-bottom: 16px;

    .card-title {
      font-size: 22px;
      font-weight: 800;
      color: #2c3e50;
      margin: 0 0 12px 0;
      line-height: 1.3;
      transition: color 0.3s ease;
      letter-spacing: 0.3px;
    }

    .card-description {
      font-size: 14px;
      color: #7f8c8d;
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-footer {
    .stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 12px 16px;
      background: rgba(102, 126, 234, 0.05);
      border-radius: 12px;

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;

        .stat-label {
          font-size: 11px;
          color: #95a5a6;
          margin-bottom: 4px;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      .stat-divider {
        width: 1px;
        height: 32px;
        background: linear-gradient(180deg, transparent, rgba(102, 126, 234, 0.3), transparent);
      }
    }

    .progress-bar {
      height: 8px;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 10px;
      overflow: hidden;
      position: relative;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 10px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }
      }
    }
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 24px;

    .overlay-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      transform: translateY(20px);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);

      .play-icon {
        font-size: 56px;
        color: white;
        background: rgba(255, 255, 255, 0.2);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      }

      .overlay-text {
        color: white;
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
  }

  &:hover .overlay-content {
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
