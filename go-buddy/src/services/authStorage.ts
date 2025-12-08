/**
 * Auth Storage Service
 * Handles persistent storage of user authentication data using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

const AUTH_STORAGE_KEY = '@gobuddy:current_user';

export const authStorage = {
  /**
   * Save the current user to persistent storage
   */
  saveUser: async (user: User): Promise<void> => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to storage:', error);
      throw error;
    }
  },

  /**
   * Load the current user from persistent storage
   */
  loadUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (userJson) {
        return JSON.parse(userJson) as User;
      }
      return null;
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      return null;
    }
  },

  /**
   * Clear the current user from persistent storage
   */
  clearUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear user from storage:', error);
      throw error;
    }
  },
};

