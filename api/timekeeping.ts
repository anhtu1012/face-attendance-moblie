import axios from "./axios";
import { TimekeepingResponse } from "@/models/timesheet/timekeeping";
export const getTimekeepings = async (startDate: Date, endDate: Date, userId: number): Promise<TimekeepingResponse[]> => {
  const response = await axios.get<TimekeepingResponse[]>(`/timekeepings`, {
    params: {
      startDate,
      endDate,
      userId,
    },
  });
  return response.data;
};