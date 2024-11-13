import { defineStore } from 'pinia'
import { ref,toRaw} from 'vue'
// export const usePoetStore = defineStore('poet',() =>{
//   const dynastyList =ref([])
//   const classList =ref([])
//   const getDynasty = async() =>{
//     const res = await getDynastyData()
//     dynastyList.value = toRaw(res.result)

//     console.log(res);
    
//   }
//   const getClass = async() =>{
//     const res = await getClassData()
//     classList.value = res.result
//   }
//   return{
//     dynastyList,
//     classList,
//     // getDynasty
//   }
// })
