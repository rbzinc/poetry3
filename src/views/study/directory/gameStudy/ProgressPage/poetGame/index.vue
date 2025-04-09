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
  <el-card class="game-card">
    <template #header>
      <div class="header">
        <div class="return" @click="goDictionary()">
          <el-icon><ArrowLeftBold /></el-icon>
          返回
        </div>
        <div class="game-info">
          <div class="timer">
            <el-icon><Timer /></el-icon>
            剩余时间：{{ timeLeft }}秒
          </div>
          <div class="score">得分：{{ score }}</div>
        </div>
      </div>
    </template>

    <div class="game-container">
      <div class="inner">
        <div class="poetry-info">
          <h3>{{ poems[current].source }}</h3>
          <p class="author">{{ poems[current].author }}</p>
        </div>

        <div class="poetry-quiz">
          <div class="question">
            <div class="ask">{{ question }}</div>
            <div class="answer-input">
              <el-input v-model="answer" :placeholder="message" @keyup.enter="checkAnswer" />
              <el-tooltip content="查看提示" placement="top">
                <el-button circle @click="showHintMessage">
                  <el-icon><QuestionFilled /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <el-button type="primary" @click="checkAnswer">{{ button }}</el-button>
        </div>

        <el-collapse-transition>
          <div v-if="showHint" class="hint">提示：{{ currentHint }}</div>
        </el-collapse-transition>

        <div class="progress">
          <el-progress :percentage="(current / poems.length) * 100" :format="() => `${current}/${poems.length}`" />
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="游戏结束" width="400px" :close-on-click-modal="false">
      <div class="result">
        <h2>最终得分：{{ score }}</h2>
        <p>答对题目：{{ current }} 题</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="restartGame">重新开始</el-button>
          <el-button type="primary" @click="goDictionaryFillPoemGame"> 下一关 </el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss">
.game-card {
  height: 560px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .return {
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .game-info {
      display: flex;
      gap: 20px;
      font-size: 16px;

      .timer,
      .score {
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .game-container {
    width: 100%;
    height: 440px;
    margin: 10px auto;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner {
      width: 90%;
      height: 90%;
      padding: 20px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .poetry-info {
        text-align: center;
        margin-bottom: 20px;

        h3 {
          font-size: 24px;
          color: #333;
          margin: 0;
        }

        .author {
          color: #666;
          font-style: italic;
        }
      }

      .poetry-quiz {
        text-align: center;

        .question {
          margin-bottom: 30px;

          .ask {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2c3e50;
          }

          .answer-input {
            display: flex;
            justify-content: center;
            gap: 10px;

            .el-input {
              width: 300px;
            }
          }
        }
      }

      .hint {
        text-align: center;
        color: #666;
        margin: 20px 0;
        padding: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
      }

      .progress {
        margin-top: 30px;
      }
    }
  }
}

.result {
  text-align: center;

  h2 {
    color: #409eff;
    margin-bottom: 20px;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
}
</style>
