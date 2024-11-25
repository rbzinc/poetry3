
import instance from '../index'
export const userPoetryAiService = (id,message) => {
  return instance.get('/ai/chat', 
    { params: 
      { message:message,
        id:id
   } });
}