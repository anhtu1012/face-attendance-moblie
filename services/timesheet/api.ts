import api from "@/config/axios";
import { dtoPutTimekeep } from "@/models/timesheet/dtoTimekeep";

export const timkeep = async (data: dtoPutTimekeep, timekeepingId: string) => {
  return api.put(`time-keeping/cham-cong/${timekeepingId}`, data);
};

export const getDetailTimekeepingData = async (timekeepingId: string) => {
  return api.get(`time-keeping/thong-tin-cham-cong/${timekeepingId}`);
};

export const getCurrentTimekeepingData = async (userId: string) => {
  const today = new Date();
  const yesterday = new Date(today);

  // set yesterday
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);

  // set Today
  today.setUTCHours(0, 0, 0, 0);

  return api.get("time-keeping/danh-sach-cham-cong", {
    params: {
      startTime: yesterday.toISOString(),
      endTime: today.toISOString(),
      userId: userId,
    },
  });
};
