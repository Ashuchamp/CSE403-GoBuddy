/**
 * Example API Service for React Native App
 * 
 * Copy this file to your go-buddy/src/services/ directory
 * and use it to connect your mobile app to the backend.
 * 
 * Usage in your React Native components:
 * 
 * import api from './services/api';
 * 
 * // Get all users
 * const users = await api.users.getAll();
 * 
 * // Create activity
 * const activity = await api.activities.create({...});
 */

// Configure your backend URL
const API_BASE_URL = 'http://localhost:3000/api';

// For iOS simulator, use: http://localhost:3000/api
// For Android emulator, use: http://10.0.2.2:3000/api
// For physical device, use your computer's IP: http://192.168.1.X:3000/api

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

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // User endpoints
  users = {
    getAll: async () => {
      return this.request<ApiResponse<any[]>>('/users');
    },

    getById: async (id: string) => {
      return this.request<ApiResponse<any>>(`/users/${id}`);
    },

    create: async (userData: any) => {
      return this.request<ApiResponse<any>>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },

    update: async (id: string, updates: any) => {
      return this.request<ApiResponse<any>>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    delete: async (id: string) => {
      return this.request<ApiResponse<any>>(`/users/${id}`, {
        method: 'DELETE',
      });
    },

    googleAuth: async (googleData: {
      googleId: string;
      email: string;
      name: string;
      profilePicture?: string;
    }) => {
      return this.request<ApiResponse<any>>('/users/auth/google', {
        method: 'POST',
        body: JSON.stringify(googleData),
      });
    },
  };

  // Activity endpoints
  activities = {
    getAll: async (filters?: {
      status?: string;
      userId?: string;
      location?: string;
      search?: string;
    }) => {
      const params = new URLSearchParams(filters as any);
      const query = params.toString() ? `?${params.toString()}` : '';
      return this.request<ApiResponse<any[]>>(`/activities${query}`);
    },

    getById: async (id: string) => {
      return this.request<ApiResponse<any>>(`/activities/${id}`);
    },

    getByUserId: async (userId: string) => {
      return this.request<ApiResponse<any[]>>(`/activities/user/${userId}`);
    },

    create: async (activityData: any) => {
      return this.request<ApiResponse<any>>('/activities', {
        method: 'POST',
        body: JSON.stringify(activityData),
      });
    },

    update: async (id: string, updates: any) => {
      return this.request<ApiResponse<any>>(`/activities/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },

    updateStatus: async (id: string, status: 'active' | 'completed' | 'cancelled') => {
      return this.request<ApiResponse<any>>(`/activities/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    delete: async (id: string) => {
      return this.request<ApiResponse<any>>(`/activities/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Activity Request endpoints
  requests = {
    getByActivityId: async (activityId: string) => {
      return this.request<ApiResponse<any[]>>(`/requests/activity/${activityId}`);
    },

    getByUserId: async (userId: string) => {
      return this.request<ApiResponse<any[]>>(`/requests/user/${userId}`);
    },

    create: async (requestData: {
      activityId: string;
      userId: string;
      userName: string;
      userBio?: string;
      userSkills?: string[];
    }) => {
      return this.request<ApiResponse<any>>('/requests', {
        method: 'POST',
        body: JSON.stringify(requestData),
      });
    },

    updateStatus: async (id: string, status: 'approved' | 'declined') => {
      return this.request<ApiResponse<any>>(`/requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },

    delete: async (id: string) => {
      return this.request<ApiResponse<any>>(`/requests/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // Health check
  health = async () => {
    return this.request<ApiResponse<any>>('/health');
  };
}

// Export singleton instance
const api = new ApiService(API_BASE_URL);
export default api;

// Example usage in a React Native component:
/*

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import api from '../services/api';

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const response = await api.activities.getAll({ status: 'active' });
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const createActivity = async (activityData) => {
    try {
      const response = await api.activities.create(activityData);
      if (response.success) {
        console.log('Activity created:', response.data);
        loadActivities(); // Reload list
      }
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

*/
