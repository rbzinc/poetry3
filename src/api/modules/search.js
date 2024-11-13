import instance from '../index'
export const userSearchService = (name) => {
  return instance.post ('/user/login', name)
}

