import instance from '../index'
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {useUserInfoStore} from "@/stores/index.js";

export const aiChatGetApi = (idd, message) => instance({
  url: '/ai/chat11',
  method: 'POST',
  data: {
    idd: idd,
    message: message
  }
})
