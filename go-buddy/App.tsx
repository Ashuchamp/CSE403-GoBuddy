import React, {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, ActivityIndicator, StyleSheet, Alert} from 'react-native';
import {User, ActivityIntent, ActivityRequest} from './src/types';
import {AuthScreen} from './src/screens/AuthScreen';
import {AppNavigator} from './src/navigation/AppNavigator';
import api from './src/services/api';
import {colors, typography, spacing} from './src/theme';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activityIntents, setActivityIntents] = useState<ActivityIntent[]>([]);
  const [activityRequests, setActivityRequests] = useState<ActivityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

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

  // Fetch data from backend when user logs in
  useEffect(() => {
    if (!currentUser || !backendConnected) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch activities
        const activities = await api.activities.getAll();
        setActivityIntents(activities);

        // Fetch ALL requests (for activities you created AND requests you made)
        const allRequestsPromises = activities.map((activity) =>
          api.requests.getByActivityId(activity.id),
        );
        const allRequestsArrays = await Promise.all(allRequestsPromises);
        const allRequests = allRequestsArrays.flat();

        setActivityRequests(allRequests);

        console.log(
          `✅ Loaded ${activities.length} activities and ${allRequests.length} requests`,
        );

        // Loaded activities and requests successfully
      } catch (error) {
        // Failed to fetch data from backend
        setActivityIntents([]);
        setActivityRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, backendConnected]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
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
      Alert.alert('Error', 'Failed to create activity. Please try again.');
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
      Alert.alert('Error', 'Failed to update activity. Please try again.');
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
    if (!activity || !currentUser) return;

    // Check if already requested
    const existingRequest = activityRequests.find(
      (r) => r.activityId === activityId && r.userId === currentUser.id,
    );
    if (existingRequest) {
      return; // Already requested
    }

    if (!backendConnected) {
      Alert.alert('Error', 'Backend is not connected. Please ensure the server is running.');
      return;
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
      Alert.alert('Error', 'Failed to join activity. Please try again.');
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
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
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
