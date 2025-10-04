import { updateUser } from "@/api/user";
import { dtoUserOnboard } from "@/models/auth/dtoUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      onboardData,
    }: {
      userId: string;
      onboardData: dtoUserOnboard;
    }) => updateUser(userId, onboardData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}
