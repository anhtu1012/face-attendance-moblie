import { dtoDependent } from "@/models/auth/dtoUser";
import axios from "./axios";

export const getDependentByUser = async (userId: string) => {
  const response = await axios.get<dtoDependent[]>(
    `/dependent/by-user?userId=${userId}`
  );
  return response.data;
};
export const updateDependent = async (dpId: string, dependent: dtoDependent) => {
  const response = await axios.put<dtoDependent>(
    `/dependent/${dpId}`,
    dependent
  );
  return response.data;
};
export const createDependent = async (dependent: dtoDependent) => {
  const response = await axios.post<dtoDependent>(
    `/dependent`,
    dependent
  );
  return response.data;
};
export const deleteDependent = async (dpId: string) => {
  const response = await axios.delete<dtoDependent>(
    `/dependent/${dpId}`
  );
  return response.data;
};