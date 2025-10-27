export interface Timekeeping {
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
