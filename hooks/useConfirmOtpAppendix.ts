import { confirmOtpForAppendixSigning } from "@/api/contract";
import { useMutation } from "@tanstack/react-query";

export const useConfirmOtpAppendix = () => {
  return useMutation({
    mutationFn: (values: FormData) => confirmOtpForAppendixSigning(values),
  });
};
