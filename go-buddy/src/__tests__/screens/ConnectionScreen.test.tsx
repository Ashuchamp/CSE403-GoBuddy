import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {ConnectionsScreen} from '../../screens/ConnectionsScreen';
import {User} from '../../types';

jest.mock('../../services/connectionStore', () => ({
  getSentRequests: jest.fn(() => []),
  subscribeToSentRequests: jest.fn(() => () => {}),
  addConnectedUser: jest.fn(),
  getConnectedUsers: jest.fn(() => []),
}));

import {
  getSentRequests,
  subscribeToSentRequests,
  getConnectedUsers,
} from '../../services/connectionStore';

jest.mock('../../services/api');
import api from '../../services/api';

const currentUser: User = {
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

const otherUser: User = {
  ...currentUser,
  id: '2',
  name: 'Alice',
};

const connectedUser: User = {
  ...currentUser,
  id: '3',
  name: 'Bob',
};

describe('ConnectionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (api as any).connections = {
      getReceivedRequests: jest.fn(),
      getSentRequests: jest.fn(),
      getConnectedUsers: jest.fn(),
      acceptRequest: jest.fn(),
      declineRequest: jest.fn(),
    };
  });

  const mockBackendSuccess = () => {
    (api as any).connections.getReceivedRequests.mockResolvedValue([
      {
        id: 'req1',
        from: otherUser,
        timestamp: new Date().toISOString(),
        status: 'pending',
        message: 'Hi',
      },
    ]);

    (api as any).connections.getSentRequests.mockResolvedValue([
      {
        id: 'sent1',
        from: currentUser,
        to: otherUser,
        timestamp: new Date().toISOString(),
        status: 'pending',
        message: 'Hello',
      },
    ]);

    (api as any).connections.getConnectedUsers.mockResolvedValue([connectedUser]);
  };

  const mockBackendFailure = () => {
    (api as any).connections.getReceivedRequests.mockRejectedValue(new Error('fail'));
    (api as any).connections.getSentRequests.mockRejectedValue(new Error('fail'));
    (api as any).connections.getConnectedUsers.mockRejectedValue(new Error('fail'));

    (getSentRequests as jest.Mock).mockReturnValue([]);
    (getConnectedUsers as jest.Mock).mockReturnValue([]);
  };

  it('renders header', () => {
    mockBackendSuccess();
    const {getByText} = render(<ConnectionsScreen currentUser={currentUser} />);
    expect(getByText('Connections')).toBeTruthy();
  });

  it('opens user profile modal (no component edit)', async () => {
    mockBackendSuccess();
    const {getByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    await waitFor(() => getByText('Alice'));

    fireEvent.press(getByText('Alice'));

    await waitFor(() => expect(getByText('Student Profile')).toBeTruthy());

    await waitFor(() => expect(getByText('About')).toBeTruthy());
  });

  it('subscribes to sent requests when backend fails', async () => {
    mockBackendFailure();

    const {getByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    await waitFor(() => expect(getByText('No pending requests')).toBeTruthy());

    // waitFor — state updates, then subscription
    await waitFor(() => expect(subscribeToSentRequests).toHaveBeenCalled());
  });

  it('accepts request', async () => {
    mockBackendSuccess();
    (api as any).connections.acceptRequest.mockResolvedValue({});

    const {getByText, getAllByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    await waitFor(() => getByText('Alice'));
    fireEvent.press(getAllByText('Accept')[0]);

    await waitFor(() =>
      expect((api as any).connections.acceptRequest).toHaveBeenCalledWith('req1'),
    );
  });

  it('declines request', async () => {
    mockBackendSuccess();
    (api as any).connections.declineRequest.mockResolvedValue({});

    const {getByText, getAllByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    await waitFor(() => getByText('Alice'));
    fireEvent.press(getAllByText('Decline')[0]);

    await waitFor(() =>
      expect((api as any).connections.declineRequest).toHaveBeenCalledWith('req1'),
    );
  });

  it('renders sent requests', async () => {
    mockBackendSuccess();
    const {getByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    fireEvent.press(getByText('Sent'));

    await waitFor(() => expect(getByText('Hello')).toBeTruthy());
  });

  it('renders connected users', async () => {
    mockBackendSuccess();
    const {getByText} = render(<ConnectionsScreen currentUser={currentUser} />);

    fireEvent.press(getByText('Connected'));
    await waitFor(() => expect(getByText('Bob')).toBeTruthy());
  });
});
