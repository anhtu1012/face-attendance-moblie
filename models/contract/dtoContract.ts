export interface AllowanceInfo {
  allowanceId: string;
  allowanceName: string;
  allowanceCode: string;
  value: string;
}

export interface ContractDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  fullNameUser: string;
  manageByUserId: string;
  fullNameManager: string;
  departmentId: string;
  departmentName: string;
  positionId: string;
  positionName: string;
  contractTypeId: string;
  contractTypeName: string;
  companyId: string;
  grossSalary: string;
  contractNumber: string;
  fileContract: string;
  startDate: string;
  endDate: string | null;
  duration: string;
  status: "ACTIVE" | "INACTIVE" | "EXPIRED" | "DIRECTOR_SIGNED" | "USER_SIGNED";
  allowanceInfors: AllowanceInfo[];
}

export interface ContractListResponse {
  count: number;
  limit: number;
  page: number;
  data: ContractDetail[];
}
