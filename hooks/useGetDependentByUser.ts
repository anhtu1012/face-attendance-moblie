import { getDependentByUser } from "@/api/dependent";
import { useQuery } from "@tanstack/react-query";
import { dtoDependent } from "@/models/auth/dtoUser";

export const useGetDependentByUser = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery<dtoDependent[]>({
    queryKey: ["dependents", userId],
    queryFn: () => getDependentByUser(userId),
  });
  return { data, isLoading, error, refetch };
};