export interface dtoUserInfor {
  id: string | bigint;
  code?: string;
  userName: string;
  password?: string;
  roleCode?: string;
  role?: string;
  roleName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  faceImg?: string | null;
  email: string;
  dob?: Date | null;
  birthDay?: Date | null;
  address?: string;
  currentAddress?: string | null;
  permanentAddress?: string | null;
  phone: string;
  gender: string;
  contract?: string;
  branchCode?: string;
  managedBy?: string;
  branchName?: string;
  createdAt?: Date | null;
  createdBy?: string;
  updatedAt?: Date | null;
  updatedBy?: string;
  isActive?: boolean;
  note?: string;
  // Additional fields from JWT token
  marriedStatus?: string | null;
  nation?: string | null;
  bankingAccountNo?: string | null;
  bankingAccountName?: string | null;
  bankingName?: string | null;
  militaryStatus?: string | null;
  citizenIdentityCard?: string | null;
  identityCardImgFront?: string | null;
  identityCardImgBack?: string | null;
  taxCode?: string | null;
  issueDate?: Date | null;
  issueAt?: string | null;
  nationality?: string | null;
  dependent?: any[];
  status?: string | null;
}

export interface dtoDependent {
  dpId: string; // ID người phụ thuộc
  dpUserId: string; // ID người được phụ thuộc
  dpFullName: string;
  dpPhone: string;
  dpTaxCode: string;
  dpCitizenIdentityCard: string;
  dpIssueDate: Date; // Ngày cấp
  dpIssueAt: string; // Nơi cấp
  dependentDate: Date;
}

export interface dtoUserOnboard {
  fullName: string;
  email: string;
  phone: string;
  gender: "M" | "F";
  birthday: Date;
  marriedStatus: "Đã kết hôn" | "Độc thân" | "Đã ly hôn";
  nation: string; // Dân tộc
  bankingAccountNo: string;
  bankingAccountName: string;
  bankingName: string;
  militaryStatus: "Hoàn thành nghĩa vụ quân sự" | "Chưa hoàn thành nghĩa vụ quân sự" | "Không có nghĩa vụ quân sự";
  citizenIdentityCard: string; // Số CCCD/CMND
  taxCode: string;
  issueDate: Date;
  issueAt: string; // Nơi cấp
  nationality: string; // Quốc tịch
  permanentAddress: string; // Nơi thường trú
  currentAddress: string; // Địa chỉ hiện tại
  dependent: dtoDependent[];
}
 export const sampleDtoUserOnboard: dtoUserOnboard = {
  fullName: "Nguyen Van A",
  email: "nguyenvana@gmail.com",
  phone: "0909090909",
  gender: "M",
  birthday: new Date("1990-01-01"),
  marriedStatus: "Đã kết hôn",
  nation: "Kinh",
  bankingAccountNo: "1234567890",
  bankingAccountName: "Nguyen Van A",
  bankingName: "Vietcombank",
  militaryStatus: "Hoàn thành nghĩa vụ quân sự",
  citizenIdentityCard: "1234567890",
  taxCode: "1234567890",
  issueDate: new Date("2020-01-01"),
  issueAt: "Ha Noi",
  nationality: "Vietnam",
  permanentAddress: "123 Nguyen Van Linh, Q9, TP.HCM",
  currentAddress: "123 Nguyen Van Linh, Q9, TP.HCM",
  dependent: [
    {
      dpId: "1",
      dpUserId: "1",
      dpFullName: "Nguyen Van B",
      dpPhone: "0909090909",
      dpTaxCode: "1234567890",
      dpCitizenIdentityCard: "1234567890",
      dpIssueDate: new Date("2020-01-01"),
      dpIssueAt: "Ha Noi",
      dependentDate: new Date("2020-01-01"),
    },
  ],
 }