import { Request, Response } from 'express';
import { Notification } from '../models';

export const notificationController = {
  // Get all notifications for a user
  getNotificationsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const notifications = await Notification.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });

      res.json({ success: true, data: notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
  },

  // Get unread count for a user
  getUnreadCount: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const count = await Notification.count({
        where: { userId, isRead: false },
      });

      res.json({ success: true, data: { unreadCount: count } });
    } catch (error) {
      console.error('Error fetching unread count:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch unread count' });
    }
  },

  // Mark notification as read
  markAsRead: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const notification = await Notification.findByPk(id);
      if (!notification) {
        res.status(404).json({ success: false, error: 'Notification not found' });
        return;
      }

      await notification.update({ isRead: true });
      res.json({ success: true, data: notification });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
  },
};

