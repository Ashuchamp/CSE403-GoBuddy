import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';
import {User, ActivityIntent, ActivityRequest} from '../types';
import {BrowseScreen} from '../screens/BrowseScreen';
import {RecommendationsScreen} from '../screens/RecommendationsScreen';
import {MyActivitiesScreen} from '../screens/MyActivitiesScreen';
import {ConnectionsScreen} from '../screens/ConnectionsScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {MapScreen} from '../screens/MapScreen';
import {NotificationCenterScreen} from '../screens/NotificationCenterScreen';
import {NotificationButton} from '../components/NotificationButton';
import {colors} from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type AppNavigatorProps = {
  currentUser: User;
  activityIntents: ActivityIntent[];
  activityRequests: ActivityRequest[];
  onLogout: () => void;
  onUpdateProfile: (updatedUser: User) => void;
  onCreateActivity: (
    activity: Omit<ActivityIntent, 'id' | 'userId' | 'userName' | 'createdAt'>,
  ) => void;
  onUpdateActivity: (activityId: string, updates: Partial<ActivityIntent>) => void;
  onDeleteActivity: (activityId: string) => void;
  onJoinActivity: (intentId: string) => void;
  onApproveRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onConnectRequest?: (userId: string) => void;
  unreadNotificationCount?: number;
  onNotificationRead?: () => void;
};

function TabNavigator({
  currentUser,
  activityIntents,
  activityRequests,
  onLogout,
  onUpdateProfile,
  onCreateActivity,
  onUpdateActivity,
  onDeleteActivity,
  onJoinActivity,
  onApproveRequest,
  onDeclineRequest,
  onConnectRequest,
  unreadNotificationCount = 0,
  navigation,
}: AppNavigatorProps & {navigation: any}) {
  const handleJoinActivity = (intentId: string) => {
    onJoinActivity(intentId);
    // No popup needed as button provides visual feedback
  };

  const handleOpenNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

          if (route.name === 'Browse') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'For You') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'My Activities') {
            iconName = focused ? 'calendar' : 'calendar-outline';
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
          route.name !== 'Profile'
            ? () => (
                <NotificationButton
                  unreadCount={unreadNotificationCount}
                  onPress={handleOpenNotifications}
                />
              )
            : undefined,
      })}
    >
      <Tab.Screen name="Browse" options={{headerTitle: 'GoBuddy'}}>
        {() => (
          <BrowseScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            activityRequests={activityRequests}
            onJoinActivity={handleJoinActivity}
            onConnectRequest={onConnectRequest}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="For You">
        {() => (
          <RecommendationsScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            activityRequests={activityRequests}
            onJoinActivity={handleJoinActivity}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Map" options={{headerTitle: 'Nearby Activities'}}>
        {() => (
          <MapScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            activityRequests={activityRequests}
            onJoinActivity={handleJoinActivity}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="My Activities" options={{headerTitle: 'My Activities'}}>
        {() => (
          <MyActivitiesScreen
            currentUser={currentUser}
            activityIntents={activityIntents}
            activityRequests={activityRequests}
            onCreateActivity={onCreateActivity}
            onUpdateActivity={onUpdateActivity}
            onDeleteActivity={onDeleteActivity}
            onApproveRequest={onApproveRequest}
            onDeclineRequest={onDeclineRequest}
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
            onLogout={onLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export function AppNavigator(props: AppNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: '',
        headerTintColor: colors.primary,
      }}
    >
      <Stack.Screen name="MainTabs">
        {({navigation}) => <TabNavigator {...props} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen
        name="Notifications"
        options={({navigation}) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerShadowVisible: true,
          headerTitleStyle: {
            color: colors.primary,
            fontSize: 20,
            fontWeight: '700',
          },
          headerTintColor: colors.primary,
          headerBackTitle: '',
          headerTitle: 'Notifications',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{marginLeft: 16}}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
        })}
      >
        {() => (
          <NotificationCenterScreen
            currentUserId={props.currentUser.id}
            onNotificationRead={props.onNotificationRead}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
