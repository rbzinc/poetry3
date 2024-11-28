<script setup>
import { ref } from 'vue';
import {useRouter} from "vue-router";
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
  { question: '便要还家', answer: '设酒杀鸡作食' }
];
const current = ref(0);
const question = ref(poems[current.value].question);
let answer = ref('');
const correctAnswer = ref(poems[current.value].answer);
const active = ref(0);
//判断回答正误
const checkAnswer = () => {
  if (answer.value === correctAnswer.value) {
    score.value += 1;
    alert('正确！')
  } else {
    alert('错误！正确答案是：' + correctAnswer.value)
  }
};

const nextQuestion = () => {
  if (current.value < poems.length - 1) {
    if (answer.value === '') {
      message.value = '答案不能为空';
    } else {
      checkAnswer();
      current.value = (current.value + 1) % poems.length;
      question.value = poems[current.value].question;
      correctAnswer.value = poems[current.value].answer;
      answer.value = '';
    }
  }
  else if(current.value === poems.length - 1){
    checkAnswer();
    button.value = '查看分数';
    current.value +=1
  }
  else{
    dialogFormVisible.value = true;
    active.value++
  }
};


const returnclick = () =>{
  router.push('/textlist')
}

const fillgameclick = () =>{
  router.push('/fillpoetgame')
}

</script>

<template>
  <div class="return" @click="returnclick">
    <el-icon><ArrowLeftBold /></el-icon>
    返回
  </div>
 <div class="game">
   <div class="poetry-quiz">
     <div class="question">
       <div class="ask">{{ question }}</div>
       <el-input v-model="answer" style="width: 240px" :placeholder="message" />
     </div>
     <el-button @click="nextQuestion">{{ button }}</el-button>
   </div>
 </div>
  <div class="progress-bar">
    <el-steps
        style="max-width: 600px"
        :space="180"
        :active="active"
        finish-status="success"
    >
      <el-step title="古诗填句" />
      <el-step title="挖词填空" @click="fillgameclick"/>
    </el-steps>
  </div>
  <el-dialog v-model="dialogFormVisible" title="以下是您的得分" width="800px">
    <p>{{score}}</p>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.return{
  height: 40px;
  width: 100%;
  border-bottom: 1px #727171 solid;
  display: flex;
  margin: 0 auto 60px;
  cursor: pointer;
  font-size: 20px;
}
.game{
  width: 900px;
  margin: 10px auto;
  .poetry-quiz {
    text-align: center;
      .question {
        margin-bottom: 20px;
        .ask{
          margin-bottom:20px ;
          font-size: 25px;
          font-family: 'Georgia', serif;
          font-weight: bold;
        }
      }
    }
}
.progress-bar{
  width: 200px;
  height: 150px;
  margin: 50px auto 0;
}
</style>