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
    },
  ];
  limit: number;
  page: number;
}

export interface dtoDetailTimekeeping {
  timeKeepingId: number;
  userId: number;
  date: string; // ISO date string "YYYY-MM-DD"
  checkinTime: string | null; // "HH:mm" or null if missing
  checkoutTime: string | null; // "HH:mm" or null if missing
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
  shiftInfo: ShiftInfo;
  otInfo?: OTInfo;
  checkinStatus?: CheckinStatus;
  checkoutStatus?: CheckoutStatus;
  isFromOt?: boolean; // default false
}
