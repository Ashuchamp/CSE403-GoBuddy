import { Request, Response } from 'express';
import { ActivityRequest, Activity, User, Notification } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { validateUserInput } from '../utils/profanityFilter';

export const activityRequestController = {
  // Get all requests for an activity
  getRequestsByActivityId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { activityId } = req.params;

      const requests = await ActivityRequest.findAll({
        where: { activityId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'email', 'profilePicture', 'bio', 'skills'],
          },
        ],
        order: [['createdAt', 'ASC']],
      });

      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Error fetching activity requests:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch activity requests' });
    }
  },

  // Get all requests by a user
  getRequestsByUserId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      const requests = await ActivityRequest.findAll({
        where: { userId },
        include: [
          {
            model: Activity,
            as: 'activity',
          },
        ],
        order: [['createdAt', 'DESC']],
      });

      res.json({ success: true, data: requests });
    } catch (error) {
      console.error('Error fetching user requests:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch user requests' });
    }
  },

  // Create a new join request
  createRequest: async (req: Request, res: Response): Promise<void> => {
    try {
      const { activityId, userId, userName, userBio, userSkills } = req.body;

      // Validate required fields
      if (!activityId || !userId || !userName) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
      }

      // Check for profanity in user-provided content
      const profanityCheck = validateUserInput({ 
        name: userName, 
        bio: userBio, 
        skills: userSkills 
      });
      if (!profanityCheck.isValid) {
        res.status(400).json({ 
          success: false, 
          error: 'Inappropriate content detected', 
          violatingFields: profanityCheck.violatingFields 
        });
        return;
      }

      // Check if activity exists
      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        res.status(404).json({ success: false, error: 'Activity not found' });
        return;
      }

      // Check if activity is active (cannot join cancelled or completed activities)
      if (activity.status !== 'active') {
        res.status(400).json({ 
          success: false, 
          error: `Cannot join activity. Activity is ${activity.status}.` 
        });
        return;
      }

      // Check if activity is full
      if (activity.currentPeople >= activity.maxPeople) {
        res.status(400).json({ success: false, error: 'Activity is full' });
        return;
      }

      // Check if user already requested
      const existingRequest = await ActivityRequest.findOne({
        where: { activityId, userId },
      });

      if (existingRequest) {
        // If the existing request was declined, allow re-request by updating it to pending
        if (existingRequest.status === 'declined') {
          // Check for profanity in updated content
          const profanityCheck = validateUserInput({ 
            name: userName, 
            bio: userBio, 
            skills: userSkills 
          });
          if (!profanityCheck.isValid) {
            res.status(400).json({ 
              success: false, 
              error: 'Inappropriate content detected', 
              violatingFields: profanityCheck.violatingFields 
            });
            return;
          }

          await existingRequest.update({
            userName,
            userBio: userBio || '',
            userSkills: userSkills || [],
            status: 'pending',
          });

          // Create notification for activity owner
          const activity = await Activity.findByPk(activityId);
          if (activity) {
            await Notification.create({
              id: uuidv4(),
              userId: activity.userId,
              message: `${userName} wants to join your activity "${activity.title}"`,
              isRead: false,
            });
          }

          res.status(200).json({ success: true, data: existingRequest });
          return;
        }
        // Otherwise, block duplicate requests (pending or approved)
        res.status(400).json({ success: false, error: 'Request already exists' });
        return;
      }

      const request = await ActivityRequest.create({
        id: uuidv4(),
        activityId,
        userId,
        userName,
        userBio: userBio || '',
        userSkills: userSkills || [],
        status: 'pending',
      });

      // Create notification for activity owner
      await Notification.create({
        id: uuidv4(),
        userId: activity.userId,
        message: `${userName} wants to join your activity "${activity.title}"`,
        isRead: false,
      });

      res.status(201).json({ success: true, data: request });
    } catch (error) {
      console.error('Error creating request:', error);
      res.status(500).json({ success: false, error: 'Failed to create request' });
    }
  },

  // Update request status (approve/decline)
  updateRequestStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['approved', 'declined'].includes(status)) {
        res.status(400).json({ success: false, error: 'Invalid status' });
        return;
      }

      const request = await ActivityRequest.findByPk(id);
      if (!request) {
        res.status(404).json({ success: false, error: 'Request not found' });
        return;
      }

      // If approving, check if activity is full
      if (status === 'approved') {
        const activity = await Activity.findByPk(request.activityId);
        if (!activity) {
          res.status(404).json({ success: false, error: 'Activity not found' });
          return;
        }

        if (activity.currentPeople >= activity.maxPeople) {
          res.status(400).json({ success: false, error: 'Activity is full' });
          return;
        }

        // Increment current people
        await activity.update({ currentPeople: activity.currentPeople + 1 });
      }

      await request.update({ status });
      res.json({ success: true, data: request });
    } catch (error) {
      console.error('Error updating request status:', error);
      res.status(500).json({ success: false, error: 'Failed to update request status' });
    }
  },

  // Delete a request
  deleteRequest: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const request = await ActivityRequest.findByPk(id);
      if (!request) {
        res.status(404).json({ success: false, error: 'Request not found' });
        return;
      }

      // If request was approved, decrement activity's current people
      if (request.status === 'approved') {
        const activity = await Activity.findByPk(request.activityId);
        if (activity && activity.currentPeople > 1) {
          await activity.update({ currentPeople: activity.currentPeople - 1 });
        }
      }

      await request.destroy();
      res.json({ success: true, message: 'Request deleted successfully' });
    } catch (error) {
      console.error('Error deleting request:', error);
      res.status(500).json({ success: false, error: 'Failed to delete request' });
    }
  },
};
