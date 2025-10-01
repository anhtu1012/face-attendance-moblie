import { Pose } from "@/constants/face";

export const classify_pose = (
  yaw: number,
  pitch: number,
  yaw_thresh = 20,
  pitch_thresh = 15,
) => {
  if (yaw > yaw_thresh) return "right";
  else if (yaw < -yaw_thresh) return "left";
  else if (pitch > pitch_thresh) return "up";
  else if (pitch < -pitch_thresh) return "down";
  else return "front";
};
