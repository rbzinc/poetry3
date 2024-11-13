<script setup>
import {ref} from 'vue'
import { userPoetryAiService } from '../../api/modules/potryai'
const textarea = ref('') 
const hgroups = ref(null)
const message = ref('')
const id = ref(1)
const postMessage = async (id,message) =>{
  const res = await userPoetryAiService(id,message)
  console.log(res.value)
  
}
  const sending=() => {
    if (textarea.value) { //判断能容不能为空或空格 输入时也加了 .trim (意思是过滤输入时前后的空格)
    hgroups.value.innerHTML += `<div class="user">
      <div class='textstyle'>${textarea.value}</div>
      <i class="el-icon-user" style='margin-left:10px'></i>
      </div>` //用户输入时每次增加标签
      postMessage(id,textarea.value)
      textarea.value = ""
      hgroups.value.scrollTop = hgroups.value.scrollHeight 
      setTimeout(() => { //模拟系统延时1秒回答
        hgroups.value.innerHTML += `<div class="system">
        <i class="el-icon-user-solid" style='margin-right:10px'></i>
        <div class='textstyle'>${res.value}</div>
        </div>` //系统回答时每次增加的标签 注意和上边用户的class不同
        hgroups.value.innerHTML.scrollTop = hgroups.value.scrollHeight //系统说话后滚动条自动滚动
      }, 1000)
    } 
    else {
        import('element-plus').then(El => {
          El.ElMessage.error("消息不可为空")
        });
      }
  }


</script>

<template>
 <div class="bgc">
  <div class="home">
  <!-- 标题 -->
  <header class="headers">李白</header>
  <!-- 内容 -->
  <hgroup class="hgroups" ref="hgroups"></hgroup>
  <!-- 底部 -->
  <footer class="footers">
  <el-input type="textarea" :rows="2" class="ipt" placeholder="请输入内容" v-model.trim="textarea"></el-input>
  <el-button type="info" plain @click="sending">发送</el-button>
  </footer>
  </div>
 </div>
 
</template>

<style scoped lang="scss">
.bgc{
  width: 100%;
  height: 860px;
  background-image: url('./pic/8aefe58b28407daa2023f8b95b5df57.jpg');
  background-size: 100% 860px;
}
.home{
  width: 700px;
  height: 800px;
  background: none;
  box-sizing: border-box;
  margin: 0 auto;
  border-radius: 10% ;
}
::v-deep  .headers {
  /*标题设置*/
  height: 70px; /*高*/
  background-color: rgb(194, 194, 194); /*背景色*/
  line-height: 80px; /*行高,控制上下居中*/
  text-align: center; /*控制左右居中*/
  font-size: 27px;
  font-weight: 600;
  border-radius: 10%;
  opacity: 0.6;
  }
  ::v-deep  .hgroups {
  /* 内容区样式*/
  height: 700px;
  background-image: url('./pic/图片1.png');
  background-size: 700px 800px; 
  overflow: auto; /*聊天内容过多时自动添加滚动条*/
  }
  ::v-deep  .footers {
  /* 底部区样式*/
  display: flex;
  justify-content: flex-end; /* 控制底部框框和按钮在一排 横着显示的*/
  }
  ::v-deep  .ipt {
  margin-right: 10px; /* 底部区框框和按钮中间的间隙*/
  }
  ::v-deep  .user { /* 用户说话样式*/
  float: right; /* 用户说话自动靠右*/
  clear: both; /* 用户说话左边不能有东西*/
  display: flex; /* 头像和说话并排显示*/
  align-items: center; /* 头像在说话高度中间对齐*/
  }
  ::v-deep  .textstyle { /* 气泡框背景样式*/
  padding: 10px;
  background-color: #fff;
  border-radius: 10px;
  max-width: 500px;
  word-wrap: normal; /*自动换行*/
  line-height: 24px;
  }
  ::v-deep  .system { /* 系统说话样式*/
  float: left;
  clear: both;
  display: flex;
  align-items: center  }
  
</style>