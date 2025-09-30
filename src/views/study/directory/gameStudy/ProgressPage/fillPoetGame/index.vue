<script setup>
import { ref, computed, onMounted } from 'vue'
import { userGameStore } from '@/stores/modules/game.js'
import { ElMessage } from 'element-plus'
import { goDictionaryFillPoemGame, goDictionaryTextList } from '@/router/helpers.js'
import { ArrowLeftBold, Timer, QuestionFilled } from '@element-plus/icons-vue'

// 格式化问题文本，将括号部分高亮
const formatQuestion = (question) => {
  return question.replace(/（[^）]*）/g, '<span class="blank-highlight">$&</span>')
}

const gameStore = userGameStore()

// 游戏状态
const score = ref(0)
const timeLeft = ref(30)
const isTimerRunning = ref(false)
const active = ref(gameStore.poetstatus)
const dialogFormVisible = ref(false)
const showHint = ref(false)

// 诗词数据
const poems = [
  {
    question: '率妻子（ ）来此绝境',
    answer: '邑人',
    hint: '这里的"邑"指城邑，"邑人"即城里的人',
    source: '桃花源记',
    author: '陶渊明',
  },
  {
    question: '（ ）交通，鸡犬相闻',
    answer: '阡陌',
    hint: '"阡陌"指南北为阡，东西为陌的田间小路',
    source: '桃花源记',
    author: '陶渊明',
  },
  {
    question: '黄发（ ），并怡然自乐',
    answer: '垂髫',
    hint: '"垂髫"指儿童，因其头发下垂而得名',
    source: '桃花源记',
    author: '陶渊明',
  },
  {
    question: '便（ ）家，设酒杀鸡作食',
    answer: '要还',
    hint: '"要还"即要回去的意思',
    source: '桃花源记',
    author: '陶渊明',
  },
]

const current = ref(0)
const currentPoem = computed(() => poems[current.value])
const answer = ref('')
let timer = null

// 计时器
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
  gameStore.updateGameScore('fillPoem', score.value)
  active.value++
  gameStore.poetstatus = active.value
}

// 检查答案
const checkAnswer = () => {
  if (!isTimerRunning.value) {
    startTimer()
  }

  if (!answer.value) {
    ElMessage.warning('请输入答案')
    return
  }

  if (answer.value === currentPoem.value.answer) {
    score.value += timeLeft.value > 15 ? 2 : 1
    ElMessage({
      message: '回答正确！',
      type: 'success',
    })
  } else {
    ElMessage({
      message: `正确答案是：${currentPoem.value.answer}`,
      type: 'error',
      duration: 2000,
    })
  }

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
  timeLeft.value = 30
  current.value = 0
  answer.value = ''
  showHint.value = false
  isTimerRunning.value = false
  clearInterval(timer)
}

onMounted(() => {
  restartGame()
})
</script>

<template>
  <div class="fill-game-page">
    <!-- 游戏头部 -->
    <div class="game-header">
      <el-button class="back-button" @click="goDictionaryTextList" circle>
          <el-icon><ArrowLeftBold /></el-icon>
      </el-button>

      <div class="game-stats">
        <div class="stat-item timer-stat">
          <div class="stat-icon">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">倒计时</div>
            <div class="stat-value" :class="{ warning: timeLeft <= 10 }">{{ timeLeft }}s</div>
          </div>
        </div>

        <div class="stat-item score-stat">
          <div class="stat-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">得分</div>
            <div class="stat-value">{{ score }}</div>
          </div>
        </div>

        <div class="stat-item progress-stat">
          <div class="stat-icon">
            <el-icon><EditPen /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">题目</div>
            <div class="stat-value">{{ current + 1 }}/{{ poems.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 游戏内容 -->
    <div class="game-content">
      <div class="game-card">
        <!-- 游戏类型标识 -->
        <div class="game-type-badge">
          <el-icon><Edit /></el-icon>
          挖词填空
        </div>

        <!-- 诗词信息 -->
        <div class="poem-info">
          <h2 class="poem-title">{{ currentPoem.source }}</h2>
          <p class="poem-author">—— {{ currentPoem.author }}</p>
        </div>

        <!-- 题目区域 -->
        <div class="question-area">
          <div class="question-label">
            <el-icon><Document /></el-icon>
            请填入空缺的字词
          </div>

          <div class="question-display">
            <div class="question-text" v-html="formatQuestion(currentPoem.question)"></div>
          </div>

          <div class="answer-section">
            <el-input
              v-model="answer"
              placeholder="请输入你的答案..."
              @keyup.enter="checkAnswer"
              size="large"
              class="answer-input"
              clearable
            >
              <template #prefix>
                <el-icon><Edit /></el-icon>
              </template>
              <template #suffix>
                <el-button
                  link
                  @click="showHint = !showHint"
                  class="hint-toggle"
                >
                  <el-icon><QuestionFilled /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <!-- 提示区域 -->
          <transition name="hint-slide">
            <div v-if="showHint" class="hint-box">
              <div class="hint-header">
                <el-icon><Notification /></el-icon>
                <span>提示</span>
              </div>
              <div class="hint-content">{{ currentPoem.hint }}</div>
            </div>
          </transition>
        </div>

        <!-- 按钮区域 -->
        <div class="button-area">
          <el-button
            type="primary"
            @click="checkAnswer"
            class="submit-btn"
            size="large"
          >
            <el-icon><Select /></el-icon>
            {{ current === poems.length - 1 ? '完成游戏' : '提交答案' }}
          </el-button>
        </div>

        <!-- 进度区域 -->
        <div class="progress-area">
          <div class="progress-bar-wrapper">
            <el-progress
              :percentage="((current + 1) / poems.length) * 100"
              :stroke-width="10"
              :show-text="false"
              color="#667eea"
            />
          </div>
          <div class="progress-info">
            <span>题目进度</span>
            <span class="progress-fraction">{{ current + 1 }} / {{ poems.length }}</span>
          </div>
        </div>

        <!-- 关卡指示 -->
        <div class="level-steps">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step title="诗词接龙" />
            <el-step title="挖词填空" />
          </el-steps>
        </div>
      </div>
    </div>

    <!-- 结束对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      width="520px"
      :close-on-click-modal="false"
      class="finish-dialog"
      align-center
    >
      <template #header>
        <div class="dialog-header">
          <div class="success-icon">
            <el-icon><CircleCheck /></el-icon>
          </div>
        </div>
      </template>

      <div class="result-content">
        <h2 class="result-title">恒喜通关！</h2>
        
        <div class="score-display">
          <div class="score-item">
            <div class="score-number">{{ score }}</div>
            <div class="score-text">总分</div>
          </div>
        </div>

        <div class="result-details">
          <div class="detail-item">
            <el-icon><Select /></el-icon>
            <span>答对 <strong>{{ current }}</strong> 题</span>
          </div>
          <div class="detail-item">
            <el-icon><Timer /></el-icon>
            <span>剩余 <strong>{{ timeLeft }}</strong> 秒</span>
          </div>
          <div class="detail-item">
            <el-icon><Trophy /></el-icon>
            <span>关卡 <strong>{{ active }}/2</strong></span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="restartGame" size="large" class="retry-btn">
            <el-icon><RefreshLeft /></el-icon>
            重新挑战
          </el-button>
          <el-button type="primary" @click="goDictionaryFillPoemGame" size="large" class="next-btn">
            <el-icon><DArrowRight /></el-icon>
            {{ active < 2 ? '下一关' : '返回首页' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.fill-game-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  padding: 32px;
  position: relative;
  overflow: hidden;

  // 背景装饰
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    right: -5%;
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%;
    left: -8%;
    width: 650px;
    height: 650px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.09) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
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
      color: #4facfe;
      font-size: 24px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: translateX(-4px) scale(1.1);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
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
          }

          .stat-value {
            font-size: 24px;
            font-weight: 800;
            color: #2c3e50;

            &.warning {
              color: #f5576c;
              animation: blink 1s infinite;
            }
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
      max-width: 900px;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 32px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);

      .game-type-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        padding: 10px 24px;
        border-radius: 24px;
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 24px;
        box-shadow: 0 4px 16px rgba(79, 172, 254, 0.3);
        letter-spacing: 0.5px;
      }

      .poem-info {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 32px;
        border-bottom: 2px solid rgba(79, 172, 254, 0.1);

        .poem-title {
          font-size: 32px;
          font-weight: 800;
          color: #2c3e50;
          margin: 0 0 12px 0;
        }

        .poem-author {
          font-size: 16px;
          color: #7f8c8d;
          font-style: italic;
          margin: 0;
        }
      }

      .question-area {
        margin-bottom: 36px;

        .question-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: #4facfe;
          margin-bottom: 20px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .question-display {
          background: linear-gradient(135deg, rgba(79, 172, 254, 0.05), rgba(0, 242, 254, 0.05));
          border: 2px solid rgba(79, 172, 254, 0.2);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
        text-align: center;

          .question-text {
            font-size: 28px;
            font-weight: 700;
            color: #2c3e50;
            line-height: 1.6;

            :deep(.blank-highlight) {
              color: #4facfe;
              background: rgba(79, 172, 254, 0.1);
              padding: 4px 12px;
              border-radius: 8px;
              font-weight: 800;
              display: inline-block;
              margin: 0 4px;
            }
          }
        }

        .answer-section {
          margin-bottom: 20px;

          :deep(.answer-input) {
            .el-input__wrapper {
              background: white;
              border-radius: 16px;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
              padding: 16px 20px;
              border: 2px solid transparent;
              transition: all 0.3s ease;

              &:hover {
                border-color: rgba(79, 172, 254, 0.3);
              }

              &.is-focus {
                border-color: #4facfe;
                box-shadow: 0 0 0 4px rgba(79, 172, 254, 0.1);
              }

              .el-input__inner {
                font-size: 20px;
                font-weight: 600;
                color: #2c3e50;
              }

              .el-input__prefix {
                font-size: 20px;
                color: #4facfe;
              }
            }

            .hint-toggle {
              color: #4facfe;
              font-weight: 600;
              padding: 0 12px;
              font-size: 16px;

              &:hover {
                color: #00f2fe;
              }
            }
          }
        }

        .hint-box {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.1));
          border: 2px solid rgba(255, 193, 7, 0.3);
          border-radius: 16px;
          padding: 20px;
          margin-top: 16px;

          .hint-header {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #f57c00;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 12px;
            text-transform: uppercase;
          }

          .hint-content {
            color: #f57c00;
            font-size: 15px;
            font-weight: 600;
            line-height: 1.6;
          }
        }
      }

      .button-area {
        margin-bottom: 32px;

        .submit-btn {
          width: 100%;
          height: 56px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 32px rgba(79, 172, 254, 0.4);
          }
        }
      }

      .progress-area {
        margin-bottom: 32px;

        .progress-bar-wrapper {
          margin-bottom: 12px;

          :deep(.el-progress-bar__outer) {
            background: rgba(79, 172, 254, 0.1);
            border-radius: 10px;
          }

          :deep(.el-progress-bar__inner) {
            background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
            border-radius: 10px;
          }
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          color: #7f8c8d;
          font-weight: 600;

          .progress-fraction {
            color: #2c3e50;
            font-size: 16px;
          }
        }
      }

      .level-steps {
        :deep(.el-steps) {
          .el-step__title {
            font-weight: 600;
          }
        }
      }
    }
  }
}

// 动画
.hint-slide-enter-active,
.hint-slide-leave-active {
  transition: all 0.3s ease;
}

.hint-slide-enter-from,
.hint-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 结束对话框
:deep(.finish-dialog) {
  border-radius: 32px;
  overflow: hidden;

  .el-dialog__header {
    padding: 0;
    margin: 0;

    .dialog-header {
      background: linear-gradient(135deg, #06d6a0 0%, #0ab68b 100%);
      padding: 48px;
  text-align: center;

      .success-icon {
        font-size: 100px;
        color: white;
        animation: success-bounce 0.6s ease;
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

    .score-display {
      margin-bottom: 32px;

      .score-item {
        display: inline-block;
        position: relative;

        .score-number {
          font-size: 72px;
          font-weight: 800;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .score-text {
          font-size: 16px;
          color: #7f8c8d;
          font-weight: 600;
          margin-top: 8px;
        }
      }
    }

    .result-details {
      display: flex;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;

      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(79, 172, 254, 0.05);
        border-radius: 12px;
        font-size: 15px;
        color: #7f8c8d;

        .el-icon {
          font-size: 20px;
          color: #4facfe;
        }

        strong {
          color: #2c3e50;
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

        &.retry-btn {
          background: white;
          border: 2px solid #e0e0e0;
          color: #7f8c8d;

          &:hover {
            border-color: #4facfe;
            color: #4facfe;
          }
        }

        &.next-btn {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border: none;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(79, 172, 254, 0.4);
          }
        }
      }
    }
  }
}

@keyframes success-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
}

// 响应式
@media (max-width: 1024px) {
  .fill-game-page {
    .game-header .game-stats {
      grid-template-columns: 1fr;
    }
  }
}

@media (max-width: 768px) {
  .fill-game-page {
    padding: 20px;

    .game-header {
      flex-direction: column;
      align-items: stretch;
    }

    .game-content .game-card {
      padding: 32px 24px;

      .question-area .question-display .question-text {
        font-size: 20px;
      }
    }
  }
}
</style>
