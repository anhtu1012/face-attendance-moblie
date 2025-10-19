import { getUserById } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export const useGetUserById = (userId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
  });
  return { data, isLoading, error };
};  