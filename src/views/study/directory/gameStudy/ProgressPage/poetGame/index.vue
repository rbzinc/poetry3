<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { goDictionary, goDictionaryFillPoemGame } from '@/router/helpers.js'
import { userGameStore } from '@/stores/modules/game.js'
import { ArrowLeftBold, Timer, QuestionFilled } from '@element-plus/icons-vue'

const gameStore = userGameStore()

// 游戏状态
const score = ref(0)
const timeLeft = ref(60)
const isTimerRunning = ref(false)
const button = ref('确认答案')
const message = ref('请输入下一句')
const dialogFormVisible = ref(false)
const showHint = ref(false)
const currentHint = ref('')

// 诗词数据
const poems = [
  {
    question: '土地平旷',
    answer: '屋舍俨然',
    hint: '描写建筑整齐排列的景象',
    source: '桃花源记',
    author: '陶渊明',
  },
  {
    question: '阡陌交通',
    answer: '鸡犬相闻',
    hint: '描写村落里的生活气息',
    source: '桃花源记',
    author: '陶渊明',
  },
  // ... 其他诗句
]

const current = ref(0)
const question = computed(() => poems[current.value].question)
const answer = ref('')
const correctAnswer = computed(() => poems[current.value].answer)

// 计时器
let timer = null
const startTimer = () => {
  isTimerRunning.value = true
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      endGame()
    }
  }, 1000)
}

const endGame = () => {
  clearInterval(timer)
  isTimerRunning.value = false
  dialogFormVisible.value = true
  gameStore.updateGameScore('matchPoem', score.value)
}

// 显示提示
const showHintMessage = () => {
  currentHint.value = poems[current.value].hint
  showHint.value = true
}

// 检查答案
const checkAnswer = () => {
  if (!isTimerRunning.value) {
    startTimer()
  }

  if (answer.value === '') {
    ElMessage.warning('答案不能为空')
    return
  }

  if (answer.value === correctAnswer.value) {
    score.value += timeLeft.value > 30 ? 2 : 1 // 根据剩余时间给分
    ElMessage({
      message: '回答正确！',
      type: 'success',
    })
  } else {
    ElMessage({
      message: `正确答案是：${correctAnswer.value}`,
      type: 'error',
    })
  }

  // 更新题目
  if (current.value < poems.length - 1) {
    current.value++
    answer.value = ''
    showHint.value = false
  } else {
    endGame()
  }
}

// 重新开始游戏
const restartGame = () => {
  score.value = 0
  timeLeft.value = 60
  current.value = 0
  answer.value = ''
  showHint.value = false
  dialogFormVisible.value = false
  isTimerRunning.value = false
  clearInterval(timer)
}

onMounted(() => {
  restartGame()
})
</script>

<template>
  <div class="game-page">
    <!-- 游戏头部 -->
    <div class="game-header">
      <el-button class="back-button" @click="goDictionary()" circle>
        <el-icon><ArrowLeftBold /></el-icon>
      </el-button>

      <div class="game-stats">
        <div class="stat-item timer-stat">
          <div class="stat-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">剩余时间</div>
            <div class="stat-value">{{ timeLeft }}s</div>
          </div>
        </div>

        <div class="stat-item score-stat">
          <div class="stat-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">当前得分</div>
            <div class="stat-value">{{ score }}</div>
          </div>
        </div>

        <div class="stat-item progress-stat">
          <div class="stat-icon">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">题目进度</div>
            <div class="stat-value">{{ current }}/{{ poems.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏区域 -->
    <div class="game-content">
      <div class="game-card">
        <!-- 诗词信息 -->
        <div class="poem-info-section">
          <div class="poem-badge">诗词接龙</div>
          <h2 class="poem-title">{{ poems[current].source }}</h2>
          <p class="poem-author">—— {{ poems[current].author }}</p>
        </div>

        <!-- 问题区域 -->
        <div class="question-section">
          <div class="question-card">
            <div class="question-label">上句</div>
            <div class="question-text">{{ question }}</div>
          </div>

          <div class="arrow-divider">
            <el-icon><ArrowDown /></el-icon>
          </div>

          <div class="answer-card">
            <div class="answer-label">请接下句</div>
            <el-input
              v-model="answer"
              :placeholder="message"
              @keyup.enter="checkAnswer"
              size="large"
              class="answer-input"
              clearable
            >
              <template #suffix>
                <el-button
                  link
                  @click="showHintMessage"
                  class="hint-button"
                >
                  <el-icon><QuestionFilled /></el-icon>
                  提示
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- 提示卡片 -->
          <transition name="hint-fade">
            <div v-if="showHint" class="hint-card">
              <el-icon class="hint-icon"><Promotion /></el-icon>
              <span>{{ currentHint }}</span>
            </div>
          </transition>
        </div>

        <!-- 提交按钮 -->
        <el-button
          type="primary"
          @click="checkAnswer"
          class="submit-button"
          size="large"
        >
          <el-icon><Select /></el-icon>
          {{ button }}
        </el-button>

        <!-- 进度条 -->
        <div class="progress-section">
          <el-progress
            :percentage="(current / poems.length) * 100"
            :stroke-width="12"
            :show-text="false"
            color="#667eea"
          />
          <div class="progress-text">已完成 {{ current }} / {{ poems.length }} 题</div>
        </div>
      </div>
    </div>

    <!-- 结束对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      width="500px"
      :close-on-click-modal="false"
      class="result-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <el-icon class="trophy-icon"><Trophy /></el-icon>
        </div>
      </template>

      <div class="result-content">
        <h2 class="result-title">游戏结束！</h2>
        <div class="result-score">
          <div class="score-circle">
            <div class="score-number">{{ score }}</div>
            <div class="score-label">分</div>
          </div>
        </div>
        <div class="result-stats">
          <div class="result-stat-item">
            <el-icon><Select /></el-icon>
            <span>答对 {{ current }} 题</span>
          </div>
          <div class="result-stat-item">
            <el-icon><Timer /></el-icon>
            <span>用时 {{ 60 - timeLeft }} 秒</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="restartGame" size="large" class="restart-btn">
            <el-icon><RefreshLeft /></el-icon>
            重新开始
          </el-button>
          <el-button type="primary" @click="goDictionaryFillPoemGame" size="large" class="next-btn">
            <el-icon><DArrowRight /></el-icon>
            下一关
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  position: relative;
  overflow: hidden;

  // 背景装饰
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  &::before {
    top: -15%;
    right: -5%;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  }

  &::after {
    bottom: -20%;
    left: -5%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  }

  .game-header {
    display: flex;
    align-items: center;
    gap: 24px;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;

    .back-button {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.98);
      border: none;
      color: #667eea;
      font-size: 24px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(-4px) scale(1.1);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        background: white;
      }
    }

    .game-stats {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;

      .stat-item {
        background: rgba(255, 255, 255, 0.98);
        border-radius: 16px;
        padding: 20px 24px;
        display: flex;
        align-items: center;
        gap: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        border: 2px solid transparent;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: white;
        }

        &.timer-stat .stat-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.score-stat .stat-icon {
          background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
        }

        &.progress-stat .stat-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-content {
          .stat-label {
            font-size: 12px;
            color: #7f8c8d;
            font-weight: 600;
            margin-bottom: 4px;
            letter-spacing: 0.5px;
          }

          .stat-value {
            font-size: 24px;
            font-weight: 800;
            color: #2c3e50;
            line-height: 1;
          }
        }
      }
    }
  }

  .game-content {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 1;

    .game-card {
      width: 100%;
      max-width: 800px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 32px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.5);

      .poem-info-section {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 2px solid rgba(102, 126, 234, 0.1);

        .poem-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 16px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .poem-title {
          font-size: 32px;
          font-weight: 800;
          color: #2c3e50;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .poem-author {
          font-size: 16px;
          color: #7f8c8d;
          font-style: italic;
          margin: 0;
        }
      }

      .question-section {
        margin-bottom: 36px;

        .question-card,
        .answer-card {
          background: rgba(102, 126, 234, 0.05);
          border-radius: 20px;
          padding: 24px 28px;
          margin-bottom: 20px;
          border: 2px solid rgba(102, 126, 234, 0.1);
          transition: all 0.3s ease;

          &:hover {
            background: rgba(102, 126, 234, 0.08);
            border-color: rgba(102, 126, 234, 0.2);
          }
        }

        .question-card {
          .question-label {
            font-size: 13px;
            color: #7f8c8d;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .question-text {
            font-size: 26px;
            font-weight: 700;
            color: #2c3e50;
            line-height: 1.5;
          }
        }

        .arrow-divider {
          text-align: center;
          margin: -10px 0;
          position: relative;
          z-index: 1;

          .el-icon {
            font-size: 32px;
            color: #667eea;
            background: white;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
          }
        }

        .answer-card {
          .answer-label {
            font-size: 13px;
            color: #7f8c8d;
            font-weight: 600;
            margin-bottom: 12px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          :deep(.answer-input) {
            .el-input__wrapper {
              background: white;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              padding: 12px 16px;
              border: 2px solid transparent;
              transition: all 0.3s ease;

              &:hover {
                border-color: rgba(102, 126, 234, 0.3);
              }

              &.is-focus {
                border-color: #667eea;
                box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
              }

              input {
                font-size: 20px;
                font-weight: 600;
                color: #2c3e50;
              }
            }

            .hint-button {
              color: #667eea;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 0 12px;

              &:hover {
                color: #764ba2;
              }
            }
          }
        }

        .hint-card {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: #f57c00;
          font-size: 15px;
          font-weight: 600;

          .hint-icon {
            font-size: 24px;
          }
        }
      }

      .submit-button {
        width: 100%;
        height: 56px;
        border-radius: 16px;
        font-size: 18px;
        font-weight: 700;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        margin-bottom: 32px;
        transition: all 0.3s ease;
        letter-spacing: 1px;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }

        &:active {
          transform: translateY(-2px);
        }
      }

      .progress-section {
        .el-progress {
          margin-bottom: 12px;

          :deep(.el-progress-bar__outer) {
            background: rgba(102, 126, 234, 0.1);
            border-radius: 10px;
          }

          :deep(.el-progress-bar__inner) {
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
          }
        }

        .progress-text {
          text-align: center;
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 600;
        }
      }
    }
  }
}

// 提示动画
.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: all 0.3s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 结果对话框
:deep(.result-dialog) {
  border-radius: 32px;
  overflow: hidden;

  .el-dialog__header {
    padding: 0;
    margin: 0;

    .dialog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      text-align: center;

      .trophy-icon {
        font-size: 80px;
        color: white;
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
        animation: trophy-bounce 0.6s ease;
      }
    }
  }

  .el-dialog__body {
    padding: 48px 40px 32px;
  }

  .result-content {
    text-align: center;

    .result-title {
      font-size: 32px;
      font-weight: 800;
      color: #2c3e50;
      margin: 0 0 32px 0;
    }

    .result-score {
      margin-bottom: 32px;

      .score-circle {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 160px;
        height: 160px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50%;
        box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
        animation: score-pulse 0.6s ease;

        .score-number {
          font-size: 56px;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .score-label {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          margin-top: 8px;
        }
      }
    }

    .result-stats {
      display: flex;
      justify-content: center;
      gap: 32px;

      .result-stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        color: #7f8c8d;
        font-weight: 600;

        .el-icon {
          font-size: 20px;
          color: #667eea;
        }
      }
    }
  }

  .el-dialog__footer {
    padding: 24px 40px 40px;

    .dialog-footer {
      display: flex;
      gap: 16px;

      .el-button {
        flex: 1;
        height: 52px;
        border-radius: 14px;
        font-weight: 700;
        font-size: 16px;
        transition: all 0.3s ease;

        &.restart-btn {
          background: white;
          border: 2px solid #e0e0e0;
          color: #7f8c8d;

          &:hover {
            border-color: #667eea;
            color: #667eea;
            background: rgba(102, 126, 234, 0.05);
          }
        }

        &.next-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          }
        }
      }
    }
  }
}

@keyframes trophy-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes score-pulse {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 响应式
@media (max-width: 1024px) {
  .game-page {
    .game-header .game-stats {
      grid-template-columns: 1fr;
      gap: 12px;

      .stat-item {
        padding: 16px 20px;
      }
    }
  }
}

@media (max-width: 768px) {
  .game-page {
    padding: 20px;

    .game-header {
      flex-direction: column;
      align-items: stretch;
    }

    .game-content .game-card {
      padding: 32px 24px;

      .poem-info-section .poem-title {
        font-size: 24px;
      }

      .question-section {
        .question-card .question-text,
        .answer-card :deep(.answer-input input) {
          font-size: 18px;
        }
      }
    }
  }
}
</style>
