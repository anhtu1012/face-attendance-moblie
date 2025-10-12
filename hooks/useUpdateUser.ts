import { updateUser } from "@/api/user";
import { dtoUpdateUser } from "@/models/auth/dtoUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      onboardData,
    }: {
      userId: string;
      onboardData: dtoUpdateUser;
    }) => updateUser(userId, onboardData),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });

    },
    onError: (error) => {
      console.error("Error updating user:", error);
    },
  });
}
