import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userSearchStore = defineStore('userSearch', () => {
  const userInput = ref('')
  const searchResults = ref([])
  const total = ref(0)
  const currentPage = ref(1)

  // 更新搜索结果
  const updateSearchResults = ({ list, total: totalCount }) => {
    searchResults.value = list
    total.value = totalCount
    currentPage.value = 1
  }

  // 更新作家搜索结果
  const updateWriterResults = (list) => {
    searchResults.value = list
    total.value = list.length // 作家搜索结果的总数就是数组长度
    currentPage.value = 1
  }

  //更新名句搜索结果
  const updateSentenceResults = ({ list, total: totalCount }) => {
    searchResults.value = list
    total.value = totalCount
    currentPage.value = 1
  }

  // 清除搜索
  const clearSearch = () => {
    userInput.value = ''
    searchResults.value = []
    total.value = 0
    currentPage.value = 1
  }

  return {
    userInput,
    searchResults,
    total,
    currentPage,
    updateSearchResults,
    clearSearch,
    updateWriterResults,
    updateSentenceResults,
  }
})
