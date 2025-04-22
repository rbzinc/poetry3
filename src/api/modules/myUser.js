import instance from '@/api/instance.js'

export const userUpdatemessagebyidPutApi = ({ name, age, degree, touxiang, sex, phone }) =>
  instance({
    url: '/user/updatemessagebyid',
    method: 'put',
    data: {
      name,
      age,
      degree,
      touxiang,
      sex,
      phone,
    },
  })
