import {useState, useEffect, useCallback} from 'react';
import api from './api';
import {User, ActivityIntent, ActivityRequest} from '../types';

interface UseApiDataResult {
  users: User[];
  activities: ActivityIntent[];
  requests: ActivityRequest[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch all data from the API
 * Provides loading states and error handling
 */
export function useApiData(currentUserId?: string): UseApiDataResult {
  const [users, setUsers] = useState<User[]>([]);
  const [activities, setActivities] = useState<ActivityIntent[]>([]);
  const [requests, setRequests] = useState<ActivityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersData, activitiesData] = await Promise.all([
        api.users.getAll(),
        api.activities.getAll({status: 'active'}),
      ]);

      setUsers(usersData);
      setActivities(activitiesData);

      // Fetch requests for current user if available
      if (currentUserId) {
        const userRequests = await api.requests.getByUserId(currentUserId);
        setRequests(userRequests);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    users,
    activities,
    requests,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to manage activities with API integration
 */
export function useActivities(currentUser: User | null) {
  const [activities, setActivities] = useState<ActivityIntent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.activities.getAll();
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const createActivity = useCallback(
    async (activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>) => {
      if (!currentUser) return;

      try {
        const newActivity = await api.activities.create({
          ...activity,
          userId: currentUser.id,
          userName: currentUser.name,
        });

        if (newActivity) {
          setActivities((prev) => [newActivity, ...prev]);
        }
      } catch (error) {
        console.error('Failed to create activity:', error);
        throw error;
      }
    },
    [currentUser],
  );

  const updateActivity = useCallback(
    async (activityId: string, updates: Partial<ActivityIntent>) => {
      try {
        const updated = await api.activities.update(activityId, updates);
        if (updated) {
          setActivities((prev) =>
            prev.map((activity) => (activity.id === activityId ? updated : activity)),
          );
        }
      } catch (error) {
        console.error('Failed to update activity:', error);
        throw error;
      }
    },
    [],
  );

  const deleteActivity = useCallback(async (activityId: string) => {
    try {
      const success = await api.activities.delete(activityId);
      if (success) {
        setActivities((prev) => prev.filter((activity) => activity.id !== activityId));
      }
    } catch (error) {
      console.error('Failed to delete activity:', error);
      throw error;
    }
  }, []);

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}

/**
 * Hook to manage activity requests with API integration
 */
export function useActivityRequests(currentUser: User | null) {
  const [requests, setRequests] = useState<ActivityRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const data = await api.requests.getByUserId(currentUser.id);
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const joinActivity = useCallback(
    async (activityId: string) => {
      if (!currentUser) return;

      try {
        const newRequest = await api.requests.create({
          activityId,
          userId: currentUser.id,
          userName: currentUser.name,
          userBio: currentUser.bio,
          userSkills: [],
        });

        if (newRequest) {
          setRequests((prev) => [...prev, newRequest]);
        }
      } catch (error) {
        console.error('Failed to join activity:', error);
        throw error;
      }
    },
    [currentUser],
  );

  const approveRequest = useCallback(async (requestId: string) => {
    try {
      const updated = await api.requests.updateStatus(requestId, 'approved');
      if (updated) {
        setRequests((prev) =>
          prev.map((request) => (request.id === requestId ? updated : request)),
        );
      }
    } catch (error) {
      console.error('Failed to approve request:', error);
      throw error;
    }
  }, []);

  const declineRequest = useCallback(async (requestId: string) => {
    try {
      const updated = await api.requests.updateStatus(requestId, 'declined');
      if (updated) {
        setRequests((prev) =>
          prev.map((request) => (request.id === requestId ? updated : request)),
        );
      }
    } catch (error) {
      console.error('Failed to decline request:', error);
      throw error;
    }
  }, []);

  return {
    requests,
    loading,
    joinActivity,
    approveRequest,
    declineRequest,
    refetch: fetchRequests,
  };
}
