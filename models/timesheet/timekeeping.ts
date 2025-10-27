export interface Timekeeping {
  timekeepingId: number;
  date: string;
  totalWorkHour: number;
  checkinTime: string;
  checkoutTime: string;
  hasOT: boolean;
  status: string;
}
export interface TimekeepingResponse {
  timekeepings: Timekeeping[];
}
export interface ShiftInfo {
  shiftStartTime: string; // "08:00"
  shiftEndTime: string; // "17:00"
  shiftWorkHour: number; // 8
  shiftTimekeepingNumber: number; // 1.0 (công)
}

export interface OTInfo {
  otStartTime: string; // "17:30"
  otEndTime: string; // "18:00"
  otWorkHour: number; // 0.5
  otTimekeepingNumber: number; // 0.5 (công)
}

export interface TimekeepingDetail {
  timeKeepingId: number; // 101
  userId: number; // 42
  date: string; // "2025-10-26"
  totalTimekeepingNumber: number; // 1.0 (công) + OT (công)
  checkinTime: string; // "08:03"
  checkoutTime: string; // "17:30"
  totalWorkHour: number; // 9.5 (bao gồm OT)
  shiftInfo: ShiftInfo;
  otInfo?: OTInfo; // Optional vì có thể không có OT
  checkinStatus: "ontime" | "late";
  checkoutStatus: "ontime" | "early";
}
