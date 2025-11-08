// Enums for Timekeeping Status
export enum TimekeepingStatus {
  PENDING = "PENDING",
  START_ONTIME = "START_ONTIME",
  START_LATE = "START_LATE",
  END_ONTIME = "END_ONTIME",
  END_EARLY = "END_EARLY",
  NOT_WORK = "NOT_WORK",
  FORGET_LOG = "FORGET_LOG",
}

// Enums for Check-in Status
export enum CheckinStatus {
  START_ONTIME = "START_ONTIME",
  START_LATE = "START_LATE",
}

// Enums for Check-out Status
export enum CheckoutStatus {
  END_ONTIME = "END_ONTIME",
  END_EARLY = "END_EARLY",
}

// Legacy status for backward compatibility (Calendar/Week views)
export enum LegacyTimekeepingStatus {
  PENDING = "PENDING",
  END_ONTIME = "END_ONTIME",
  NOT_WORK = "NOT_WORK",
  END_EARLY = "END_EARLY",
  FORGET_LOG = "FORGET_LOG",
}

export interface Timekeeping {
  timekeepingId: number;
  date: string;
  totalWorkHour: number;
  checkinTime: string;
  checkoutTime: string;
  hasOT: boolean;
  status: LegacyTimekeepingStatus | string; // Legacy for Calendar/Week
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
  otTimekeepingNumber: number; // 0.0625 (0.5 * 1/8)
}

export interface TimekeepingDetail {
  timeKeepingId: number; // 101
  userId: number; // 42
  date: string; // "2025-10-26"
  totalTimekeepingNumber: number; // 1.00625 (công + OT công)
  checkinTime: string; // "08:03"
  checkoutTime: string; // "17:30"
  totalWorkHour: number; // 9.5 (bao gồm OT)
  shiftInfo: ShiftInfo;
  otInfo?: OTInfo; // Optional vì có thể không có OT
  checkinStatus: CheckinStatus;
  checkoutStatus: CheckoutStatus;
  status: TimekeepingStatus;
  isFromOt?: boolean;
}
