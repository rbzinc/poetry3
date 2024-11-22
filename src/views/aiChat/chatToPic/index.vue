<script setup>
import AiPoemAside from "@/components/AiPoetAside/index.vue";
import {aiChatGetApi} from "@/api/modules/aiChat.js";
import {useUserInfoStore} from "@/stores/index.js";

const messages = ref([
  {text: '发送我一段一首古诗，我将为你生成相应的图片哦', self: false},
]);
const inputMessage = ref('');

const sendMessage =  () => {
  if (inputMessage.value) {
    messages.value.push({ text: inputMessage.value, self: true });
    inputMessage.value = '';
  }
  aiChat()
};

const aiChat = async () => {
  console.log(inputMessage.value)
  const res = await aiChatGetApi(1,inputMessage.value)
  console.log(res)
  // messages.value.push({ text: res.data, self: true });
}

</script>

<template>
  <div>
    <AiPoemAside/>
  </div>
  <div class="chat-container">
    <div class="messages-container">
      <div v-for="(message, index) in messages" :key="index"
           class="message"
           :class="{ 'my-message': message.self, 'ai-message': !message.self }">

        {{ message.text }}
      </div>
    </div>
    <div class="dialog-input">
      <el-input
          v-model="inputMessage"
          placeholder="有什么想问的你都可以畅所欲言！"
          @keyup.enter="sendMessage"
          size="large"
          style="width:92%; margin-left:10px"
      />
      <el-button size="large" style="margin-right:10px" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  width: 80%;
  height: 600px;
  background-color: skyblue;
  margin: 30px auto;

  .messages-container {
    display: flex;
    flex-direction: column;
    height: 534px;
    margin-bottom: 10px;
    margin-left: 10px;

    .message {
      padding: 12px;
      border-radius: 4px;
      max-width: 80%;
      word-wrap: break-word;
      margin-top: 10px;
      margin-right: 10px;
    }

    .avatar {
      width: 40px; /* 头像宽度 */
      height: 40px; /* 头像高度 */
      border-radius: 50%; /* 圆形头像 */
      margin-right: 10px; /* 头像和文字之间的间距 */

    }

    .my-message {
      align-self: flex-end;
      background-color: #e6f7ff;
    }

    .ai-message {
      align-self: flex-start;
      background-color: #f0f9ff;

    }
  }

  .dialog-input {
    display: flex;
    justify-content: space-between;
    align-items: center;

  }
}

</style>
