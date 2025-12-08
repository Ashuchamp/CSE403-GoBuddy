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

      // Validate name is provided and not empty
      if (!name || name.trim() === '') {
        res.status(400).json({ 
          success: false, 
          error: 'Name is required and cannot be empty' 
        });
        return;
      }

      // Check for profanity in user input
      const profanityCheck = validateUserInput({ 
        name, 
        bio, 
        skills, 
        activityTags, 
        instagram, 
        campusLocation,
        contactEmail: req.body.contactEmail,
        preferredTimes,
      });
      if (!profanityCheck.isValid) {
        res.status(400).json({ 
          success: false, 
          error: 'Inappropriate content detected', 
          violatingFields: profanityCheck.violatingFields 
        });
        return;
      }

      // Validate that at least one contact method is provided
      const hasContactInfo = 
        (phone && phone.trim() !== '') ||
        (instagram && instagram.trim() !== '') ||
        (req.body.contactEmail && req.body.contactEmail.trim() !== '');

      if (!hasContactInfo) {
        res.status(400).json({ 
          success: false, 
          error: 'At least one contact method is required (phone, instagram, or contact email)' 
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
      
      // Debug log to verify backend is processing updates correctly
      console.log('[userController] Update request received for user:', id);
      console.log('[userController] Update fields:', Object.keys(updates));

      // Validate name is provided and not empty - this is the ONLY required field
      if (updates.name !== undefined && (!updates.name || updates.name.trim() === '')) {
        res.status(400).json({ 
          success: false, 
          error: 'Name is required and cannot be empty' 
        });
        return;
      }

      // Convert empty strings to null for optional fields BEFORE profanity check
      // This ensures profanity check only runs on actual content, not empty strings
      // Also prevents Sequelize validation errors on empty strings
      if (updates.phone !== undefined) {
        const phoneValue = updates.phone;
        updates.phone = phoneValue && typeof phoneValue === 'string' && phoneValue.trim() !== '' 
          ? phoneValue.trim() 
          : null;
      }
      if (updates.instagram !== undefined) {
        const instagramValue = updates.instagram;
        updates.instagram = instagramValue && typeof instagramValue === 'string' && instagramValue.trim() !== '' 
          ? instagramValue.trim() 
          : null;
      }
      if (updates.contactEmail !== undefined) {
        const emailValue = updates.contactEmail;
        console.log('[userController] contactEmail received:', emailValue, 'type:', typeof emailValue);
        // CRITICAL: Convert empty string to null to avoid any validation issues
        // Handle all possible empty cases
        if (emailValue === null || emailValue === undefined) {
          updates.contactEmail = null; // Explicitly set to null
          console.log('[userController] contactEmail set to null (was null/undefined)');
        } else if (typeof emailValue === 'string') {
          const trimmed = emailValue.trim();
          console.log('[userController] contactEmail trimmed:', trimmed, 'length:', trimmed.length);
          if (trimmed === '') {
            updates.contactEmail = null; // Empty string becomes null
            console.log('[userController] contactEmail set to null (empty string)');
          } else {
            // Validate email format only if a value is provided
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) {
              console.log('[userController] contactEmail failed validation:', trimmed);
              res.status(400).json({ 
                success: false, 
                error: 'Contact email must be a valid email address' 
              });
              return;
            }
            updates.contactEmail = trimmed;
            console.log('[userController] contactEmail validated and set:', trimmed);
          }
        } else {
          updates.contactEmail = null; // Fallback: set to null for any other type
          console.log('[userController] contactEmail set to null (fallback, was type:', typeof emailValue, ')');
        }
      }
      if (updates.campusLocation !== undefined) {
        const locationValue = updates.campusLocation;
        updates.campusLocation = locationValue && typeof locationValue === 'string' && locationValue.trim() !== '' 
          ? locationValue.trim() 
          : null;
      }
      if (updates.bio !== undefined && typeof updates.bio === 'string') {
        updates.bio = updates.bio.trim() || '';
      }
      
      // Ensure arrays are properly formatted
      if (updates.skills !== undefined && !Array.isArray(updates.skills)) {
        updates.skills = [];
      }
      if (updates.activityTags !== undefined && !Array.isArray(updates.activityTags)) {
        updates.activityTags = [];
      }
      if (updates.preferredTimes !== undefined && !Array.isArray(updates.preferredTimes)) {
        updates.preferredTimes = [];
      }

      // Check for profanity in update fields (after cleaning empty strings)
      // Profanity check will skip null/undefined/empty values automatically
      const profanityCheck = validateUserInput({
        name: updates.name,
        bio: updates.bio,
        skills: updates.skills,
        activityTags: updates.activityTags,
        instagram: updates.instagram,
        campusLocation: updates.campusLocation,
        contactEmail: updates.contactEmail,
        preferredTimes: updates.preferredTimes,
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

      // Allow users to update profile without requiring contact info
      // Contact info validation is only enforced when joining activities or connecting
      try {
        // Log updates for debugging
        console.log('Updating user fields:', Object.keys(updates));
        if (updates.contactEmail !== undefined) {
          console.log('contactEmail value to set:', updates.contactEmail === null ? 'null' : updates.contactEmail);
          console.log('Current user contactEmail:', user.contactEmail);
        }
        
        // Use set method to explicitly set values, including null
        // This ensures null values are properly saved to the database
        for (const [key, value] of Object.entries(updates)) {
          (user as any).set(key, value);
        }
        
        // Save the changes
        await user.save();
        
        // Reload user to get updated data from database
        await user.reload();
        
        if (updates.contactEmail !== undefined) {
          console.log('contactEmail after save and reload:', user.contactEmail === null ? 'null' : user.contactEmail);
        }
        
        res.json({ success: true, data: user });
      } catch (updateError) {
        // Log the actual Sequelize/database error for debugging
        console.error('Sequelize update error:', updateError);
        if (updateError instanceof Error) {
          console.error('Error name:', updateError.name);
          console.error('Error message:', updateError.message);
          if ('errors' in updateError) {
            console.error('Validation errors:', (updateError as any).errors);
          }
        }
        throw updateError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error('Error updating user:', error);
      // Provide more specific error message
      let errorMessage = 'Failed to update user';
      if (error instanceof Error) {
        errorMessage = error.message;
        // If it's a Sequelize validation error, extract the first validation error message
        if (error.name === 'SequelizeValidationError' && 'errors' in error) {
          const validationErrors = (error as any).errors;
          if (validationErrors && validationErrors.length > 0) {
            errorMessage = validationErrors[0].message || errorMessage;
          }
        }
      }
      res.status(500).json({ 
        success: false, 
        error: errorMessage 
      });
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
