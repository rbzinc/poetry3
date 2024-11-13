import { defineStore } from "pinia"
import { ref } from "vue"


export const talkSquareStore = defineStore('user', () =>{
    let ismodel = ref(false)
    const funmodel = () =>{
      ismodel.value = !ismodel.value
    }
    
    return {
      ismodel,
      funmodel
    }
},{
    persist: true,
})
