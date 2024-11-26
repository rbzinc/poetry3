import { defineStore } from "pinia"
import { ref } from "vue"

export const usePoemImgStore = defineStore("poemImg", ()=>{
  const poemImg = ref("")
  const setPoemImg = (poemData) => {
    poemImg.value = poemData
  }
  return {
    poemImg,
    setPoemImg
  }
},{
  persist: true,
})
