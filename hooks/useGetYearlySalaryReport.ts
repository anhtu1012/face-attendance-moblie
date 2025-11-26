import { dtoYearlySalaryReport } from "@/models/salary/dtoSalary";
import { getYearlySalaryReport } from "@/services/salary/api";
import { useQuery } from "@tanstack/react-query";

export const useGetYearlySalaryReport = (
  userId: string,
  year: number,
  enabled = true
) => {
  const { data, isLoading, error, refetch } = useQuery<dtoYearlySalaryReport>({
    queryKey: ["yearlySalaryReport", userId, year],
    queryFn: async () => {
      const res = await getYearlySalaryReport(year, userId);
      return res.data;
    },
    enabled: enabled && !!userId && !!year,
  });

  return {
    data,
    isLoading,
    error,
    refetch,
  };
};
