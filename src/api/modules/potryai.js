import instance from "../instance.js";
export const userPoetryAiService = (id, message) => {
  return instance.get("/ai/chat", { params: { message: message, id: id } });
};
