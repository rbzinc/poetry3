import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userGameStore = defineStore(
  'game',
  () => {
    // 游戏进度状态
    const poetstatus = ref(1)

    // 已完成的诗词列表
    const completedPoems = ref([])

    // 游戏分数记录
    const gameScores = ref({
      fillPoem: 0, // 填空游戏分数
      matchPoem: 0, // 匹配游戏分数
      recitePoem: 0, // 背诵游戏分数
    })

    // 更新诗词完成状态
    const updatePoetStatus = (poemId) => {
      if (!completedPoems.value.includes(poemId)) {
        completedPoems.value.push(poemId)
      }
    }

    // 获取已完成的诗词列表
    const getCompletedPoems = () => {
      return completedPoems.value
    }

    // 更新游戏分数
    const updateGameScore = (gameType, score) => {
      if (score > gameScores.value[gameType]) {
        gameScores.value[gameType] = score
      }
    }

    // 获取指定游戏类型的最高分
    const getGameScore = (gameType) => {
      return gameScores.value[gameType]
    }

    // 重置游戏状态
    const resetGameStatus = () => {
      poetstatus.value = 1
      completedPoems.value = []
      gameScores.value = {
        fillPoem: 0,
        matchPoem: 0,
        recitePoem: 0,
      }
    }

    return {
      poetstatus,
      completedPoems,
      gameScores,
      updatePoetStatus,
      getCompletedPoems,
      updateGameScore,
      getGameScore,
      resetGameStatus,
    }
  },
  {
    persist: true, // 持久化存储
  },
)
