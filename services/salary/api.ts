import axios from "@/config/axios";

// Get salary summary for a period
export const getSalarySummary = async (userId: string, month: number) => {
  return await axios.get(`/time-keeping/luong-hang-ngay`, {
    params: {
      userId,
      month,
    },
  });
};

// Get daily salary breakdown
export const getDailySalarySummary = async (
  userId: string,
  fromDate: string,
  toDate: string
) => {
  return await axios.get(`/time-keeping/tong-ket-luong`, {
    params: {
      userId,
      fromDate,
      toDate,
    },
  });
};

// Get yearly salary report
export const getYearlySalaryReport = async (year: number, userId: string) => {
  return await axios.get(`/report/bao-cao-luong`, {
    params: {
      year,
      userId,
    },
  });
};
