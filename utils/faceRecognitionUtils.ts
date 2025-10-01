import { Pose } from "@/constants/face";

export const classifyPose = (
  yaw: number,
  pitch: number,
  yaw_thresh = 20,
  pitch_thresh = 15,
) => {
  if (yaw > yaw_thresh) return Pose.RIGHT;
  else if (yaw < -yaw_thresh) return Pose.LEFT;
  else if (pitch > pitch_thresh) return Pose.UP;
  else if (pitch < -pitch_thresh) return Pose.DOWN;
  else return Pose.FRONT;
};
