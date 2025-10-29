import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {ConnectionsScreen} from '../../screens/ConnectionsScreen';
import {User} from '../../types';

const mockCurrentUser: User = {
  id: '1',
  email: 'test@uw.edu',
  name: 'Test User',
  bio: '',
  skills: [],
  preferredTimes: [],
  activityTags: [],
  phone: '',
  instagram: '',
  campusLocation: '',
};

describe('ConnectionsScreen', () => {
  it('renders the header with title and subtitle', () => {
    const {getByText} = render(<ConnectionsScreen currentUser={mockCurrentUser} />);
    expect(getByText('Connections')).toBeTruthy();
    expect(getByText('Manage your connection requests')).toBeTruthy();
  });

  it('displays a connection request card', () => {
    const {getByText} = render(<ConnectionsScreen currentUser={mockCurrentUser} />);
    expect(getByText('Mike Chen')).toBeTruthy();
    expect(
      getByText("Hey! I saw you're also interested in CSE 373 study groups. Want to team up?"),
    ).toBeTruthy();
    expect(getByText('Accept')).toBeTruthy();
    expect(getByText('Decline')).toBeTruthy();
  });

  it('shows empty state if no requests remain', () => {
    const {getByText} = render(<ConnectionsScreen currentUser={mockCurrentUser} />);
    fireEvent.press(getByText('Decline'));

    expect(getByText('No pending requests')).toBeTruthy();
    expect(getByText('New connection requests will appear here')).toBeTruthy();
  });
});
