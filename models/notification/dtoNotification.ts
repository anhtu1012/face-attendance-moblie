export type NotificationEnum = "NOTIFICATION" | "SUCCESS" | "DENY";

export interface NotificationType {
  id: string;
  title: string;
  description: string;
  type: NotificationEnum;
  isRead: boolean;
  userId: string;
  time: string;
}

export interface dtoNotification {
  count: number;
  limit: number;
  page: number;
  data: NotificationType[];
}
