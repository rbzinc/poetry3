import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePoetDataStore = defineStore('poetData', () => {
  // 状态定义为 ref
  const dynastyOptions = ref([
    '唐代',
    '宋代',
    '明代',
    '清代',
    '元代',
    '当代',
    '两汉',
    '南北朝',
    '金朝',
    '现代',
    '先秦',
    '隋代',
    '五代',
    '未知',
  ])

  const classOptions = ref([
    '古诗三百首',
    '小学古诗',
    '早教古诗100首',
    '初中古诗',
    '初中文言文',
    '乐府',
    '民歌',
    '咏物',
    '叙事',
    '抱负',
    '赞美',
    '写景',
    '写人',
    '品格',
    '孤独',
    '爱情',
  ])

  const poetOptions = ref([
    '李白',
    '杜甫',
    '李清照',
    '白居易',
    '苏轼',
    '李商隐',
    '刘禹锡',
    '高适',
    '孟浩然',
    '王安石',
    '欧阳修',
    '王勃',
    '曹植',
    '晏殊',
    '杨万里',
    '黄庭坚',
    '杜牧',
    '元贺',
    '元稹',
    '纳兰性德',
  ])

  const getDynastyConfig = computed(() => ({
    title: '朝代',
    options: dynastyOptions.value,
  }))

  const getClassConfig = computed(() => ({
    title: '分类',
    options: classOptions.value,
  }))

  const getPoetConfig = computed(() => ({
    title: '诗人',
    options: poetOptions.value,
  }))

  const getAllConfig = computed(() => ({
    dynasty: {
      title: '朝代',
      options: dynastyOptions.value,
    },
    class: {
      title: '分类',
      options: classOptions.value,
    },
    poet: {
      title: '诗人',
      options: poetOptions.value,
    },
  }))

  // 返回所有状态和计算属性
  return {
    dynastyOptions,
    classOptions,
    poetOptions,
    getDynastyConfig,
    getClassConfig,
    getPoetConfig,
    getAllConfig,
  }
})
