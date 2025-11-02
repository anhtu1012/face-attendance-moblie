import api from "@/config/axios";
import { dtoPutTimekeep } from "@/models/timesheet/dtoTimekeep";

export const timkeep = async (data: dtoPutTimekeep) => {
  return api.put("time-keeping/danh-sach-cham-cong", data);
};
