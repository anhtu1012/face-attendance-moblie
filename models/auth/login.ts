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
    issueDate?: string | null;
    issueAt?: string | null;
    nationality?: string | null;
    dependent?: any[];
    permanentAddress?: string | null;
    currentAddress?: string | null;
    status?: string | null;
    isActive: boolean;
  };
  isAlreadyRegisteredFace: boolean;
  permissions: any[];
};
