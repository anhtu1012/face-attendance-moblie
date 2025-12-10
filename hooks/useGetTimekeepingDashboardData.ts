import { dtoTimekeepingDashboard } from "@/models/schedule/dtoWorkingSchedule";
import { getTimekeepingDashboardData } from "@/services/timesheet/api";
import { formatTimekeepingNumbers } from "@/utils/numberUtils";
import { useQuery } from "@tanstack/react-query";

export const useGetTimekeepingDashboardData = (
  userId: string,
  month: number
) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoTimekeepingDashboard>({
      queryKey: ["timekeepingDashboard", userId, month],
      queryFn: async () => {
        const res = await getTimekeepingDashboardData(userId, month);
        return formatTimekeepingNumbers(res.data);
      },
      enabled: !!userId && !!month,
    });
  return {
    timekeepingDashboardData: data,
    isLoading,
    timekeepingDashboardError: error,
    refetch,
    isFetching,
  };
};
