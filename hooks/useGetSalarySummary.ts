import { dtoSalarySummary } from "@/models/salary/dtoSalary";
import { getSalarySummary } from "@/services/salary/api";
import { useQuery } from "@tanstack/react-query";

// Mock data generator
export const useGetSalarySummary = (
  userId: string,
  month: number,
  enabled = true
) => {
  const { data, isLoading, error, refetch } = useQuery<dtoSalarySummary>({
    queryKey: ["salarySummary", userId, month],
    queryFn: async () => {
      const res = await getSalarySummary(userId, month);
      return res.data;
    },
    enabled: enabled && !!userId && !!month,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
