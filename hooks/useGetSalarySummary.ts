import { SalarySummary } from "@/models/salary/dtoSalary";
import { useQuery } from "@tanstack/react-query";

// Mock data generator
const generateMockSalarySummary = (
  userId: number,
  startTime: string,
  endTime: string
): SalarySummary => {
  // Simulate different data based on month
  const month = new Date(startTime).getMonth() + 1;
  const baseGrossSalary = 18000000;
  const variation = (month % 3) * 1000000;

  return {
    grossSalary: baseGrossSalary + variation,
    totalOtSalary: 1500000 + (month % 2) * 500000,
    totalAllowance: 500000 + (month % 4) * 100000,
    totalFine: month > 6 ? 50000 : 0,
    totalSalary:
      baseGrossSalary +
      variation +
      (1500000 + (month % 2) * 500000) +
      (500000 + (month % 4) * 100000) -
      (month > 6 ? 50000 : 0),
  };
};

export const useGetSalarySummary = (
  userId: number,
  startTime: string,
  endTime: string
) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["salarySummary", userId, startTime, endTime],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Return mock data
      return {
        data: generateMockSalarySummary(userId, startTime, endTime),
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
