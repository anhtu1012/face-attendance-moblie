import { useMutation, useQueryClient } from "@tanstack/react-query";

import { sendOtpForContractSigning } from "@/api/contract";
export const useSendOTPContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userContractId,
      userGmail,
    }: {
      userContractId: string;
      userGmail: string;
    }) => sendOtpForContractSigning(userContractId, userGmail),
    onSuccess: () => {
        
      queryClient.invalidateQueries({ queryKey: ["contract"] });
      console.log("OTP sent successfully for contract signing.");
    },
    onError: (error) => {
      console.error("Error sending OTP for contract signing:", error);
    },
  });
};
