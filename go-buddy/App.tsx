import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { User, ActivityIntent } from './src/types';
import { AuthScreen } from './src/screens/AuthScreen';
import { AppNavigator, AppNavigatorProps } from './src/navigation/AppNavigator';
import { mockActivityIntents } from './src/data/mockActivityIntents';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activityIntents, setActivityIntents] = useState<ActivityIntent[]>(
    mockActivityIntents
  );

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
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
            onLogout={handleLogout}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

