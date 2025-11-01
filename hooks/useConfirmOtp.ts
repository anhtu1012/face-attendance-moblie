import { confirmOtpForContractSigning } from "@/api/contract";
import { useMutation } from "@tanstack/react-query";

export const useConfirmOtp = () => {
  return useMutation({
    mutationFn: (values: FormData) => confirmOtpForContractSigning(values),
  });
};
