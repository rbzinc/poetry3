import instance from "../instance.js";
export const userPlayGame = (params) => {
  return instance.get("/user/game/questions", params);
};
