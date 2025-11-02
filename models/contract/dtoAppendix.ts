export interface AllowanceInfo {
  allowanceId: string;
  allowanceName: string;
  allowanceCode: string;
  value: string;
}

export interface Appendix {
  id: string;
  createdAt: string;
  updatedAt: string;
  userContractId: string;
  positionId: string;
  contractTypeId: string;
  companyId: string;
  grossSalary: string;
  contractNumber: string;
  content: string;
  fileContract: string | null;
  startDate: string;
  endDate: string | null;
  duration: string;
  status:
    | "ACTIVE"
    | "INACTIVE"
    | "EXPIRED"
    | "DIRECTOR_SIGNED"
    | "USER_SIGNED"
    | "PENDING";
  allowanceInfors: AllowanceInfo[];
}

export interface AppendixListResponse {
  count?: number;
  limit?: number;
  page?: number;
  data: Appendix[];
}
