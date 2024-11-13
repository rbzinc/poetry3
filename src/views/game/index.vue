<script setup>
import { ref } from 'vue';

const currentPoetry = ref(null);
const userAnswer = ref('');
const isAnswerCorrect = ref(null);

const fetchPoetry = async () => {
  try {
  
    
    const data = await response.json();
    currentPoetry.value = data;
  } catch (error) {
    console.error('Failed to fetch poetry:', error);
  }
};

const submitAnswer = async () => {
  if (!currentPoetry.value) {
    fetchPoetry();
    return;
  }

  try {
    const response = await fetch('/verify-poetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: userAnswer.value, poetryId: currentPoetry.value.id }),
    });

    if (response.ok) {
      const data = await response.json();
      isAnswerCorrect.value = data.isCorrect;
    } else {
      console.error('Failed to verify answer:', response);
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
  }
};
</script>
<template>
  <div class="game-container">
    <div v-if="currentPoetry" class="poetry">
      {{ currentPoetry.upper }}
    </div>
    <div class="input-container">
      <input
        type="text"
        v-model="userAnswer"
        placeholder="请输入下句古诗"
      />
      <button @click="submitAnswer">提交</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.game-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.poetry {
  font-size: 24px;
  margin-bottom: 20px;
}

.input-container {
  margin-bottom: 10px;
}

.input-container input {
  margin-right: 10px;
}

.result {
  color: green;
}