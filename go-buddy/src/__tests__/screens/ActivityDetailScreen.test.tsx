import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ActivityDetailScreen} from '../../screens/ActivityDetailScreen';
import {User, ActivityIntent, ActivityRequest} from '../../types';

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

const mockActivity: ActivityIntent = {
  id: 'activity-1',
  userId: '1',
  userName: 'Test User',
  title: 'Study Session',
  description: 'Biology study group',
  maxPeople: 5,
  currentPeople: 2,
  scheduledTimes: ['Monday 5-7pm'],
  createdAt: '2025-10-20T10:00:00Z',
  campusLocation: 'Library',
  status: 'active',
};

const mockRequests: ActivityRequest[] = [
  {
    id: 'req-1',
    activityId: 'activity-1',
    userId: '2',
    userName: 'Sarah Johnson',
    userBio: 'Interested in biology and neuroscience.',
    userSkills: ['Teamwork', 'Lab Skills'],
    status: 'pending',
    createdAt: '2025-10-22T08:00:00Z',
  },
  {
    id: 'req-2',
    activityId: 'activity-1',
    userId: '3',
    userName: 'Alex Lee',
    userBio: 'Physics major and coffee lover.',
    userSkills: ['Communication'],
    status: 'approved',
    createdAt: '2025-10-22T09:00:00Z',
  },
];

const mockHandlers = {
  onClose: jest.fn(),
  onUpdateActivity: jest.fn(),
  onDeleteActivity: jest.fn(),
  onApproveRequest: jest.fn(),
  onDeclineRequest: jest.fn(),
};

describe('ActivityDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the screen with header title', () => {
    const {getByText} = render(
      <ActivityDetailScreen
        activity={mockActivity}
        requests={mockRequests}
        currentUser={mockCurrentUser}
        {...mockHandlers}
      />,
    );
    expect(getByText('Manage Activity')).toBeTruthy();
  });

  it('should display the activity title and description', () => {
    const {getByText} = render(
      <ActivityDetailScreen
        activity={mockActivity}
        requests={mockRequests}
        currentUser={mockCurrentUser}
        {...mockHandlers}
      />,
    );

    expect(getByText('Study Session')).toBeTruthy();
    expect(getByText('Biology study group')).toBeTruthy();
  });

  it('should show Participants and Actions sections', () => {
    const {getByText} = render(
      <ActivityDetailScreen
        activity={mockActivity}
        requests={mockRequests}
        currentUser={mockCurrentUser}
        {...mockHandlers}
      />,
    );

    expect(getByText('Participants')).toBeTruthy();
    expect(getByText('Actions')).toBeTruthy();
  });

  it('should show "Mark as Complete" and "Cancel Activity" buttons when active', () => {
    const {getByText} = render(
      <ActivityDetailScreen
        activity={mockActivity}
        requests={mockRequests}
        currentUser={mockCurrentUser}
        {...mockHandlers}
      />,
    );

    expect(getByText('Mark as Complete')).toBeTruthy();
    expect(getByText('Cancel Activity')).toBeTruthy();
  });

  it('should trigger onClose when back button is pressed', () => {
    const {getByTestId} = render(
      <ActivityDetailScreen
        activity={mockActivity}
        requests={mockRequests}
        currentUser={mockCurrentUser}
        {...mockHandlers}
      />,
    );

    // Press the back button
    fireEvent.press(getByTestId('back-button'));
    expect(mockHandlers.onClose).toHaveBeenCalled();
  });
});
