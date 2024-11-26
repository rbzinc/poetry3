import instance from "@/api/index.js";

export const userUpdatemessagebyidPutApi = ({name, age, degree, touxaing, sex, phone}) => instance({
  url: '/user/updatemessagebyid',
  method: 'put',
  data: {
    name,
    age,
    degree,
    touxaing,
    sex,
    phone
  }
})
