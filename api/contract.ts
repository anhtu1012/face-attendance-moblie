import api from "@/config/axios";
import { ContractListResponse } from "@/models/contract/dtoContract";
export const getContractByUserId = async (userId: string) => {
  const response = await api.get<ContractListResponse>(
    `/contract/danh-sach-hop-dong?userId=${userId}`
  );
  return response.data;
};
export const sendOtpForContractSigning = async (
  userContractId: string,
  gmail: string
) => {
  const response = await api.post("/contract/gui-otp", {
    userContractId,
    gmail,
  });
  return response.data;
};

export const confirmOtpForContractSigning = async (values: FormData) => {
  const response = await api.post("/contract/xac-nhan-otp", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
