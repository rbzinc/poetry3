import {defineStore} from "pinia";
import {ref} from "vue";

export const userGameStore = defineStore('game', () =>{
    const poetstatus = ref(1)
    return {
        poetstatus
    }
},{
    persist: true,
})