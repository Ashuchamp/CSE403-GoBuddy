import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {BrowseScreen} from '../../screens/BrowseScreen';
import {User, ActivityIntent} from '../../types';
import api from '../../services/api';

// Mock the entire api module
jest.mock('../../services/api');

const mockCurrentUser: User = {
  id: '1',
  email: 'test@uw.edu',
  name: 'Test User',
  bio: 'Test bio',
  skills: ['Testing'],
  preferredTimes: ['Weekday Evenings'],
  activityTags: ['Testing'],
  campusLocation: 'Central Campus',
};

const mockActivityIntents: ActivityIntent[] = [
  {
    id: 'activity-1',
    userId: '2',
    userName: 'Sarah Johnson',
    title: 'Study Session',
    description: 'Biology study group',
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Monday 5-7pm'],
    createdAt: '2025-10-20T10:00:00Z',
    campusLocation: 'Library',
    status: 'active',
  },
];

describe('BrowseScreen', () => {
  const renderWithNavigation = (component: React.ReactElement) => {
    return render(<NavigationContainer>{component}</NavigationContainer>);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementations
    (api as any).users = {
      getAll: jest.fn().mockResolvedValue([]),
    };
    (api as any).connections = {
      getSentRequests: jest.fn().mockResolvedValue([]),
      getReceivedRequests: jest.fn().mockResolvedValue([]),
      getConnectedUsers: jest.fn().mockResolvedValue([]),
    };
  });

  it('should render the browse screen with header', async () => {
    const {getByText} = renderWithNavigation(
      <BrowseScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    expect(getByText('Browse')).toBeTruthy();

    // Wait for async operations to complete
    await waitFor(() => {
      expect(api.users.getAll).toHaveBeenCalled();
    });
  });

  it('should render category toggle buttons', async () => {
    const {getByText} = renderWithNavigation(
      <BrowseScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    expect(getByText('Students')).toBeTruthy();
    expect(getByText('Activities')).toBeTruthy();

    // Wait for async operations to complete
    await waitFor(() => {
      expect(api.users.getAll).toHaveBeenCalled();
    });
  });
});
