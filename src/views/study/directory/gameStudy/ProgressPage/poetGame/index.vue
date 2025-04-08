<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { goDictionaryFillPoemGame } from '@/router/helpers.js'
const router = useRouter()
let number = ref(0)
let score = ref(0)
const button = ref('下一题')
const message = ref('请输入下一句')
let dialogFormVisible = ref(false)
const poems = [
  { question: '土地平旷', answer: '屋舍俨然' },
  { question: '阡陌交通', answer: '鸡犬相闻' },
  { question: '黄发垂髫', answer: '并怡然自乐' },
  { question: '便要还家', answer: '设酒杀鸡作食' },
]
const current = ref(0)
const question = ref(poems[current.value].question)
let answer = ref('')
const correctAnswer = ref(poems[current.value].answer)
const active = ref(0)
//判断回答正误
const checkAnswer = () => {
  if (answer.value === correctAnswer.value) {
    score.value += 1
    ElMessage({
      message: '回答正确！',
      type: 'success',
    })
  } else {
    alert('错误！正确答案是：' + correctAnswer.value)
  }
}

const nextQuestion = () => {
  if (current.value < poems.length - 1) {
    if (answer.value === '') {
      message.value = '答案不能为空'
    } else {
      checkAnswer()
      current.value = (current.value + 1) % poems.length
      question.value = poems[current.value].question
      correctAnswer.value = poems[current.value].answer
      answer.value = ''
    }
  } else if (current.value === poems.length - 1) {
    checkAnswer()
    button.value = '查看分数'
    current.value += 1
  } else {
    dialogFormVisible.value = true
    active.value++
  }
}

const returnclick = () => {
  router.push('/dictionary')
}

const fillgameclick = () => {
  goDictionaryFillPoemGame()
}
</script>

<template>
  <el-card style="max-width: 100%; height: 560px" class="el-card">
    <template #header>
      <div class="return" @click="returnclick">
        <el-icon><ArrowLeftBold /></el-icon>
        返回
      </div>
    </template>
    <div class="game">
      <div class="inner">
        <div class="poetry-quiz">
          <div class="question">
            <div class="ask">{{ question }}</div>
            <el-input v-model="answer" style="width: 240px" :placeholder="message" />
          </div>
          <el-button @click="nextQuestion">{{ button }}</el-button>
        </div>
        <div class="progress-bar">
          <el-steps style="max-width: 600px" :space="180" :active="active" finish-status="success">
            <el-step title="古诗填句" />
            <el-step title="挖词填空" @click="fillgameclick" />
          </el-steps>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" title="以下是您的得分" width="800px">
      <p>{{ score }}</p>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped lang="scss">
.el-card {
  background-image: url('@/assets/pic/study/微信图片_20241201193836.jpg');
  background-size: cover; /* 覆盖整个元素 */
  background-position: center; /* 居中显示 */
  background-repeat: no-repeat; /* 不重复 */
}
.return {
  display: flex;
  cursor: pointer;
  font-size: 20px;
  font-family: 'Georgia', serif;
}
.game {
  width: 1060px;
  height: 440px;
  margin: 10px auto;
  box-sizing: border-box;
  border: rgba(171, 74, 3, 0.3) solid 7px;
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  .inner {
    width: 1000px;
    height: 380px;
    border: rgba(171, 74, 3, 0.3) solid 2px;
    border-radius: 20px;

    .poetry-quiz {
      text-align: center;
      .question {
        margin-bottom: 20px;
        .ask {
          margin-top: 40px;
          margin-bottom: 20px;
          font-size: 25px;
          font-family: 'Georgia', serif;
          font-weight: bold;
        }
      }
    }
    .progress-bar {
      width: 200px;
      height: 200px;
      margin: 50px auto 0;
      box-sizing: border-box;
      padding: 15px;
    }
  }
}
</style>
