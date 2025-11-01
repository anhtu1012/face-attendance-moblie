// Salary Summary Types
export interface SalarySummary {
  totalSalary: number;
  grossSalary: number;
  totalOtSalary: number;
  totalAllowance: number;
  totalFine: number;
}

// Daily Salary Types
export interface DailySalary {
  date: string;
  totalSalary: number;
  workSalary: number;
  otSalary: number;
  totalFine: number;
  hasOT: boolean;
  isHoliday: boolean;
}

export type DailySalarySummary = DailySalary[];
