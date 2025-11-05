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

// For iOS Simulator: use localhost
// For Android Emulator: use 10.0.2.2
// For Physical Device: use your computer's actual IP (run: ipconfig getifaddr en0)
const API_BASE_URL = 'http://localhost:3000/api';
// Change to your machine's IP if testing on physical device

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

    // Add timeout to prevent hanging
    const timeout = 10000; // 10 seconds
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`API Request: ${config.method || 'GET'} ${url}`);
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      console.log(`API Response: ${config.method || 'GET'} ${url} - Success`);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('API request timed out:', url);
        throw new Error('Request timed out. Please check if the backend is running.');
      }
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health Check
  health = async () => {
    return this.request<ApiResponse<any>>('/health');
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
        console.error(`Failed to get user ${id}:`, error);
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
        console.error('Failed to create user:', error);
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
        console.error(`Failed to update user ${id}:`, error);
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<any>>(`/users/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        console.error(`Failed to delete user ${id}:`, error);
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
        console.error('Failed to authenticate with Google:', error);
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
        const params = new URLSearchParams(filters as any);
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await this.request<ApiResponse<ActivityIntent[]>>(`/activities${query}`);
        return response.data || [];
      } catch (error) {
        console.error('Failed to get activities:', error);
        return [];
      }
    },

    getById: async (id: string): Promise<ActivityIntent | null> => {
      try {
        const response = await this.request<ApiResponse<ActivityIntent>>(`/activities/${id}`);
        return response.data || null;
      } catch (error) {
        console.error(`Failed to get activity ${id}:`, error);
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
        console.error(`Failed to get activities for user ${userId}:`, error);
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
        console.error('Failed to create activity:', error);
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
        console.error(`Failed to update activity ${id}:`, error);
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
        console.error(`Failed to update activity status ${id}:`, error);
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<any>>(`/activities/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        console.error(`Failed to delete activity ${id}:`, error);
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
        console.error(`Failed to get requests for activity ${activityId}:`, error);
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
        console.error(`Failed to get requests for user ${userId}:`, error);
        return [];
      }
    },

    getAll: async (): Promise<ActivityRequest[]> => {
      try {
        // We'll need to get all activities and their requests
        // For now, return empty array - this would need backend support
        return [];
      } catch (error) {
        console.error('Failed to get all requests:', error);
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
        console.error('Failed to create request:', error);
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
        console.error(`Failed to update request status ${id}:`, error);
        throw error;
      }
    },

    delete: async (id: string): Promise<boolean> => {
      try {
        await this.request<ApiResponse<any>>(`/requests/${id}`, {
          method: 'DELETE',
        });
        return true;
      } catch (error) {
        console.error(`Failed to delete request ${id}:`, error);
        return false;
      }
    },
  };
}

// Export singleton instance
const api = new ApiService(API_BASE_URL);
export default api;
