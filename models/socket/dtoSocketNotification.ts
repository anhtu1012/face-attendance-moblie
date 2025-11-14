import { FormStatus } from "../form/dtoSubmittedForm";

export interface dtoSocketNotification {
  title: string;
  description: string;
  type: string;
  isRead: boolean;
  userId: string;
  createdBy: string;
}
