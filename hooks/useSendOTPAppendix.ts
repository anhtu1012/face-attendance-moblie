import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendOtpForAppendixSigning } from "@/api/contract";

export const useSendOTPAppendix = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userContractExtendedId,
      userGmail,
    }: {
      userContractExtendedId: string;
      userGmail: string;
    }) => sendOtpForAppendixSigning(userContractExtendedId, userGmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appendix"] });
      console.log("OTP sent successfully for appendix signing.");
    },
    onError: (error) => {
      console.error("Error sending OTP for appendix signing:", error);
    },
  });
};

