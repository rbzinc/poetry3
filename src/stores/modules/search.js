import { defineStore } from "pinia"
import { ref } from "vue"


export const userSearchStore = defineStore('search', () =>{
    const userInput = ref('')
    return {
      userInput
    }
})
