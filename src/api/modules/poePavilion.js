import instance from '../instance.js'

//随机返回十条古诗词
export const getpoemRandomData = () => {
  return instance.get('/user/poetry/GetPoemDateRondom')
}

export const getPoetryCount = () =>
  instance({
    url: '/user/poetry/GetCount',
    method: 'get',
  })

export const getPoetryPoemPage = (pageNum, pageSize) =>
  instance({
    url: '/user/poetry/GetPoemPage',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
    },
  })

//点击朝代搜索古诗，分页搜索
export const getDynastyData = (dynasty, pagenum, pageSize) =>
  instance({
    url: '/user/poetry/GetPoemBydynasty',
    params: {
      dynasty: dynasty,
      pageNum: pagenum,
      pageSize: pageSize,
    },
  })

///点击分类搜索古诗，分页搜索
export const getClassData = (data, pagenum, pageSize) => {
  return instance.get('/user/poetry/GetPoemByType', {
    params: {
      Type: data,
      pageNum: pagenum,
      pageSize: pageSize,
    },
  })
}

//点击诗人查询古诗
export const getWriterPoemData = (data, pagenum, pageSize) => {
  return instance.get('/user/poetry/GetwriterBywriter', {
    params: {
      writer: data,
      pageNum: pagenum,
      pageSize: pageSize,
    },
  })
}

//点击跳转诗的详情页面
export const getPoemDetatils = (data) => {
  return instance.get('/user/poetry/GetPoemContbyid', {
    params: {
      id: data,
    },
  })
}

//随机返回几条诗人的简易介绍
export const getPoetRandomData = (pageNum, pageSize) => {
  return instance.get('/user/poetry/Get', {
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
    },
  })
}

//点击朝代返回相应朝代的诗人信息
export const getWriterData = (data, pagenum) => {
  return instance.get('/user/poetry/GetwriterBydynasty', {
    params: {
      dynsaty: data,
      pageNum: pagenum,
    },
  })
}

//随机返回十句名句
export const getsenRandomData = (data) => {
  return instance.get('/user/rhesis/GetRhesisPage', data)
}

//根据诗人查询名句
export const getSentenceData = (data, pagenum) => {
  return instance.get('/user/poetry/GetwriterByThesisDataVo', {
    params: {
      writer: data,
      pageNum: pagenum,
    },
  })
}

export const getSentenceCount = () =>
  instance({
    url: '/user/rhesis/GetCount',
    method: 'get',
  })
