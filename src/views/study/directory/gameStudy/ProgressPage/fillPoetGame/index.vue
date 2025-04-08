<script setup>
import { ref, computed, onMounted } from 'vue'
import { userGameStore } from '@/stores/modules/game.js'
import { ElMessage } from 'element-plus'
import { goDictionaryFillPoemGame, goDictionaryTextList } from '@/router/helpers.js'
import { ArrowLeftBold, Timer, QuestionFilled } from '@element-plus/icons-vue'

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
  <el-card class="game-card">
    <template #header>
      <div class="header">
        <div class="return" @click="goDictionaryTextList">
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

    <div class="game">
      <div class="inner">
        <div class="poetry-info">
          <h3>{{ currentPoem.source }}</h3>
          <p class="author">{{ currentPoem.author }}</p>
        </div>

        <div class="poetry-quiz">
          <div class="question">
            <div class="ask">{{ currentPoem.question }}</div>
            <div class="answer-input">
              <el-input v-model="answer" placeholder="请填写空缺的字词" @keyup.enter="checkAnswer" />
              <el-tooltip content="查看提示" placement="top">
                <el-button circle @click="showHint = !showHint">
                  <el-icon><QuestionFilled /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>

          <el-collapse-transition>
            <div v-if="showHint" class="hint">提示：{{ currentPoem.hint }}</div>
          </el-collapse-transition>

          <el-button type="primary" @click="checkAnswer">
            {{ current === poems.length - 1 ? '完成' : '下一题' }}
          </el-button>
        </div>

        <div class="progress">
          <el-progress :percentage="(current / poems.length) * 100" :format="() => `${current}/${poems.length}`" />
          <el-steps :active="active" finish-status="success" simple>
            <el-step title="古诗填句" />
            <el-step title="挖词填空" @click="goDictionaryFillPoemGame" />
          </el-steps>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="游戏结束" width="400px" :close-on-click-modal="false">
      <div class="result">
        <h2>最终得分：{{ score }}</h2>
        <p>答对题目：{{ current }} 题</p>
        <p>剩余时间：{{ timeLeft }} 秒</p>
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
  background-image: url('@/assets/pic/study/微信图片_20241201193836.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .return {
      cursor: pointer;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 5px;
      &:hover {
        color: #409eff;
      }
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

  .game {
    padding: 20px;

    .inner {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .poetry-info {
        text-align: center;
        margin-bottom: 30px;

        h3 {
          font-size: 24px;
          color: #333;
          margin: 0;
        }

        .author {
          color: #666;
          font-style: italic;
          margin: 10px 0 0;
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

        .hint {
          margin: 20px auto;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
          max-width: 500px;
          color: #666;
        }
      }

      .progress {
        margin-top: 40px;
        text-align: center;

        .el-progress {
          margin-bottom: 20px;
        }

        .el-steps {
          max-width: 400px;
          margin: 0 auto;
        }
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
