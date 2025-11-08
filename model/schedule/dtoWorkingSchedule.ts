import {
  CheckinStatus,
  CheckoutStatus,
  OTInfo,
  ShiftInfo,
} from "@/models/timesheet/timekeeping";

export interface dtoTimekeeping {
  count: number;
  data: [
    {
      timekeepingId: string;
      date: string; // e.g. "2025-11-02"
      checkinTime: string | null;
      checkoutTime: string | null;
      totalWorkHour: number;
      hasOT: boolean;
      status: string;
    }
  ];
  limit: number;
  page: number;
}

export interface dtoDetailTimekeeping {
  timeKeepingId: number;
  userId: number;
  date: string; // ISO date string "YYYY-MM-DD"
  checkinTime: string | null; // "HH:mm" or null if missing
  checkOutTime: string | null; // "HH:mm" or null if missing
  status:
    | "PENDING"
    | "START_ONTIME"
    | "START_LATE"
    | "END_ONTIME"
    | "END_EARLY"
    | "NOT_WORK"
    | "FORGET_LOG";
  totalTimekeepingNumber: number; // e.g. 1.00625
  totalWorkHour: number; // Includes OT
  shiftInfor: ShiftInfo;
  otInfo?: OTInfo;
  checkInStatus?: CheckinStatus;
  checkOutStatus?: CheckoutStatus;
  isFromOt?: boolean; // default false
}
export interface dtoTimekeepingDashboard {
  actualTimekeeping: number;
  monthStandardTimekeeping: number;
  actualHour: number;
  monthStandardHour: number;
  lateNumber: number;
  earlyNumber: number;
  offWorkNumber: number;
  forgetLogNumber: number;
  normalOtTimekeeping: number;
  normalOtHour: number;
  offDayOtTimekeeping: number;
  offDayOtHour: number;
  holidayOtTimekeeping: number;
  holidayOtHour: number;
  lateFine: number;
  forgetLogFine: number;
}
