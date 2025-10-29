import React from 'react';
import {render} from '@testing-library/react-native';
import {RecommendationsScreen} from '../../screens/RecommendationsScreen';
import {User, ActivityIntent} from '../../types';

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
    userId: '1',
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
  it('renders the header and subtitle', () => {
    const {getByText} = render(
      <RecommendationsScreen
        currentUser={mockCurrentUser}
        activityIntents={mockActivityIntents}
      />,
    );

    expect(getByText('For You')).toBeTruthy();
    expect(getByText('Activities matched to your interests')).toBeTruthy();
  });

  it("filters out user's own activities", () => {
    const {queryByText} = render(
      <RecommendationsScreen
        currentUser={mockCurrentUser}
        activityIntents={mockActivityIntents}
      />,
    );

    expect(queryByText('Evening Run')).toBeTruthy();
    expect(queryByText('Study Group')).toBeNull();
  });

  it('renders empty state when there are no recommendations', () => {
    const {getByText} = render(
      <RecommendationsScreen
        currentUser={mockCurrentUser}
        activityIntents={[]}
      />,
    );

    expect(getByText('No recommendations yet')).toBeTruthy();
    expect(
      getByText('Update your profile to see personalized recommendations'),
    ).toBeTruthy();
  });
});
