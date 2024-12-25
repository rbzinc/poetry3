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
import { ref, onMounted } from 'vue';

const text = '请选择你想对话的诗人进行对话';
const displayedChars = ref([]);

const typewriterEffect = () => {
  const chars = Array.from(text);

  // 清空显示字符数组并逐个字符显示文本
  displayedChars.value = [];
  chars.forEach((char, index) => {
    setTimeout(() => {
      displayedChars.value.push({ value: char, opacity: 1 });
    }, (index + 1) * 200); // 每个字符显示的时间间隔（毫秒）
  });
  setTimeout(() => {
    typewriterEffect();
  }, (chars.length + 1) * 400);
};

// 增加错误处理机制
try {
  onMounted(() => {
    typewriterEffect(); // 启动打字机效果
  });
} catch (error) {
  console.error('启动打字机效果时发生错误:', error);
}
</script>

<style scoped>
.typewriter-container {
  font-size: 35px;
  font-weight: bold;
  height: 120px;
  text-align: center;
  opacity: 0.5;
}

.char {
  transition: opacity 0.5s ease;
  line-height: 120px;
}
</style>
