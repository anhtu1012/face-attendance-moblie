import * as Yup from "yup";

export const dependentValidationSchema = Yup.object().shape({
  dpFullName: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Họ và tên là bắt buộc")
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .matches(/^[\p{L}\s'-]+$/u, "Họ và tên chỉ được chứa chữ cái"),

  dpPhone: Yup.string().matches(
    /^$|^[0-9]{10,11}$/,
    "Số điện thoại không hợp lệ"
  ),

  dpCitizenIdentityCard: Yup.string()
    .matches(/^\d{9}$|^\d{12}$/, "Số CMND/CCCD phải gồm 9 hoặc 12 chữ số")
    .required("Số CMND/CCCD là bắt buộc"),

  dpIssueDate: Yup.date()
    .required("Ngày cấp là bắt buộc")
    .max(new Date(), "Ngày cấp không được trong tương lai"),

  dpIssueAt: Yup.string()
    .trim("Không được chứa khoảng trắng thừa")
    .required("Nơi cấp là bắt buộc")
    .min(2, "Nơi cấp phải có ít nhất 2 ký tự"),

  dependentDate: Yup.date()
    .required("Ngày phụ thuộc là bắt buộc")
    .max(new Date(), "Ngày phụ thuộc không được trong tương lai"),
});

export const dependentsArrayValidationSchema = Yup.object().shape({
  dependents: Yup.array()
    .of(dependentValidationSchema)
    .min(0, "Danh sách người phụ thuộc không được để trống")
    .max(10, "Không được có quá 10 người phụ thuộc"),
});
