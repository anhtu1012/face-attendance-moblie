import api from "@/config/axios";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_PYTHON_API_URL;

export const createForm = (values: FormData) => {
  return api.post("/business/tao-don", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUser = async (userCode: string) => {
  return api.get(`/business/get-user-by-management?userCode=${userCode}`);
};

export const getMissingPose = (userId: string) => {
  return axios.get(`${BASE_URL}/missing-pose/${userId}`);
};

export const registerFace = (values: FormData) => {
  return axios.post(`${BASE_URL}/register`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 20000,
  });
};

export const verifyFace = (values: FormData) => {
  console.log("formData: ", values);
  console.log("url: ", `${BASE_URL}/verify`);

  return axios.post(`${BASE_URL}/verify`, values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 10000,
  });
};
