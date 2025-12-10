// GET USER
export interface dtoGetUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
  userCode: string;
  roleId: string;
  fullName: string;
  email: string;
  gender: "M" | "F";
  phone: string;
  birthday: Date;
  faceImg: string | null;
  marriedStatus: "Đã kết hôn" | "Độc thân" | "Đã ly hôn";
  nation: string;
  bankingAccountNo: string;
  bankingAccountName: string;
  bankingName: string;
  militaryStatus:
    | "Hoàn thành nghĩa vụ quân sự"
    | "Chưa hoàn thành nghĩa vụ quân sự"
    | "Không có nghĩa vụ quân sự";
  citizenIdentityCard: string;
  identityCardImgFront: string | null;
  identityCardImgBack: string | null;
  issueDate: Date;
  issueAt: string;
  nationality: string;
  permanentAddress: string;
  currentAddress: string;
  status: string | null;
  isActive: boolean;
  userPushToken: string | null;
  isRegisterFace: boolean;
  dependent: dtoDependent[];
}
// UPDATE USER
export interface dtoUpdateUser {
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
  militaryStatus:
    | "Hoàn thành nghĩa vụ quân sự"
    | "Chưa hoàn thành nghĩa vụ quân sự"
    | "Không có nghĩa vụ quân sự";
  citizenIdentityCard: string; // Số CCCD/CMND
  issueDate: Date;
  issueAt: string; // Nơi cấp
  nationality: string; // Quốc tịch
  permanentAddress: string; // Nơi thường trú
  currentAddress: string; // Địa chỉ hiện tại
  userPushToken?: string | null; // Push notification token
  dependent: dtoDependent[];
}
// DEPENDENT
export interface dtoDependent {
  dpId: string; // ID của người phụ thuộc
  dpUserId: string; // ID của người dùng
  dpFullName: string; // Họ và tên
  dpPhone: string; // Số điện thoại
  dpCitizenIdentityCard: string; // Số CCCD/CMND
  dpIssueDate: Date; // Ngày cấp
  dpIssueAt: string; // Nơi cấp
  dpDependentDate: Date; // Ngày phụ thuộc
}
