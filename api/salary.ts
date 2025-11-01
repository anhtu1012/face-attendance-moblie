import axios from "@/config/axios";
import { DailySalarySummary, SalarySummary } from "@/models/salary/dtoSalary";

// Get salary summary for a period
export const getSalarySummary = async (
  userId: number,
  startTime: string,
  endTime: string
): Promise<{ data: SalarySummary }> => {
  const response = await axios.get(`/salaries`, {
    params: {
      userId,
      startTime,
      endTime,
    },
  });
  return response.data;
};

// Get daily salary breakdown
export const getDailySalarySummary = async (
  userId: number,
  startTime: string,
  endTime: string
): Promise<{ data: DailySalarySummary }> => {
  const response = await axios.get(`/salaries/daily`, {
    params: {
      userId,
      startTime,
      endTime,
    },
  });
  return response.data;
};
