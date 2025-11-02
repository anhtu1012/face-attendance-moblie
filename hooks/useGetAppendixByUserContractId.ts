import { getAppendixByUserContractId } from "@/api/contract";
import { useQuery } from "@tanstack/react-query";
export const useGetAppendixByUserContractId = (userContractId: string) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["appendix", userContractId],
    queryFn: () => getAppendixByUserContractId(userContractId),
  });
  return { data: data?.data ?? [], isLoading, error, refetch };
};