import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Lấy userProfile từ AsyncStorage và parse thành object
 * @returns Promise<object|null> userProfile hoặc null nếu không có
 */
export async function getUserProfileFromStorage() {
  try {
    const userProfileString = await AsyncStorage.getItem("userProfile");
    if (userProfileString) {
      console.log("userProfileString:", userProfileString);
      return JSON.parse(userProfileString);
    }
    return null;
  } catch (error) {
    console.error("Error getting userProfile from storage:", error);
    return null;
  }
}
