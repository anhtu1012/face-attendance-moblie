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

// Yearly Salary Report Types
export interface dtoYearlySalaryReport {
  count: number;
  limit: number;
  page: number;
  data: yearlySalaryData[];
}

export interface yearlySalaryData {
  date: string; // Format: "MM/YYYY"
  totalWorkHour: number;
  totalWorkDay: number;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  lateCount: number;
  totalFine: number;
  grossSalary: number;
  totalAllowance: number;
  userId: string;
  fullNameUser: string;
  departmentName: string;
}
