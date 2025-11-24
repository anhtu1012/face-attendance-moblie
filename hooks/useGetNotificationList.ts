import { RootState } from "@/lib/store";
import { dtoNotification } from "@/models/notification/dtoNotification";
import { getNotificationList } from "@/services/notification/api";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export const useGetNotificationList = (enabled = true) => {
  let userId: string | undefined;

  try {
    userId = useSelector((state: RootState) => state.auth.userProfile.id);
  } catch (error) {
    console.warn("Redux store not available:", error);
    userId = undefined;
  }

  const { data, isLoading, error, refetch } = useQuery<dtoNotification>({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const res = await getNotificationList(userId || "");
      return res.data;
    },
    enabled: enabled && !!userId,
  });

  return {
    notificationList: data?.data,
    isLoading,
    error,
    refetch,
    userId,
  };
};
