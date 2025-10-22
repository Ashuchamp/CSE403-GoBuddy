import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { User, ActivityIntent } from '../types';
import { BrowseScreen } from '../screens/BrowseScreen';
import { RecommendationsScreen } from '../screens/RecommendationsScreen';
import { ConnectionsScreen } from '../screens/ConnectionsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme';
import { View, TouchableOpacity, Alert } from 'react-native';

const Tab = createBottomTabNavigator();

export type AppNavigatorProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
};

export function AppNavigator({
  currentUser,
  activityIntents,
  onLogout,
  onUpdateProfile,
}: AppNavigatorProps) {
  const handleJoinActivity = (intentId: string) => {
    Alert.alert('Success', 'Join request sent! The organizer will be notified.');
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'For You') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Connections') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          color: colors.primary,
          fontSize: 20,
          fontWeight: '700',
        },
        headerRight:
          route.name === 'Browse'
            ? () => (
                <TouchableOpacity
                  onPress={onLogout}
                  style={{ marginRight: 16 }}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              )
            : undefined,
      })}
    >
      <Tab.Screen
        name="Browse"
        options={{ headerTitle: 'GoBuddy' }}
      >
        {() => (
          <BrowseScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            onJoinActivity={handleJoinActivity}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="For You">
        {() => (
          <RecommendationsScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            onJoinActivity={handleJoinActivity}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Connections">
        {() => <ConnectionsScreen currentUser={currentUser} />}
      </Tab.Screen>

      <Tab.Screen name="Profile">
        {() => (
          <ProfileScreen
            user={currentUser}
            isCurrentUser={true}
            onUpdateProfile={onUpdateProfile}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
