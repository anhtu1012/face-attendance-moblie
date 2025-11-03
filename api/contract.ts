import api from "@/config/axios";
import { AppendixListResponse } from "@/models/contract/dtoAppendix";
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
export const getAppendixByUserContractId = async (userContractId: string) => {
  const response = await api.get<AppendixListResponse>(
    `/contract/phu-luc-hop-dong?userContractId=${userContractId}`
  );
  return response.data;
};

export const sendOtpForAppendixSigning = async (
  userContractExtendedId: string,
  gmail: string
) => {
  const response = await api.post("/contract/gui-otp", {
    userContractExtendedId,
    gmail,
  });
  return response.data;
};

export const confirmOtpForAppendixSigning = async (values: FormData) => {
  const response = await api.post("/contract/xac-nhan-otp", values, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
