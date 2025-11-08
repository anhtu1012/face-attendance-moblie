import { dtoDailySalary } from "@/models/salary/dtoSalary";
import { getDailySalarySummary } from "@/services/salary/api";
import { useQuery } from "@tanstack/react-query";

export const useGetDailySalarySummary = (
  userId: string,
  fromDate: string,
  toDate: string,
  enabled = true,
) => {
  const { data, isLoading, error, refetch } = useQuery<dtoDailySalary>({
    queryKey: ["dailySalarySummary", userId, fromDate, toDate],
    queryFn: async () => {
      const res = await getDailySalarySummary(userId, fromDate, toDate);
      return res.data;
    },
    enabled: enabled && !!userId && !!fromDate && !!toDate,
  });

  return {
    data: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
};
