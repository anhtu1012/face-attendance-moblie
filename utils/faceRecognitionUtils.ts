import { Pose } from "@/constants/face";

export const classifyPose = (yaw: number, pitch: number) => {
  if (yaw < -15) return Pose.LEFT;
  if (yaw > 15) return Pose.RIGHT;
  if (pitch < -10) return Pose.DOWN;
  if (pitch > 10) return Pose.UP;
  else return Pose.FRONT;
};
