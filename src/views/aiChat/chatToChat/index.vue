<script setup>
    // 导入组件和库
    import AiPoemAside from "@/components/AiPoetAside/index.vue";
    import PoemIntroduce from '@/components/PoemIntroduce/index.vue'
    import {fetchEventSource} from "@microsoft/fetch-event-source";
    import {useUserInfoStore} from "@/stores/index.js";
    import {aiChatGetApi} from "@/api/modules/aiChat.js";
    import {ElMessage} from "element-plus";

    // 定义消息存储
    const messages = ref([
      { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
    ]);

    // 定义输入内容
    const inputMessage = ref('');

    // 发送消息的函数
    const sendMessage = () => {
      const trimmedInput = inputMessage.value.trim();
      if (trimmedInput) {
        messages.value.push({text: trimmedInput, self: true});
        aiChatGetApi(1, trimmedInput).catch(err => {
          console.error('API请求失败:', err);
        });
        inputMessage.value = '';
      } else {
        ElMessage.error('请输入内容');
      }
    };

    const controller = new AbortController();

    // 获取服务器发送事件的函数
    const GetSSE = () => {
      const sseService = fetchEventSource('http://fuze1.nat300.top/ai/submita', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': useUserInfoStore().userInfo.token,
        },
        signal: controller.signal,
        openWhenHidden: true,
        onmessage(event) {
          try {
            const data = JSON.parse(event.data);
            if (data) {
              const lastMessage = messages.value[messages.value.length - 1];
              if (lastMessage && !lastMessage.self) {
                lastMessage.text += data;
              } else {
                messages.value.push({text: data, self: false});
              }
            }
          } catch (error) {
            console.error('消息解析失败:', error);
            messages.value.push({text: '消息格式有误，请稍后再试。', self: false});
          }
        },
        onerror(event) {
          console.log('错误:', event);
          messages.value.push({text: '连接出现问题，请稍后再试。', self: false});
        },
      });
    }

    onBeforeUnmount(() => {
      controller.abort();
    });

    onMounted(() =>{
      // GetSSE()
    })
</script>

<template>
  <div style="display: flex;">
    <div>
      <AiPoemAside/>
    </div>
    <div class="ai-chat-title">
      <el-card style="width: 100%" shadow="never">Never</el-card>
      <div class="chat-container">
        <el-scrollbar>
          <div class="messages-container">
            <div
                v-for="(message, index) in messages" :key="index"
                class="message"
                :class="{ 'my-message': message.self, 'ai-message': !message.self }">
              <img
                  src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                  alt=""
                  class="avatar avatarAi"
                  v-if="!message.self"/>
              <p>{{ message.text }}</p>
              <img
                  src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
                  alt=""
                  class="avatar avatarMy"
                  v-if="message.self"/>
            </div>
          </div>
        </el-scrollbar>

        <div class="dialog-input">
          <el-input
              v-model="inputMessage"
              placeholder="有什么想问的你都可以畅所欲言！"
              @keyup.enter="sendMessage"
              size="large"
              style="width:90%; margin-left:10px"
          />
          <el-button size="large" style="margin-right:10px" @click="sendMessage">发送</el-button>
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
        height: 480px;
        margin-top: 20px;
        .messages-container {
          display: flex;
          flex-direction: column;
          height: 440px;
          margin-bottom: 10px;
          margin-left: 10px;

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
           justify-content: space-between;
           align-items: center;

         }

      }
    }
</style>
