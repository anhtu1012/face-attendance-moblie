import { dtoYearlySalaryReport } from "@/models/salary/dtoSalary";
import { getYearlySalaryReport } from "@/services/salary/api";
import { formatSalaryArray } from "@/utils/numberUtils";
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
      // Format the array of salary data
      if (res.data && Array.isArray(res.data.data)) {
        return {
          ...res.data,
          data: formatSalaryArray(res.data.data),
        };
      }
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
