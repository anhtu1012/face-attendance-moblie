import { confirmOtpForContractSigning } from "@/api/contract";
import { useMutation } from "@tanstack/react-query";
export const useConfirmOtp = () => {
  return useMutation({
    mutationFn: (values: FormData) => confirmOtpForContractSigning(values),
    onSuccess: () => {
      console.log("OTP confirmed successfully for contract signing.");
    },
    onError: (error) => {
      console.error("Error confirming OTP for contract signing:", error);
    },
  });
};
