import { Router } from 'express';
import { activityController } from '../controllers/activityController';

const router = Router();

// Activity routes
router.get('/', activityController.getAllActivities);
router.get('/recommendations/:userId', activityController.getRecommendations);
router.get('/user/:userId', activityController.getActivitiesByUserId);
router.get('/:id', activityController.getActivityById);
router.post('/', activityController.createActivity);
router.put('/:id', activityController.updateActivity);
router.delete('/:id', activityController.deleteActivity);
router.patch('/:id/status', activityController.updateActivityStatus);

export default router;
