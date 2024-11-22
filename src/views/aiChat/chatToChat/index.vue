<script setup>
import AiPoemAside from "@/components/AiPoetAside/index.vue";
import PoemIntroduce from '@/components/PoemIntroduce/index.vue'
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);
const inputMessage = ref('');
const sendMessage = () => {

};

</script>

<template>
  <div style="display: flex;">
    <div>
      <AiPoemAside/>
    </div>
    <div class="ai-chat-title">
      <el-card style="width: 100%" shadow="never">Never</el-card>
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
              style="width:90%; margin-left:10px"
          />
          <el-button size="large" style="margin-right:10px">发送</el-button>
        </div>
      </div>
    </div>
    <div>
      <PoemIntroduce />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ai-chat-title {
  margin-top: 30px;
  margin-left: 100px;
  width: 70%;
  .chat-container{
    width: 100%;
    height: 520px;
    background-color: skyblue;
    margin-top: 20px;
    .messages-container {
      display: flex;
      flex-direction: column;
      height: 460px;
      margin-bottom: 10px;
      margin-left: 10px;
      .message {
        padding: 12px;
        border-radius: 4px;
        max-width: 80%;
        word-wrap: break-word;
        margin-top: 10px;
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
}


</style>
