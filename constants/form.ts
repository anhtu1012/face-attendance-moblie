export enum formCategory {
  FACE_REGISTER = 1,
  ABSENT = 2,
  OT = 3,
  FORGET_TIMEKEEP = 4,
  QUIT_JOB = 5,
  END_EARLY = 6,
  OTHER = 7,
  TRANSFER_JOB = 8,
  LATE = 9,
}

export const formTypes = [
  {
    id: formCategory.ABSENT.toString(),
    title: "Đơn vắng mặt",
    description:
      "Đơn vắng mặt phát sinh sinh khi bạn muốn vắng một hoặc nhiều ngày làm việc",
    icon: "calendar",
    color: "#f3f2fa",
    iconColor: "#9C27B0",
  },
  {
    id: formCategory.OT.toString(),
    title: "Đơn tăng ca",
    description:
      "Đơn tăng ca phát sinh khi bạn có nhu cầu làm thêm một ca nào đó ngoài ca làm việc đã được phân",
    icon: "clock-circle",
    color: "#fbf2e9",
    iconColor: "#da822f",
  },
  {
    id: formCategory.FORGET_TIMEKEEP.toString(),
    title: "Đơn quên chấm công",
    description: "Đơn quên chấm công",
    icon: "car",
    color: "#e9f7f8",
    iconColor: "#2cb5d0",
  },
  {
    id: formCategory.FACE_REGISTER.toString(),
    title: "Đơn xác thực khuôn mặt",
    description: "Đơn xác thực khuôn mặt",
    icon: "car",
    color: "#ecf7f1",
    iconColor: "#4db47e",
  },
  {
    id: formCategory.QUIT_JOB.toString(),
    title: "Đơn thôi việc",
    description: "Đơn thôi việc",
    icon: "car",
    color: "#ffe9eb",
    iconColor: "#f63331",
  },
  {
    id: formCategory.END_EARLY.toString(),
    title: "Đơn về sớm",
    description: "Đơn về sớm",
    icon: "car",
    color: "#ffe9eb",
    iconColor: "#f63331",
  },
  {
    id: formCategory.OTHER.toString(),
    title: "Đơn khác",
    description: "Các loại đơn khác",
    icon: "file-text",
    color: "#e7e9ee",
    iconColor: "#ffffff",
  },
];
