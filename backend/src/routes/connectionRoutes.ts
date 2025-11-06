import { Router } from 'express';
import {
  getReceivedRequests,
  getSentRequests,
  getConnectedUsers,
  sendConnectionRequest,
  acceptConnectionRequest,
  declineConnectionRequest,
} from '../controllers/connectionController';

const router = Router();

/**
 * @route   GET /api/connections/received/:userId
 * @desc    Get all connection requests received by a user
 */
router.get('/received/:userId', getReceivedRequests);

/**
 * @route   GET /api/connections/sent/:userId
 * @desc    Get all connection requests sent by a user
 */
router.get('/sent/:userId', getSentRequests);

/**
 * @route   GET /api/connections/connected/:userId
 * @desc    Get all connected users for a user
 */
router.get('/connected/:userId', getConnectedUsers);

/**
 * @route   POST /api/connections/send
 * @desc    Send a connection request
 */
router.post('/send', sendConnectionRequest);

/**
 * @route   PUT /api/connections/accept/:requestId
 * @desc    Accept a connection request
 */
router.put('/accept/:requestId', acceptConnectionRequest);

/**
 * @route   PUT /api/connections/decline/:requestId
 * @desc    Decline a connection request
 */
router.put('/decline/:requestId', declineConnectionRequest);

export default router;

