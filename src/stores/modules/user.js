import { defineStore } from "pinia"
// import { userLoginService } from "../../api/modules/user"
import { ref } from "vue"


export const useUserInfoStore = defineStore('user', () =>{
    const userInfo = ref()
    const setUserInfo = (val) => {
        userInfo.value = val
    }
    const clearUserInfo = () => {
        userInfo.value = null
    }
    return {
        userInfo,
        setUserInfo,
        clearUserInfo
    }
},{
    persist: true,
})
