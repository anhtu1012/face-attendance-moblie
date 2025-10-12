import { Pose } from "@/constants/face";
import { Face } from "react-native-vision-camera-face-detector";

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
