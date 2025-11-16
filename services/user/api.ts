import api from "@/config/axios";

export const updateUserPassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string,
) => {
  return await api.put(`/sa/user/password-staff/${userId}`, {
    password: newPassword,
    oldPassword: oldPassword,
  });
};
