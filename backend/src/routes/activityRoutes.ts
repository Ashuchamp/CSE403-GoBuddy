import { Router } from 'express';
import { activityController } from '../controllers/activityController';

const router = Router();

// Activity routes
router.get('/', activityController.getAllActivities);
router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.patch('/:id/status', activityController.updateActivityStatus);
router.get('/user/:userId', activityController.getActivitiesByUserId);

export default router;
