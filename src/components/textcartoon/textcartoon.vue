<template>
  <div class="typewriter-container">
    <span
      v-for="(char, index) in displayedChars"
      :key="index"
      class="char"
      :style="{ opacity: char.opacity }"
    >
      {{ char.value }}
    </span>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const text = '请选择你想对话的诗人进行对话';
const displayedChars = ref([{ value: '', opacity: 1 }]); // 初始化数组，包含一个占位字符

const typewriterEffect = () => {
  const chars = Array.from(text);
  let timer = displayedChars.value.length;

  // 逐个字符显示文本
  chars.forEach((char, index) => {
    setTimeout(() => {
      displayedChars.value[index] = { value: char, opacity: 1 };
    }, (index + 1) * 200); // 每个字符显示的时间间隔（毫秒）
  });
};

typewriterEffect(); // 启动打字机效果
</script>

<style scoped>
.typewriter-container {
  font-size: 35px;
  font-weight: bold;
  width: 100%;
  height: 200px;
  text-align: center;
  margin: 0 auto;
  background-color: #fff;
  color: black;
  opacity: 0.5;
}

.char {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.5s ease;
 
  line-height: 200px;

  
}
</style>