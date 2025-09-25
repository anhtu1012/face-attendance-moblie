import api from "@/config/axios";

export const getTimeSchedule = (
  fromDate: Date,
  toDate: Date,
  userCode: string,
) => {
  return api.get("/business/lich-lam", {
    params: {
      fromDate,
      toDate,
      userCode,
    },
  });
};
