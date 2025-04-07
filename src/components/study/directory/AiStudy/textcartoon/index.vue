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
import { ref, onMounted, onBeforeUnmount } from 'vue';

// 可以通过props接收文本，增加组件复用性
const props = defineProps({
  text: {
    type: String,
    default: '请选择你想对话的诗人进行对话'
  },
  typingSpeed: {
    type: Number,
    default: 200
  },
  pauseBeforeRestart: {
    type: Number,
    default: 2000
  }
});

const displayedChars = ref([]);
let animationTimer = null;
let restartTimer = null;

const typewriterEffect = () => {
  const chars = Array.from(props.text);
  
  // 清空显示字符数组
  displayedChars.value = [];
  
  // 逐个字符显示文本
  chars.forEach((char, index) => {
    animationTimer = setTimeout(() => {
      displayedChars.value.push({ value: char, opacity: 1 });
    }, (index + 1) * props.typingSpeed);
  });
  
  // 完成后等待一段时间再重新开始
  restartTimer = setTimeout(() => {
    // 淡出效果
    fadeOutText(() => {
      typewriterEffect();
    });
  }, (chars.length + 1) * props.typingSpeed + props.pauseBeforeRestart);
};

// 添加淡出效果
const fadeOutText = (callback) => {
  const chars = [...displayedChars.value];
  chars.forEach((char, index) => {
    setTimeout(() => {
      if (displayedChars.value[index]) {
        displayedChars.value[index].opacity = 0;
      }
    }, index * 50);
  });
  
  setTimeout(callback, chars.length * 50 + 300);
};

// 清理定时器，防止内存泄漏
const clearTimers = () => {
  if (animationTimer) {
    clearTimeout(animationTimer);
    animationTimer = null;
  }
  if (restartTimer) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }
};

onMounted(() => {
  try {
    typewriterEffect(); // 启动打字机效果
  } catch (error) {
    console.error('启动打字机效果时发生错误:', error);
  }
});

// 组件卸载前清理定时器
onBeforeUnmount(() => {
  clearTimers();
});
</script>

<style scoped>
.typewriter-container {
  font-size: 35px;
  font-weight: bold;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #535050;
}

.char {
  transition: opacity 0.5s ease;
  line-height: 1.2;
  letter-spacing: 1px;
}

</style>