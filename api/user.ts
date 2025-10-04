import { dtoUserOnboard } from "@/models/auth/dtoUser";
import { getUserProfileFromStorage } from "@/utils/userProfileUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const updateUser = async (
  userId: string | bigint,
  onboardData: dtoUserOnboard
) => {
  const USER_PROFILE = await getUserProfileFromStorage();
  const token = await AsyncStorage.getItem("token");
  console.log("USER_PROFILE in updateUser:", USER_PROFILE);
  console.log("Updating user with ID:", userId);
  console.log("Token:", token);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.put(
    `${BASE_URL}/sa/user/${userId}`,
    onboardData,
    { headers }
  );
  return response.data;
};
