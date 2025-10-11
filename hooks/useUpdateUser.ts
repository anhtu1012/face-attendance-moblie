import { updateUser } from "@/api/user";
import { dtoUpdateUser } from "@/models/auth/dtoUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

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
      Alert.alert("Error updating user");
      console.error("Error updating user:", error);
    },
  });
}
