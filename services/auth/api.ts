import api from "@/config/axios";
import { LoginFormValues } from "@/models/auth/login";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = (values: LoginFormValues) => {
  return axios.post(`${BASE_URL}/auth/login`, values);
};
