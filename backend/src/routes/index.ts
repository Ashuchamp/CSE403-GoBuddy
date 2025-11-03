import { Router } from 'express';
import userRoutes from './userRoutes';
import activityRoutes from './activityRoutes';
import activityRequestRoutes from './activityRequestRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/activities', activityRoutes);
router.use('/requests', activityRequestRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'GoBuddy API is running!' });
});

export default router;
