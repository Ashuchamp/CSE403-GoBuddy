import React, {useState, useEffect, useRef} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {User, ActivityIntent, ActivityRequest} from './src/types';
import {AuthScreen} from './src/screens/AuthScreen';
import {AppNavigator} from './src/navigation/AppNavigator';
import api from './src/services/api';
import {colors, typography, spacing} from './src/theme';
import {hasCompleteProfile} from './src/utils/userValidation';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activityIntents, setActivityIntents] = useState<ActivityIntent[]>([]);
  const [activityRequests, setActivityRequests] = useState<ActivityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check backend connection and load initial data
  useEffect(() => {
    const checkBackend = async () => {
      try {
        await api.health();
        setBackendConnected(true);
        // Backend connected successfully
      } catch (error) {
        // Backend not available
        setBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  // Fetch data from backend when user logs in and periodically refresh
  useEffect(() => {
    if (!currentUser || !backendConnected) return;

    const fetchData = async (isInitial = false) => {
      try {
        // Only show loading on initial load
        if (isInitial) {
          setLoading(true);
        }

        // Fetch only active activities (exclude cancelled and completed)
        const activities = await api.activities.getAll({status: 'active'});
        setActivityIntents(activities);

        // Fetch ALL requests (for activities you created AND requests you made)
        const allRequestsPromises = activities.map((activity) =>
          api.requests.getByActivityId(activity.id),
        );
        const allRequestsArrays = await Promise.all(allRequestsPromises);
        const allRequests = allRequestsArrays.flat();

        setActivityRequests(allRequests);

        if (isInitial) {
          // eslint-disable-next-line no-console
          console.log(
            `✅ Loaded ${activities.length} activities and ${allRequests.length} requests`,
          );

          // Check if database is empty and show helpful message
          if (activities.length === 0 && currentUser.email === 'demo@uw.edu') {
            Alert.alert(
              'No Demo Data Found',
              'The database is empty. To see demo activities and users, run:\n\ncd backend\nnpm run seed\n\nThen refresh the app.',
              [{text: 'OK'}],
            );
          }
        }

        // Loaded activities and requests successfully
      } catch (error) {
        // Failed to fetch data from backend
        setActivityIntents([]);
        setActivityRequests([]);
      } finally {
        if (isInitial) {
          setLoading(false);
        }
      }
    };

    // Fetch immediately with loading indicator
    fetchData(true);

    // Poll every 15 seconds to refresh data (without loading indicator)
    const dataInterval = setInterval(() => fetchData(false), 15000);

    return () => {
      clearInterval(dataInterval);
    };
  }, [currentUser, backendConnected]);

  // Poll for notifications
  useEffect(() => {
    if (!currentUser || !backendConnected) {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
      return;
    }

    const fetchUnreadCount = async () => {
      try {
        const count = await api.notifications.getUnreadCount(currentUser.id);
        setUnreadCount(count);
      } catch (error) {
        // Silently fail - don't spam console
      }
    };

    // Fetch immediately
    fetchUnreadCount();

    // Poll every 30 seconds
    notificationIntervalRef.current = setInterval(fetchUnreadCount, 30000);

    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    };
  }, [currentUser, backendConnected]);

  // Also check notifications after actions that might create them
  useEffect(() => {
    if (currentUser && backendConnected && activityRequests.length > 0) {
      // Refresh unread count when requests change
      api.notifications.getUnreadCount(currentUser.id).then(setUnreadCount).catch(() => {});
    }
  }, [activityRequests, currentUser, backendConnected]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    if (!currentUser || !backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      const updated = await api.users.update(currentUser.id, updatedUser);
      if (updated) {
        setCurrentUser(updated);
        Alert.alert('Success', 'Profile updated successfully!');
      }
    } catch (error) {
      // Failed to update profile
      let errorMessage = 'Failed to update profile. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
        // If there are violating fields (profanity detected), show them
        if ((error as Error & { violatingFields?: string[] }).violatingFields) {
          const fields = (error as Error & { violatingFields?: string[] }).violatingFields;
          errorMessage = `${error.message}\n\nViolating fields: ${fields?.join(', ')}`;
          // Profanity detection is validation, not a system error - don't log to console
        } else {
          // Only log actual system errors (not validation failures)
          console.error('Failed to update profile:', error);
        }
      }
      Alert.alert('Error', errorMessage);
      throw error; // Re-throw so calling code knows it failed
    }
  };

  const handleCreateActivity = async (
    activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>,
  ) => {
    if (!currentUser) return;

    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      const newActivity = await api.activities.create({
        ...activity,
        userId: currentUser.id,
        userName: currentUser.name,
      });

      if (newActivity) {
        setActivityIntents((prev) => [newActivity, ...prev]);
      }
    } catch (error) {
      // Failed to create activity
      let errorMessage = 'Failed to create activity. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
        // If there are violating fields (profanity detected), show them
        if ((error as Error & { violatingFields?: string[] }).violatingFields) {
          const fields = (error as Error & { violatingFields?: string[] }).violatingFields;
          errorMessage = `${error.message}\n\nViolating fields: ${fields?.join(', ')}`;
          // Profanity detection is validation, not a system error - don't log to console
          // Just show user-friendly message via Alert
        } else {
          // Only log actual system errors (not validation failures)
          console.error('Failed to create activity:', error);
        }
      }
      Alert.alert('Error', errorMessage);
      throw error; // Re-throw so calling code knows it failed
    }
  };

  const handleUpdateActivity = async (activityId: string, updates: Partial<ActivityIntent>) => {
    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      const updated = await api.activities.update(activityId, updates);
      if (updated) {
        setActivityIntents((prev) =>
          prev.map((activity) => (activity.id === activityId ? updated : activity)),
        );
      }
    } catch (error) {
      // Failed to update activity
      let errorMessage = 'Failed to update activity. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
        // If there are violating fields (profanity detected), show them
        if ((error as Error & { violatingFields?: string[] }).violatingFields) {
          const fields = (error as Error & { violatingFields?: string[] }).violatingFields;
          errorMessage = `${error.message}\n\nViolating fields: ${fields?.join(', ')}`;
          // Profanity detection is validation, not a system error - don't log to console
        } else {
          // Only log actual system errors (not validation failures)
          console.error('Failed to update activity:', error);
        }
      }
      Alert.alert('Error', errorMessage);
      throw error; // Re-throw so calling code knows it failed
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      await api.activities.delete(activityId);
      setActivityIntents((prev) => prev.filter((activity) => activity.id !== activityId));
      setActivityRequests((prev) => prev.filter((request) => request.activityId !== activityId));
    } catch (error) {
      // Failed to delete activity
      Alert.alert('Error', 'Failed to delete activity. Please try again.');
    }
  };

  const handleJoinActivity = async (activityId: string) => {
    const activity = activityIntents.find((a) => a.id === activityId);
    if (!activity || !currentUser) {
      throw new Error('Activity or user not found');
    }

    // Check if user has complete profile (name and at least one contact method)
    if (!hasCompleteProfile(currentUser)) {
      Alert.alert(
        'Profile Incomplete',
        'To join activities, you need to complete your profile with:\n\n• Your name\n• At least one contact method (phone, Instagram, or contact email)\n\nThis allows activity creators to reach you. Please update your profile in the Profile tab.',
        [
          {text: 'OK', style: 'default'},
        ],
      );
      throw new Error('Profile incomplete');
    }

    // Check if activity is active (cannot join cancelled or completed activities)
    if (activity.status !== 'active') {
      Alert.alert(
        'Cannot Join',
        `This activity is ${activity.status}. You cannot join ${activity.status} activities.`,
      );
      throw new Error('Activity not active');
    }

    // Check if already requested (allow re-request if previously declined)
    const existingRequest = activityRequests.find(
      (r) => r.activityId === activityId && r.userId === currentUser.id,
    );
    if (existingRequest && existingRequest.status !== 'declined') {
      throw new Error('Already requested or approved'); // Already requested or approved
    }

    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      throw new Error('Backend not connected');
    }

    try {
      const newRequest = await api.requests.create({
        activityId,
        userId: currentUser.id,
        userName: currentUser.name,
        userBio: currentUser.bio,
        userSkills: currentUser.skills,
      });

      if (newRequest) {
        setActivityRequests((prev) => [...prev, newRequest]);
      }
    } catch (error) {
      // Failed to join activity
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to join activity. Please try again.';
      Alert.alert('Error', errorMessage);
      // Re-throw the error so the caller (ActivityCard) knows the join failed
      throw error;
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    const request = activityRequests.find((r) => r.id === requestId);
    if (!request) return;

    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      const updated = await api.requests.updateStatus(requestId, 'approved');
      if (updated) {
        setActivityRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));

        // Refresh the activity to get updated currentPeople count from backend
        const activity = await api.activities.getById(request.activityId);
        if (activity) {
          setActivityIntents((prev) =>
            prev.map((a) => (a.id === request.activityId ? activity : a)),
          );
        }
      }
    } catch (error) {
      // Failed to approve request
      Alert.alert('Error', 'Failed to approve request. Please try again.');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
    }

    try {
      const updated = await api.requests.updateStatus(requestId, 'declined');
      if (updated) {
        setActivityRequests((prev) => prev.map((r) => (r.id === requestId ? updated : r)));
      }
    } catch (error) {
      // Failed to decline request
      Alert.alert('Error', 'Failed to decline request. Please try again.');
    }
  };

  const handleConnectRequest = (_userId: string) => {
    // Connection request sent - no popup needed as button provides visual feedback
  };

  const handleNotificationRead = async () => {
    // Immediately refresh unread count when notification is marked as read
    if (currentUser && backendConnected) {
      try {
        const count = await api.notifications.getUnreadCount(currentUser.id);
        setUnreadCount(count);
      } catch (error) {
        // Silently fail
      }
    }
  };

  if (loading && !currentUser) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  try {
    return (
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          {!currentUser ? (
            <AuthScreen onAuthenticated={setCurrentUser} />
          ) : (
            <AppNavigator
              currentUser={currentUser}
              activityIntents={activityIntents}
              activityRequests={activityRequests}
              onLogout={handleLogout}
              onUpdateProfile={handleUpdateProfile}
              onCreateActivity={handleCreateActivity}
              onUpdateActivity={handleUpdateActivity}
              onDeleteActivity={handleDeleteActivity}
              onJoinActivity={handleJoinActivity}
              onApproveRequest={handleApproveRequest}
              onDeclineRequest={handleDeclineRequest}
              onConnectRequest={handleConnectRequest}
              unreadNotificationCount={unreadCount}
              onNotificationRead={handleNotificationRead}
            />
          )}
        </NavigationContainer>
      </SafeAreaProvider>
    );
  } catch (error) {
    // Catch any initialization errors
    console.error('App initialization error:', error);
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, {color: colors.error || '#ff0000'}]}>
            App Error: {error instanceof Error ? error.message : 'Unknown error'}
          </Text>
          <Text style={styles.loadingText}>Please restart the app.</Text>
        </View>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
});
