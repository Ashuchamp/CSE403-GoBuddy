import React from 'react';
import {render} from '@testing-library/react-native';
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

  it('displays empty state when no connection requests exist', () => {
    const {getByText} = render(<ConnectionsScreen currentUser={mockCurrentUser} />);
    expect(getByText('No pending requests')).toBeTruthy();
    expect(getByText('New connection requests will appear here')).toBeTruthy();
  });

  it('displays all three tabs', () => {
    const {getByText} = render(<ConnectionsScreen currentUser={mockCurrentUser} />);
    expect(getByText('Received')).toBeTruthy();
    expect(getByText('Sent')).toBeTruthy();
    expect(getByText('Connected')).toBeTruthy();
  });
});
