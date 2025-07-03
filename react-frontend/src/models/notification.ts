export interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  createdAt: Date;
  readStatus: boolean;
  location: string;
  actionUrl: string;
}