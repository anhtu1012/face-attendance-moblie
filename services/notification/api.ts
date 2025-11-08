import api from "@/config/axios";

export const getNotificationList = async (userId: string) => {
  return api.get("/time-keeping/thong-bao-nhan-vien", { params: { userId } });
};
