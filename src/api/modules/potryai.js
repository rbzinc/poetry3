
import instance from '../index'
export const userPoetryAiService = (id,message) => {
  return instance.get('/aiaiaai', 
    { params: 
      { message:message,
        id:id
   } });
}