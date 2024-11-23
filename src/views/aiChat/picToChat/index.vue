<script setup>
import AiPoemAside from "@/components/AiPoetAside/index.vue";
const messages = ref([
  { text: '你好，这里是古韵传习堂诗词网，有什么可以帮助您？', self: false },
]);

const input = ref('')
const isCustomStyleVisible = ref(false)
import { ref } from 'vue'
import { genFileId } from 'element-plus'

const upload = ref()

const handleExceed = (files) => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
}

const isAdding = ref(false)
const value = ref([])
const optionName = ref('')
const cities = ref([
  {
    value: 'Beijing',
    label: 'Beijing',
  },
  {
    value: 'Shanghai',
    label: 'Shanghai',
  },
  {
    value: 'Nanjing',
    label: 'Nanjing',
  },
  {
    value: 'Chengdu',
    label: 'Chengdu',
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen',
  },
  {
    value: 'Guangzhou',
    label: 'Guangzhou',
  },
])

const onAddOption = () => {
  isAdding.value = true
}

const onConfirm = () => {
  if (optionName.value) {
    cities.value.push({
      label: optionName.value,
      value: optionName.value,
    })
    clear()
  }
}

const clear = () => {
  optionName.value = ''
  isAdding.value = false
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
      <div style="display: flex;align-items: center;justify-content: space-evenly; width: 1200px">

        <el-select v-model="value" placeholder="体裁" style="width: 180px">
          <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"

          />
          <template #footer>
            <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
              Add an option
            </el-button>
            <template v-else>
              <el-input
                  v-model="optionName"
                  class="option-input"
                  placeholder="请输入体裁内容"
                  size="small"
                  style="width: 180px"
              />
              <br />
              <el-button type="primary" size="small" @click="onConfirm">
                确定
              </el-button>
              <el-button size="small" @click="clear">取消</el-button>
            </template>
          </template>
        </el-select>

        <el-select v-model="value" placeholder="体裁" style="width: 180px">
          <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"

          />
          <template #footer>
            <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
              Add an option
            </el-button>
            <template v-else>
              <el-input
                  v-model="optionName"
                  class="option-input"
                  placeholder="请输入体裁内容"
                  size="small"
                  style="width: 180px"
              />
              <br />
              <el-button type="primary" size="small" @click="onConfirm">
                确定
              </el-button>
              <el-button size="small" @click="clear">取消</el-button>
            </template>
          </template>
        </el-select>

        <el-select v-model="value" placeholder="体裁" style="width: 180px">
          <el-option
              v-for="item in cities"
              :key="item.value"
              :label="item.label"
              :value="item.value"

          />
          <template #footer>
            <el-button v-if="!isAdding" text bg size="small" @click="onAddOption">
              Add an option
            </el-button>
            <template v-else>
              <el-input
                  v-model="optionName"
                  class="option-input"
                  placeholder="请输入体裁内容"
                  size="small"
                  style="width: 180px"
              />
              <br />
              <el-button type="primary" size="small" @click="onConfirm">
                确定
              </el-button>
              <el-button size="small" @click="clear">取消</el-button>
            </template>
          </template>
        </el-select>
        <el-input v-model="input" placeholder="自定义标题" style="width: 180px;"></el-input>
        <el-upload
            ref="upload"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
        >
          <template #trigger>
            <el-button type="primary" style="margin-top: 10px">选择图片</el-button>
          </template>

        </el-upload>
      </div>

      <el-button style="margin-left: 320px">发送</el-button>
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
  }
}

.option-input {
  width: 100%;
  margin-bottom: 8px;
}
</style>
