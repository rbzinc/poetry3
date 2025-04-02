import instance from "@/api/instance.js";

export const userUpdatemessagebyidPutApi = ({
  name,
  age,
  degree,
  touxaing,
  sex,
  phone,
}) =>
  instance({
    url: "/user/updatemessagebyid",
    method: "put",
    data: {
      name,
      age,
      degree,
      touxaing,
      sex,
      phone,
    },
  });
