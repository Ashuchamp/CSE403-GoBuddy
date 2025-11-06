import { Request, Response } from 'express';
import { ConnectionRequest, Connection, User } from '../models';
import { Op } from 'sequelize';

/**
 * Get all connection requests received by a user
 */
export const getReceivedRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const requests = await ConnectionRequest.findAll({
      where: {
        toUserId: userId,
        status: 'pending',
      },
      order: [['createdAt', 'DESC']],
    });

    // Fetch user details for each request
    const requestsWithUserDetails = await Promise.all(
      requests.map(async (request) => {
        const fromUser = await User.findByPk(request.fromUserId);
        return {
          id: request.id,
          from: fromUser,
          message: request.message,
          timestamp: request.createdAt,
          status: request.status,
        };
      })
    );

    res.json(requestsWithUserDetails);
  } catch (error) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({ error: 'Failed to fetch received requests' });
  }
};

/**
 * Get all connection requests sent by a user
 */
export const getSentRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const requests = await ConnectionRequest.findAll({
      where: {
        fromUserId: userId,
        status: 'pending',
      },
      order: [['createdAt', 'DESC']],
    });

    // Fetch user details for each request
    const requestsWithUserDetails = await Promise.all(
      requests.map(async (request) => {
        const [fromUser, toUser] = await Promise.all([
          User.findByPk(request.fromUserId),
          User.findByPk(request.toUserId),
        ]);
        return {
          id: request.id,
          from: fromUser,
          to: toUser,
          message: request.message,
          timestamp: request.createdAt,
          status: request.status,
        };
      })
    );

    res.json(requestsWithUserDetails);
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    res.status(500).json({ error: 'Failed to fetch sent requests' });
  }
};

/**
 * Get all connected users for a user
 */
export const getConnectedUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const connections = await Connection.findAll({
      where: {
        userId,
      },
      order: [['createdAt', 'DESC']],
    });

    // Fetch user details for each connection
    const connectedUsers = await Promise.all(
      connections.map(async (connection) => {
        return await User.findByPk(connection.connectedUserId);
      })
    );

    res.json(connectedUsers.filter(Boolean));
  } catch (error) {
    console.error('Error fetching connected users:', error);
    res.status(500).json({ error: 'Failed to fetch connected users' });
  }
};

/**
 * Send a connection request
 */
export const sendConnectionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fromUserId, toUserId, message } = req.body;

    // Check if request already exists
    const existingRequest = await ConnectionRequest.findOne({
      where: {
        fromUserId,
        toUserId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      res.status(400).json({ error: 'Connection request already sent' });
      return;
    }

    // Check if already connected
    const existingConnection = await Connection.findOne({
      where: {
        [Op.or]: [
          { userId: fromUserId, connectedUserId: toUserId },
          { userId: toUserId, connectedUserId: fromUserId },
        ],
      },
    });

    if (existingConnection) {
      res.status(400).json({ error: 'Users are already connected' });
      return;
    }

    const request = await ConnectionRequest.create({
      fromUserId,
      toUserId,
      message,
      status: 'pending',
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Error sending connection request:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
};

/**
 * Accept a connection request
 */
export const acceptConnectionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;

    const request = await ConnectionRequest.findByPk(requestId);
    if (!request) {
      res.status(404).json({ error: 'Connection request not found' });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({ error: 'Connection request is not pending' });
      return;
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Create bidirectional connections
    await Connection.bulkCreate([
      { userId: request.fromUserId, connectedUserId: request.toUserId },
      { userId: request.toUserId, connectedUserId: request.fromUserId },
    ]);

    res.json({ message: 'Connection request accepted' });
  } catch (error) {
    console.error('Error accepting connection request:', error);
    res.status(500).json({ error: 'Failed to accept connection request' });
  }
};

/**
 * Decline a connection request
 */
export const declineConnectionRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;

    const request = await ConnectionRequest.findByPk(requestId);
    if (!request) {
      res.status(404).json({ error: 'Connection request not found' });
      return;
    }

    if (request.status !== 'pending') {
      res.status(400).json({ error: 'Connection request is not pending' });
      return;
    }

    // Update request status
    request.status = 'declined';
    await request.save();

    res.json({ message: 'Connection request declined' });
  } catch (error) {
    console.error('Error declining connection request:', error);
    res.status(500).json({ error: 'Failed to decline connection request' });
  }
};

