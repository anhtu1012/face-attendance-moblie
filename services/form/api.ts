import api from "@/config/axios";

export const submitForm = (values: FormData) => {
  return api.post("/form/quan-li-don/nguoi-gui", values);
};
