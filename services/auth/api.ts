import api from "@/config/axios";
import { LoginFormValues } from "@/model/auth/login";

export const loginUser = (values: LoginFormValues) => {
  return api.post("/auth/login", values);
};
