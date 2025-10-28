import { Pose } from "@/constants/face";

export const initialPoseData = [0, 1, 2, 3, 4, 5];

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
  const pitch_threshold = 5;
  const yaw_threshold = 15;
  if (pitch > pitch_threshold) {
    if (yaw < -yaw_threshold) return Pose.TOP_RIGHT;
    else if (yaw > yaw_threshold) return Pose.TOP_LEFT;
    else return Pose.TOP;
  }
  if (yaw < -yaw_threshold) return Pose.RIGHT;
  if (yaw > yaw_threshold) return Pose.LEFT;
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
