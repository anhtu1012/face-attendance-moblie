import { DailySalary } from "@/models/salary/dtoSalary";
import { useQuery } from "@tanstack/react-query";

// Mock data generator
const generateMockDailySalary = (
  userId: number,
  startTime: string,
  endTime: string
): DailySalary[] => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const dailyData: DailySalary[] = [];

  // Generate data for each day in the range
  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
    const dayOfMonth = currentDate.getDate();

    // Skip weekends (Saturday & Sunday) for most days
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      continue;
    }

    // Check if it's a holiday (simulate some holidays)
    const isHoliday = dayOfMonth === 1 || dayOfMonth === 2 || dayOfMonth === 30;

    // Check if has OT (every 3rd working day)
    const hasOT = dayOfMonth % 3 === 0;

    // Base work salary
    const baseWorkSalary = 800000;
    const workSalary = isHoliday ? baseWorkSalary * 2 : baseWorkSalary;

    // OT salary
    const otSalary = hasOT ? 150000 + (dayOfMonth % 5) * 50000 : 0;

    // Fine (random fines on some days)
    const totalFine = dayOfMonth === 15 || dayOfMonth === 22 ? 20000 : 0;

    // Total salary
    const totalSalary = workSalary + otSalary - totalFine;

    dailyData.push({
      date: currentDate.toISOString().split("T")[0],
      totalSalary,
      workSalary,
      otSalary,
      totalFine,
      hasOT,
      isHoliday,
    });
  }

  return dailyData;
};

export const useGetDailySalarySummary = (
  userId: number,
  startTime: string,
  endTime: string
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dailySalarySummary", userId, startTime, endTime],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Return mock data
      return {
        data: generateMockDailySalary(userId, startTime, endTime),
      };
    },
    enabled: !!userId && !!startTime && !!endTime,
  });

  return {
    data: data?.data,
    isLoading,
    error,
    refetch,
  };
};
