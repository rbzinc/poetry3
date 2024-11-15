import instance from '../index'

export const userWriterService = (data) => {
  return instance.get ('/user/poetry/GetPoemWrier',
    { params:{
      id:data
    }}
  )
}
