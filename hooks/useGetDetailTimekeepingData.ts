import { dtoDetailTimekeeping } from "@/models/schedule/dtoWorkingSchedule";
import { getDetailTimekeepingData } from "@/services/timesheet/api";
import { formatTimekeepingNumbers } from "@/utils/numberUtils";
import { useQuery } from "@tanstack/react-query";

interface UseGetDetailTimekeepingDataParams {
  timekeepingId: string;
  enabled?: boolean;
}

export const useGetDetailTimekeepingData = ({
  timekeepingId,
  enabled = true,
}: UseGetDetailTimekeepingDataParams) => {
  const { data, isLoading, error, refetch, isFetching } =
    useQuery<dtoDetailTimekeeping>({
      queryKey: ["timekeepingDetail", timekeepingId],
      queryFn: async () => {
        const response = await getDetailTimekeepingData(timekeepingId);
        return formatTimekeepingNumbers(response.data);
      },
      enabled: enabled && !!timekeepingId,
    });

  return {
    detailTimekeepingData: data,
    isLoading,
    detailTimekeepingError: error,
    refetch,
    isFetching,
  };
};
