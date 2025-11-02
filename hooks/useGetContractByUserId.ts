import { getContractByUserId } from "@/api/contract";
import { useQuery } from "@tanstack/react-query";
export const useGetContractByUserId = (userId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["contract", userId],
    queryFn: () => getContractByUserId(userId),
  });
  return { data: data?.data, isLoading, error, refetch };
};
