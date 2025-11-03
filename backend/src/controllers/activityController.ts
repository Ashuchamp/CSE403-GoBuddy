import { Request, Response } from 'express';
import { Activity, User } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';

export const activityController = {
  // Get all activities
  getAllActivities: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, userId, location, search } = req.query;
      
      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (userId) {
        where.userId = userId;
      }
      
      if (location) {
        where.campusLocation = location;
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const activities = await Activity.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });

      res.json({ success: true, data: activities });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch activities' });
    }
  },

  // Get activity by ID
  getActivityById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const activity = await Activity.findByPk(id, {
        include: [
          {
            model: User,
            as: 'creator',
            attributes: ['id', 'name', 'email', 'profilePicture'],
          },
        ],
      });

      if (!activity) {
        res.status(404).json({ success: false, error: 'Activity not found' });
        return;
      }

      res.json({ success: true, data: activity });
    } catch (error) {
      console.error('Error fetching activity:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch activity' });
    }
  },

  // Create a new activity
  createActivity: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, userName, title, description, maxPeople, scheduledTimes, campusLocation } = req.body;

      // Validate required fields
      if (!userId || !userName || !title || !description || !maxPeople || !scheduledTimes) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
      }

      // Verify user exists
      const user = await User.findByPk(userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const activity = await Activity.create({
        id: uuidv4(),
        userId,
        userName,
        title,
        description,
        maxPeople,
        currentPeople: 1,
        scheduledTimes,
        campusLocation,
        status: 'active',
      });

      res.status(201).json({ success: true, data: activity });
    } catch (error) {
      console.error('Error creating activity:', error);
      res.status(500).json({ success: false, error: 'Failed to create activity' });
    }
  },

  // Update activity
  updateActivity: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const activity = await Activity.findByPk(id);
      if (!activity) {
        res.status(404).json({ success: false, error: 'Activity not found' });
        return;
      }

      // Don't allow updating userId or userName
      delete updates.userId;
      delete updates.userName;
      delete updates.id;

      await activity.update(updates);
      res.json({ success: true, data: activity });
    } catch (error) {
      console.error('Error updating activity:', error);
      res.status(500).json({ success: false, error: 'Failed to update activity' });
    }
  },

  // Delete activity
  deleteActivity: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const activity = await Activity.findByPk(id);
      if (!activity) {
        res.status(404).json({ success: false, error: 'Activity not found' });
        return;
      }

      await activity.destroy();
      res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ success: false, error: 'Failed to delete activity' });
    }
  },

  // Update activity status
  updateActivityStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'completed', 'cancelled'].includes(status)) {
        res.status(400).json({ success: false, error: 'Invalid status' });
        return;
      }

      const activity = await Activity.findByPk(id);
      if (!activity) {
        res.status(404).json({ success: false, error: 'Activity not found' });
        return;
      }

      await activity.update({ status });
      res.json({ success: true, data: activity });
    } catch (error) {
      console.error('Error updating activity status:', error);
      res.status(500).json({ success: false, error: 'Failed to update activity status' });
    }
  },

  // Get activities by user ID
  getActivitiesByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const activities = await Activity.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
      });

      res.json({ success: true, data: activities });
    } catch (error) {
      console.error('Error fetching user activities:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch user activities' });
    }
  },
};
