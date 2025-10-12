import _axios, { AxiosError, AxiosRequestConfig } from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
const token: {
    current: string | null;
  } = {
    current: null,
  };
const axios = _axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type": "application/json",
    }
})
export const setToken = (_token: string | null) => {
    token.current = _token;
    if (_token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${_token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

export default axios;