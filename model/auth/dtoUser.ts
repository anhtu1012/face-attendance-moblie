export interface dtoUserInfor {
  id: string | bigint;
  code: string;
  userName: string;
  password?: string;
  roleCode: string;
  role: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  faceImg: string;
  email: string;
  dob: string | Date;
  address: string;
  phone: string;
  contract: string;
  branchCode: string;
  managedBy: string;
  branchName: string;
  createdAt?: string | Date;
  createdBy: string;
  updatedAt?: string | Date;
  updatedBy?: string;
  isActive?: boolean;
  note?: string;
}
