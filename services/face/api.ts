import api from "@/config/axios";

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

export const registerFace = (values: FormData) => {
  return api.post("/upload/direct-upload", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
