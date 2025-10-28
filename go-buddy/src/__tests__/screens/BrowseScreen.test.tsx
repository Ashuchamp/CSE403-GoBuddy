import React from 'react';
import {render} from '@testing-library/react-native';
import {BrowseScreen} from '../../screens/BrowseScreen';
import {User, ActivityIntent} from '../../types';

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
  it('should render the browse screen with header', () => {
    const {getByText} = render(
      <BrowseScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    expect(getByText('Browse')).toBeTruthy();
  });

  it('should render category toggle buttons', () => {
    const {getByText} = render(
      <BrowseScreen currentUser={mockCurrentUser} activityIntents={mockActivityIntents} />,
    );

    expect(getByText('Students')).toBeTruthy();
    expect(getByText('Activities')).toBeTruthy();
  });
});
