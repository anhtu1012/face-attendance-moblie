export interface WorkingSchedule {
  id: string;
  createdAt: string;
  updatedAt: string;
  timeKeepingId: string | null;
  code: string;
  userCode: string;
  userContractCode: string;
  status: string;
  date: string;
  fullName: string;
  shiftCode: string;
  shiftName: string;
  branchName: string;
  branchCode: string;
  addressLine: string;
  startShiftTime: string;
  endShiftTime: string;
  workingHours: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  statusTimeKeeping: string | null;
  positionName: string;
  managerFullName: string;
}
