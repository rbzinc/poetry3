import { defineStore } from "pinia"
import { ref } from "vue"


export const talkSquareStore = defineStore('talkSquare', () =>{
    let ismodel = ref(false)
    const funmodel = (ismodel) => {
      console.log(ismodel.value)
      ismodel.value = !ismodel.value
    }

    return {
      ismodel,
      funmodel
    }
},{
    persist: true,
})
