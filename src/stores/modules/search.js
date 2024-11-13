import { defineStore } from "pinia"
import { ref } from "vue"


export const userSearchStore = defineStore('user', () =>{
    const userinput = ref('')
    
    return {
      userinput
    }
},{
    persist: true,
})
