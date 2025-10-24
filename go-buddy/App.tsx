import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';
import { User, ActivityIntent, ActivityRequest } from './src/types';
import { AuthScreen } from './src/screens/AuthScreen';
import { AppNavigator, AppNavigatorProps } from './src/navigation/AppNavigator';
import { mockActivityIntents } from './src/data/mockActivityIntents';
import { mockActivityRequests } from './src/data/mockActivityRequests';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activityIntents, setActivityIntents] = useState<ActivityIntent[]>(
    mockActivityIntents
  );
  const [activityRequests, setActivityRequests] = useState<ActivityRequest[]>(mockActivityRequests);

  // Add demo activities when user logs in
  useEffect(() => {
    if (currentUser && currentUser.id === '1') {
      // Check if demo activities already exist
      const hasDemoActivities = activityIntents.some(a => a.id.startsWith('demo-activity-'));
      
      if (!hasDemoActivities) {
        const demoActivities: ActivityIntent[] = [
          {
            id: 'demo-activity-1',
            userId: '1',
            userName: currentUser.name,
            title: 'Weekend Study Group',
            description: 'Looking for people to study together for upcoming midterms. All majors welcome!',
            maxPeople: 6,
            currentPeople: 2, // 1 (you) + 1 approved
            scheduledTimes: ['Saturday 2:00 PM', 'Sunday 3:00 PM'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
            campusLocation: 'Suzzallo Library',
            status: 'active',
          },
          {
            id: 'demo-activity-2',
            userId: '1',
            userName: currentUser.name,
            title: 'Morning Jogging Group',
            description: 'Early morning jog around campus. Great way to start the day!',
            maxPeople: 8,
            currentPeople: 1,
            scheduledTimes: ['Monday 7:00 AM', 'Wednesday 7:00 AM', 'Friday 7:00 AM'],
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            campusLocation: 'Red Square',
            status: 'active',
          },
        ];
        
        setActivityIntents([...demoActivities, ...activityIntents]);
      }
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleCreateActivity = (
    activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>
  ) => {
    const newActivity: ActivityIntent = {
      ...activity,
      id: Date.now().toString(),
      userId: currentUser!.id,
      userName: currentUser!.name,
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    setActivityIntents([newActivity, ...activityIntents]);
  };

  const handleUpdateActivity = (activityId: string, updates: Partial<ActivityIntent>) => {
    setActivityIntents(
      activityIntents.map((activity) =>
        activity.id === activityId ? { ...activity, ...updates } : activity
      )
    );
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivityIntents(activityIntents.filter((activity) => activity.id !== activityId));
    // Also delete all requests for this activity
    setActivityRequests(activityRequests.filter((request) => request.activityId !== activityId));
  };

  const handleJoinActivity = (activityId: string) => {
    const activity = activityIntents.find((a) => a.id === activityId);
    if (!activity || !currentUser) return;

    // Check if already requested
    const existingRequest = activityRequests.find(
      (r) => r.activityId === activityId && r.userId === currentUser.id
    );
    if (existingRequest) {
      return; // Already requested
    }

    const newRequest: ActivityRequest = {
      id: Date.now().toString(),
      activityId,
      userId: currentUser.id,
      userName: currentUser.name,
      userBio: currentUser.bio,
      userSkills: currentUser.skills,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setActivityRequests([...activityRequests, newRequest]);
  };

  const handleApproveRequest = (requestId: string) => {
    const request = activityRequests.find((r) => r.id === requestId);
    if (!request) return;

    // Update request status
    setActivityRequests(
      activityRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'approved' as const } : r
      )
    );

    // Increment activity's current people count
    setActivityIntents(
      activityIntents.map((activity) =>
        activity.id === request.activityId
          ? { ...activity, currentPeople: activity.currentPeople + 1 }
          : activity
      )
    );
  };

  const handleDeclineRequest = (requestId: string) => {
    setActivityRequests(
      activityRequests.map((r) =>
        r.id === requestId ? { ...r, status: 'declined' as const } : r
      )
    );
  };

  const handleConnectRequest = (userId: string) => {
    // Connection request sent - no popup needed as button provides visual feedback
  };

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

