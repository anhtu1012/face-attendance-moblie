import { Pose } from "@/constants/face";
import { zip } from "react-native-zip-archive";
import { Directory, File, Paths } from "expo-file-system";
import { copyAsync, makeDirectoryAsync } from "expo-file-system/legacy";

export const printCurrentPose = (currentPose: number) => {
  if (currentPose == Pose.TOP) {
    return "top";
  } else if (currentPose == Pose.TOP_RIGHT) {
    return "top left";
  } else if (currentPose == Pose.TOP_LEFT) {
    return "top right";
  } else if (currentPose == Pose.RIGHT) {
    return "left";
  } else if (currentPose == Pose.LEFT) {
    return "right";
  } else if (currentPose == Pose.FRONT) {
    return "front";
  }
};

export const classifyPose = (yaw: number, pitch: number) => {
  // Check if currently look up
  if (pitch > 5) {
    if (yaw < -15) return Pose.TOP_RIGHT;
    else if (yaw > 15) return Pose.TOP_LEFT;
    else return Pose.TOP;
  }
  if (yaw < -15) return Pose.RIGHT;
  if (yaw > 15) return Pose.LEFT;
  else return Pose.FRONT;
};

export const renderpose = (poseNum: Pose) => {
  if (poseNum == Pose.TOP) {
    return "ngẫng đầu lên";
  } else if (poseNum == Pose.TOP_RIGHT) {
    return "ngẫng đầu lên bên phải";
  } else if (poseNum == Pose.TOP_LEFT) {
    return "ngẫng đầu lên bên trái";
  } else if (poseNum == Pose.RIGHT) {
    return "quay đầu sang phải";
  } else if (poseNum == Pose.LEFT) {
    return "quay đầu sang trái";
  } else if (poseNum == Pose.FRONT) {
    return "nhìn thẳng";
  }
};

export const createFacesZip = async (imagePaths: string[]): Promise<string> => {
  const tempDir = new Directory(Paths.cache, "faces_zip_temp");
  console.log("tempDir: ", tempDir.uri);

  const zipPath = new File(Paths.cache, tempDir.uri, "faces.zip");
  console.log("zipPath: ", zipPath.uri);

  await makeDirectoryAsync(zipPath.uri, { intermediates: true });

  // Copy all images into the tempDir
  for (const [index, imgPath] of imagePaths.entries()) {
    const newPath = `${tempDir.uri}/img-${index + 1}.jpg`;
    await copyAsync({ from: imgPath, to: newPath });
  }

  // Zip it
  const result = await zip(tempDir.uri, zipPath.uri);
  console.log("✅ Zipped to:", result);
  return result; // returns zip file URI
};
