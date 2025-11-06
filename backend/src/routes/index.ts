import { Router } from 'express';
import userRoutes from './userRoutes';
import activityRoutes from './activityRoutes';
import activityRequestRoutes from './activityRequestRoutes';
import connectionRoutes from './connectionRoutes';

const router = Router();

router.use('/users', userRoutes);
router.use('/activities', activityRoutes);
router.use('/requests', activityRequestRoutes);
router.use('/connections', connectionRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'GoBuddy API is running!' });
});

export default router;
