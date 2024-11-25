import instance from '../index'

//模糊查询古诗
export const getPoetSearch = (data,pagenum) => {
  return instance.get('/user/poetry/GetPoembyTitle',
    { params:{ 
      title:data,
      pageNum:pagenum
    }}
  )
}
//模糊查询名句
export const getSenSearch = (data,pagenum) => {
  return instance.get('/user/poetry/GetmingjuByThesisDataVo', 
    { params:{ 
      title:data,
      pageNum:pagenum
    }} 
  )
}
//模糊查询诗人
export const getWriterSearch = (name) => {
  return instance.get('', name)
}