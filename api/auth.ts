import { LoginFormValues, LoginResponse } from "../models/auth/login";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const loginUser = (values: LoginFormValues) => {
  const response = axios.post<LoginResponse>(`${BASE_URL}/auth/login`, values);
  return response;
};
