import instance from '../index'
export const userPlayGame = (params) => {
  return instance.get('/user/game/questions', params)
}

