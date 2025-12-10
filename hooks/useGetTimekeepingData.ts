import { dtoTimekeeping } from "@/models/schedule/dtoWorkingSchedule";
import { getTimekeepingData } from "@/services/timesheet/api";
import { formatTimekeepingArray } from "@/utils/numberUtils";
import { useQuery } from "@tanstack/react-query";

interface UseGetTimekeepingDataParams {
  startTime: string;
  endTime: string;
  userId: string;
  enabled?: boolean;
}

export const useGetTimekeepingData = ({
  startTime,
  endTime,
  userId,
  enabled = true,
}: UseGetTimekeepingDataParams) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoTimekeeping>({
      queryKey: ["timekeeping", userId, startTime, endTime],
      queryFn: async () => {
        const res = await getTimekeepingData(startTime, endTime, userId);
        // Format the array of timekeeping data
        if (res.data && Array.isArray(res.data.data)) {
          return {
            ...res.data,
            data: formatTimekeepingArray(res.data.data),
          };
        }
        return res.data;
      },
      enabled: enabled && !!userId && !!startTime && !!endTime,
    });

  return {
    timekeepingData: data,
    isLoading,
    timekeepingError: error,
    refetch,
    isFetching,
  };
};
