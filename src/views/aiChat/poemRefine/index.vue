<script setup>
import AiPoemAside from "@/components/AiPoetAside/index.vue";
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);


import { ref } from 'vue'
const inputMessage = ref('');
const sendMessage = () => {

};
const typeIndex = ref(1);
const changeType = (event) => {
  console.log(event);
  typeIndex.value = event;
}
</script>

<template>
  <div>
    <AiPoemAside />
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
          style="width:85%; margin-left:10px"
      />
      <el-dropdown split-button type="primary" size="large" style="margin-right:10px">
        发送
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click.native="changeType(1)">修改</el-dropdown-item>
            <el-dropdown-item @click.native="changeType(2)">批改</el-dropdown-item>
            <el-dropdown-item @click.native="changeType(3)">剖析</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container{
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
    align-items: center;
    justify-content: space-around;
  }
}
</style>
