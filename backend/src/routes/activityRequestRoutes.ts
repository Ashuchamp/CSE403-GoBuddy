import { Router } from 'express';
import { activityRequestController } from '../controllers/activityRequestController';

const router = Router();

// Activity request routes
router.get('/activity/:activityId', activityRequestController.getRequestsByActivityId);
router.get('/user/:userId', activityRequestController.getRequestsByUserId);
router.post('/', activityRequestController.createRequest);
router.patch('/:id/status', activityRequestController.updateRequestStatus);
router.delete('/:id', activityRequestController.deleteRequest);

export default router;
