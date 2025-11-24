import { Request, Response } from 'express';
import { User } from '../models';
import { v4 as uuidv4 } from 'uuid';
import { validateUserInput } from '../utils/profanityFilter';

export const userController = {
  // Get all users
  getAllUsers: async (_req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['googleId'] },
      });
      res.json({ success: true, data: users });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch users' });
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['googleId'] },
      });

      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch user' });
    }
  },

  // Create a new user
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, name, bio, skills, preferredTimes, activityTags, phone, instagram, campusLocation, googleId, profilePicture } = req.body;

      // Check for profanity in user input
      const profanityCheck = validateUserInput({ name, bio, skills, activityTags, instagram, campusLocation });
      if (!profanityCheck.isValid) {
        res.status(400).json({ 
          success: false, 
          error: 'Inappropriate content detected', 
          violatingFields: profanityCheck.violatingFields 
        });
        return;
      }

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ success: false, error: 'User with this email already exists' });
        return;
      }

      const user = await User.create({
        id: uuidv4(),
        email,
        name,
        bio: bio || '',
        skills: skills || [],
        preferredTimes: preferredTimes || [],
        activityTags: activityTags || [],
        phone,
        instagram,
        campusLocation,
        googleId,
        profilePicture,
      });

      res.status(201).json({ success: true, data: user });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ success: false, error: 'Failed to create user' });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Check for profanity in update fields
      const profanityCheck = validateUserInput({
        name: updates.name,
        bio: updates.bio,
        skills: updates.skills,
        activityTags: updates.activityTags,
        instagram: updates.instagram,
        campusLocation: updates.campusLocation,
      });
      if (!profanityCheck.isValid) {
        res.status(400).json({ 
          success: false, 
          error: 'Inappropriate content detected', 
          violatingFields: profanityCheck.violatingFields 
        });
        return;
      }

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      // Don't allow updating email or googleId
      delete updates.email;
      delete updates.googleId;

      await user.update(updates);
      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ success: false, error: 'Failed to update user' });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      await user.destroy();
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
  },

  // Get or create user by Google ID
  getOrCreateByGoogleId: async (req: Request, res: Response): Promise<void> => {
    try {
      const { googleId, email, name, profilePicture } = req.body;

      if (!googleId || !email || !name) {
        res.status(400).json({ success: false, error: 'Missing required fields' });
        return;
      }

      let user = await User.findOne({ where: { googleId } });

      if (!user) {
        // Try to find by email
        user = await User.findOne({ where: { email } });
        
        if (user) {
          // Update existing user with Google ID
          await user.update({ googleId, profilePicture });
        } else {
          // Create new user
          user = await User.create({
            id: uuidv4(),
            googleId,
            email,
            name,
            profilePicture,
            bio: '',
            skills: [],
            preferredTimes: [],
            activityTags: [],
          });
        }
      }

      res.json({ success: true, data: user });
    } catch (error) {
      console.error('Error in getOrCreateByGoogleId:', error);
      res.status(500).json({ success: false, error: 'Failed to authenticate user' });
    }
  },
};
