import instance from '../instance.js'

//根据标题查询古诗
export const getPoetSearch = (title, pageNum, pageSize = 10) => {
  return instance.get('/user/poetry/GetPoembyTitle', {
    params: {
      title: title,
      pageNum: pageNum,
      pageSize: pageSize,
    },
  })
}

// 根据诗人查询古诗
//TODO后续这里会补充成分页查询
export const getPoemByWriter = (name) => {
  return instance.get('/user/poetry/GetPoemByWriter', {
    params: {
      name: name,
    },
  })
}

//模糊查询名句
export const getSenSearch = (data, pagenum) => {
  return instance.get('/user/poetry/GetmingjuByThesisDataVo', {
    params: {
      title: data,
      pageNum: pagenum,
    },
  })
}
//模糊查询诗人
export const getWriterSearch = (name) => {
  return instance.get('/user/poetry/GetPoemWriterByName11', {
    params: {
      name: name,
    },
  })
}
