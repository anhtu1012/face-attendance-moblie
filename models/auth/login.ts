export interface LoginFormValues {
  username: string;
  password: string;
}

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userProfile: {
    id: string;
    userName: string;
    roleName: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    birthDay: string;
    faceImg?: string | null;
    citizenIdentityCard?: string | null;
    taxCode?: string | null;
    issueDate?: string | null;
    issueAt?: string | null;
    nationality?: string | null;
    dependent?: string | null;
    permanentAddress?: string | null;
    currentAddress?: string | null;
    status?: string | null;
    isActive: boolean;
  };
  permissions: any[];
};
