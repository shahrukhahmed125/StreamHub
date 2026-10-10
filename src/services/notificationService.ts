import { Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

class NotificationService {
  private notifications: Notification[] = [...MOCK_NOTIFICATIONS];

  async getNotifications(): Promise<Notification[]> {
    return [...this.notifications];
  }

  async markAsRead(id: string): Promise<boolean> {
    const item = this.notifications.find(n => n.id === id);
    if (!item) return false;
    item.read = true;
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    this.notifications.forEach(n => {
      n.read = true;
    });
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    const initLen = this.notifications.length;
    this.notifications = this.notifications.filter(n => n.id !== id);
    return this.notifications.length < initLen;
  }
}

export const notificationService = new NotificationService();
