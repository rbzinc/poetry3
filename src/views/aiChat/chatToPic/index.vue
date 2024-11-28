<script setup>
// 导入依赖组件和模块
import AiPoemAside from "@/components/AiPoetAside/index.vue";
import {userAIDraowSdadwadwPostApi} from "@/api/modules/aiChat.js";
import {ElMessage} from "element-plus";

// 初始化消息数组和输入消息的引用
const messages = ref([{text: '发送我一段一首古诗，我将为你生成相应的图片哦', self: false}]);
const inputMessage = ref('');

// 发送消息的异步函数
const sendMessage = async () => {
  const trimmedInput = inputMessage.value.trim();
  if (!trimmedInput) {
    ElMessage.error('请输入内容');
    return;
  }
  messages.value.push({text: trimmedInput, self: true});
  userAIDraow();
  inputMessage.value = '';

};

const userAIDraow = async () => {
  const res = await userAIDraowSdadwadwPostApi(inputMessage.value);
  console.log(res);
}

</script>

<template>
  <div>
    <AiPoemAside/>
  </div>
  <div class="chat-container">
    <el-scrollbar>
      <div class="messages-container">
        <div
            v-for="(message, index) in messages" :key="index"
            class="message"
            :class="{ 'my-message': message.self, 'ai-message': !message.self }">
          <img
              v-if="!message.self"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              alt=""
              class="avatar avatarAi"/>
          <p>{{ message.text }}</p>
          <img
              v-if="message.self"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              alt=""
              class="avatar avatarMy"/>
        </div>
      </div>
    </el-scrollbar>

    <div class="dialog-input">
      <el-input
          v-model="inputMessage"
          placeholder="有什么想问的你都可以畅所欲言！"
          @keyup.enter="sendMessage"
          size="large"
          style="width:80%; margin-left:10px"
      />
      <el-button size="large" style="margin-left:20px" @click="sendMessage">发送</el-button>
    </div>

  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  width: 80%;
  height: 560px;
  margin: 30px auto;

  .messages-container {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    margin-left: 10px;
    align-items: flex-start;

    .message {
      padding: 10px;
      border-radius: 4px;
      max-width: 75%;
      word-wrap: break-word;
      display: flex;
      align-items: center;
      margin-top: 10px;
      margin-right: 10px;
    }

    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }

    .avatarAi {
      margin-right: 15px;
    }

    .avatarMy {
      margin-left: 15px;
    }

    .my-message {
      align-self: flex-end;
      background: linear-gradient(to left, transparent 0%, transparent 50px, #e6f7ff 50px, #e6f7ff 100%);
    }

    .ai-message {
      align-self: flex-start;
      background: linear-gradient(to right, transparent 0%, transparent 50px, #e6f7ff 50px, #e6f7ff 100%);
    }
  }

  .dialog-input {
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 4vh;
    left: 7vw;
    width: 90vw;
  }
}
</style>
