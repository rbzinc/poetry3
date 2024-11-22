import instance from '../index'

export const aiChatGetApi = (id, message) => {
  return instance({
    url: '/ai/chat',
    method: 'POST',
    params: {
      id: id,
      message: message
    }
  }).then(response => {
    // 处理响应数据
    return response.data;
  }).catch(error => {
    // 处理错误
    console.error('Error:', error);
    throw error; // 将错误抛出，以便调用者可以进一步处理
  });
};

