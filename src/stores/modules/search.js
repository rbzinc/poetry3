import { defineStore } from "pinia"
import { ref } from "vue"


export const userSearchStore = defineStore('search', () =>{
    const userinput = ref('')
    return {
      userinput
    }
},{
    persist: true,
})
