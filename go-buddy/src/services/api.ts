/**
 * API Service for GoBuddy Backend
 * Handles all HTTP requests to the backend server
 */

import {User, ActivityIntent, ActivityRequest} from '../types';

// API Configuration
// For iOS simulator: use localhost
// For Android emulator: use 10.0.2.2
// For physical device: use your computer's IP address
// const getBaseUrl = () => {
//   // You can set this in .env or hardcode for now
//   const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
//   return API_URL;
// };

// const API_BASE_URL = getBaseUrl();
// BACKEND MODE: Connect to real backend with seeded data
const API_BASE_URL = 'http://10.0.0.90:3000/api';
// MOCK MODE: Use empty string to work without backend
// const API_BASE_URL = '';
// LOOK HERE TO CHANGE TO URL OF YOUR MACHINE

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      // API Response successful
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health Check
  health = async () => {
    return this.request<ApiResponse<{status: string}>>('/health');
  };

  // User endpoints
  users = {
    getAll: async (): Promise<User[]> => {
      const response = await this.request<ApiResponse<User[]>>('/users');
      return response.data || [];
    },

    getById: async (id: string): Promise<User | null> => {
      try {
        const response = await this.request<ApiResponse<User>>(`/users/${id}`);
        return response.data || null;
      } catch (error) {
        // Failed to get user
        return null;
      }
    },

    create: async (
      userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<User | null> => {
      try {
        const response = await this.request<ApiResponse<User>>('/users', {
          method: 'POST',
          body: JSON.stringify(userData),
        });
        return response.data || null;
      } catch (error) {
        // Failed to create user
        throw error;
      }
    },

    update: async (id: string, updates: Partial<User>): Promise<User | null> => {
      try {
        const response = await this.request<ApiResponse<User>>(`/users/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        return response.data || null;
      } catch (error) {
        // Failed to update user
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<{success: boolean}>>(`/users/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        // Failed to delete user
        return false;
      }
    },

    googleAuth: async (googleData: {
      googleId: string;
      email: string;
      name: string;
      profilePicture?: string;
    }): Promise<User | null> => {
      try {
        const response = await this.request<ApiResponse<User>>('/users/auth/google', {
          method: 'POST',
          body: JSON.stringify(googleData),
        });
        return response.data || null;
      } catch (error) {
        // Failed to authenticate with Google
        throw error;
      }
    },
  };

  // Activity endpoints
  activities = {
    getAll: async (filters?: {
      status?: string;
      userId?: string;
      location?: string;
      search?: string;
    }): Promise<ActivityIntent[]> => {
      try {
        const params = new URLSearchParams(filters as Record<string, string>);
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await this.request<ApiResponse<ActivityIntent[]>>(`/activities${query}`);
        return response.data || [];
      } catch (error) {
        // Failed to get activities
        return [];
      }
    },

    getById: async (id: string): Promise<ActivityIntent | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent>>(`/activities/${id}`);
        return response.data || null;
      } catch (error) {
        // Failed to get activity
        return null;
      }
    },

    getByUserId: async (userId: string): Promise<ActivityIntent[]> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent[]>>(
          `/activities/user/${userId}`,
        );
        return response.data || [];
      } catch (error) {
        // Failed to get activities for user
        return [];
      }
    },

    create: async (
      activityData: Omit<ActivityIntent, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<ActivityIntent | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent>>('/activities', {
          method: 'POST',
          body: JSON.stringify(activityData),
        });
        return response.data || null;
      } catch (error) {
        // Failed to create activity
        throw error;
      }
    },

    update: async (
      id: string,
      updates: Partial<ActivityIntent>,
    ): Promise<ActivityIntent | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent>>(`/activities/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates),
        });
        return response.data || null;
      } catch (error) {
        // Failed to update activity
        throw error;
      }
    },

    updateStatus: async (
      id: string,
      status: 'active' | 'completed' | 'cancelled',
    ): Promise<ActivityIntent | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent>>(
          `/activities/${id}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({status}),
          },
        );
        return response.data || null;
      } catch (error) {
        // Failed to update activity status
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<{success: boolean}>>(`/activities/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        // Failed to delete activity
        return false;
      }
    },
  };

  // Activity Request endpoints
  requests = {
    getByActivityId: async (activityId: string): Promise<ActivityRequest[]> => {
      try {
        const response = await this.request<ApiResponse<ActivityRequest[]>>(
          `/requests/activity/${activityId}`,
        );
        return response.data || [];
      } catch (error) {
        // Failed to get requests for activity
        return [];
      }
    },

    getByUserId: async (userId: string): Promise<ActivityRequest[]> => {
      try {
        const response = await this.request<ApiResponse<ActivityRequest[]>>(
          `/requests/user/${userId}`,
        );
        return response.data || [];
      } catch (error) {
        // Failed to get requests for user
        return [];
      }
    },

    getAll: async (): Promise<ActivityRequest[]> => {
      try {
        // We'll need to get all activities and their requests
        // For now, return empty array - this would need backend support
        return [];
      } catch (error) {
        // Failed to get all requests
        return [];
      }
    },

    create: async (requestData: {
      activityId: string;
      userId: string;
      userName: string;
      userBio?: string;
      userSkills?: string[];
    }): Promise<ActivityRequest | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityRequest>>('/requests', {
          method: 'POST',
          body: JSON.stringify(requestData),
        });
        return response.data || null;
      } catch (error) {
        // Failed to create request
        throw error;
      }
    },

    updateStatus: async (
      id: string,
      status: 'approved' | 'declined',
    ): Promise<ActivityRequest | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityRequest>>(
          `/requests/${id}/status`,
          {
            method: 'PATCH',
            body: JSON.stringify({status}),
          },
        );
        return response.data || null;
      } catch (error) {
        // Failed to update request status
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<{success: boolean}>>(`/requests/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        // Failed to delete request
        return false;
      }
    },
  };
}

// Export singleton instance
const api = new ApiService(API_BASE_URL);
export default api;
