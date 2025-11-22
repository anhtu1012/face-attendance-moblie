import { dtoGetUser, dtoUpdateUser } from "@/models/auth/dtoUser";
import axios from "./axios";
import api from "@/config/axios";

export const updateUser = async (
  userId: string | bigint,
  onboardData: Partial<dtoUpdateUser>,
) => {
  const response = await axios.put(`/sa/user/${userId}`, onboardData);
  return response.data;
};

export const updateUserImage = async (formData: FormData) => {
  return await api.post("/sa/user/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getUserById = async (userId: string | bigint) => {
  const response = await axios.get<dtoGetUser>(`/sa/user/${userId}`);
  return response.data;
};

export const updateUserPushToken = async (
  userId: string | bigint,
  pushToken: string,
) => {
  return await updateUser(userId, { userPushToken: pushToken });
};
