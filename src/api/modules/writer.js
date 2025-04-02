import instance from "../instance.js";

export const userWriterService = (data) => {
  return instance.get("/user/poetry/GetPoemWrier", {
    params: {
      id: data,
    },
  });
};
