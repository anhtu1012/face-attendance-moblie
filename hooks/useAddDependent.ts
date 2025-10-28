import { createDependent } from "@/api/dependent";
import { dtoDependent } from "@/models/auth/dtoUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useAddDependent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dependent: dtoDependent) => createDependent(dependent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dependent"] });
    },
    onError: (error) => {
      console.error("Error adding dependent:", error);
    },
  });
};
