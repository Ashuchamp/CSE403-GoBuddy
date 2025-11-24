import React from 'react';
import {render, waitFor} from '@testing-library/react-native';
import {RecommendationsScreen} from '../../screens/RecommendationsScreen';
import {User, ActivityIntent} from '../../types';
import api from '../../services/api';

// Mock the entire api module
jest.mock('../../services/api');

const mockCurrentUser: User = {
  id: '1',
  email: 'test@uw.edu',
  name: 'Test User',
  bio: 'Test bio',
  skills: ['React Native', 'Testing'],
  preferredTimes: ['Evenings'],
  activityTags: ['Hiking', 'Music'],
  campusLocation: 'Central Campus',
};

const mockActivityIntents: ActivityIntent[] = [
  {
    id: 'activity-1',
    userId: '2',
    userName: 'Sarah Johnson',
    title: 'Evening Run',
    description: 'Group run around campus',
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Monday 7-8pm'],
    createdAt: '2025-10-20T10:00:00Z',
    campusLocation: 'Husky Stadium',
    status: 'active',
  },
  {
    id: 'activity-2',
    userId: '1', // same as currentUser, should be filtered out
    userName: 'Test User',
    title: 'Study Group',
    description: 'Math study session',
    maxPeople: 4,
    currentPeople: 1,
    scheduledTimes: ['Tuesday 3-5pm'],
    createdAt: '2025-10-21T10:00:00Z',
    campusLocation: 'Library',
    status: 'active',
  },
];

describe('RecommendationsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up default mock implementation
    (api as any).activities = {
      getRecommendations: jest.fn(),
    };
  });

  it('should render the header and subtitle', async () => {
    (api.activities.getRecommendations as jest.Mock).mockResolvedValue([mockActivityIntents[0]]);

    const {getByText} = render(
      <RecommendationsScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    expect(getByText('For You')).toBeTruthy();

    await waitFor(() => {
      expect(getByText('AI-powered recommendations based on your interests')).toBeTruthy();
    });
  });

  it.skip("should filter out user's own activities when API fails", async () => {
    (api.activities.getRecommendations as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const {queryByText} = render(
      <RecommendationsScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    // Wait for error handling and fallback to complete
    await waitFor(
      () => {
        // Check that we're no longer in loading state by verifying subtitle changed
        const subtitle = queryByText('AI-powered recommendations based on your interests');
        expect(subtitle).toBeTruthy();
      },
      {timeout: 3000},
    );

    // Should show fallback filtered activities (user's own activity filtered out)
    expect(queryByText('Evening Run')).toBeTruthy();
    expect(queryByText('Study Group')).toBeNull();
  });

  it('should render empty state when there are no recommendations', async () => {
    (api.activities.getRecommendations as jest.Mock).mockResolvedValue([]);

    const {getByText} = render(
      <RecommendationsScreen currentUser={mockCurrentUser} activityIntents={[]} />,
    );

    await waitFor(() => {
      expect(getByText('No recommendations yet')).toBeTruthy();
      expect(getByText('Update your profile to see personalized recommendations')).toBeTruthy();
    });
  });
});
