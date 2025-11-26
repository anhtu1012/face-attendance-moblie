import { dtoTimekeepingDashboard } from "@/models/schedule/dtoWorkingSchedule";
import { getTimekeepingDashboardData } from "@/services/timesheet/api";
import { useQuery } from "@tanstack/react-query";

export const useGetTimekeepingDashboardData = (
  userId: string,
  month: number,
) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoTimekeepingDashboard>({
      queryKey: ["timekeepingDashboard", userId, month],
      queryFn: async () => {
        const res = await getTimekeepingDashboardData(userId, month);
        return res.data;
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
