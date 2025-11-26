import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';

const router = Router();

router.get('/:userId', notificationController.getNotificationsByUserId);
router.get('/:userId/unread', notificationController.getUnreadCount);
router.patch('/:id/read', notificationController.markAsRead);

export default router;

