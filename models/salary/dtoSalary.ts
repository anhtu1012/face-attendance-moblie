// Salary Summary Types
export interface dtoSalarySummary {
  totalSalary: number;
  grossSalary: number;
  totalDailySalary: number;
  totalOtSalary: number;
  totalAllowance: number;
  totalFine: number;
}

// Daily Salary Types
export interface dtoDailySalary {
  count: number;
  limit: number;
  page: number;
  data: dailySalaryData[];
}

export interface dailySalaryData {
  date: string;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  hasOT: boolean;
  totalFine: number;
  isHoliday: boolean;
}
