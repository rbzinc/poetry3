import { defineStore } from 'pinia'
import { ref,toRaw} from 'vue'

export const userSearchStore = defineStore('search', () =>{
  const searchname = ref('')
  return {
    searchname
  }
},{
  persist: true,
})