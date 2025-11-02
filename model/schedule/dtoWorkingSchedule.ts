import { CheckinStatus, CheckoutStatus } from "@/models/timesheet/timekeeping";

export interface WorkingSchedule {
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

  shiftInfo: {
    shiftStartTime: string; // "HH:mm"
    shiftEndTime: string; // "HH:mm"
    shiftWorkHour: number; // e.g. 8
    shiftTimekeepingNumber: number; // e.g. 1.0
  };

  otInfo?: {
    otStartTime: string;
    otEndTime: string;
    otWorkHour: number;
    otTimekeepingNumber: number; // e.g. 0.0625
  };

  checkinStatus?: CheckinStatus;
  checkoutStatus?: CheckoutStatus;
  isFromOt?: boolean; // default false
}
