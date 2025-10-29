import React from 'react';
import {render} from '@testing-library/react-native';
import {ActivityCard} from '../../components/ActivityCard';
import {ActivityIntent} from '../../types';

const mockIntent: ActivityIntent = {
  id: '1',
  userId: 'user-1',
  userName: 'John Doe',
  title: 'Basketball Game',
  description: 'Looking for people to play basketball at the IMA.',
  maxPeople: 5,
  currentPeople: 2,
  scheduledTimes: ['Monday 5-7pm'],
  createdAt: '2025-10-20T10:00:00Z',
  campusLocation: 'IMA',
  status: 'active',
};

describe('ActivityCard Component', () => {
  it('should render activity title', () => {
    const {getByText} = render(<ActivityCard intent={mockIntent} />);
    expect(getByText('Basketball Game')).toBeTruthy();
  });

  it('should render user name', () => {
    const {getByText} = render(<ActivityCard intent={mockIntent} />);
    expect(getByText('by John Doe')).toBeTruthy();
  });

  it('should render current and max people', () => {
    const {getByText} = render(<ActivityCard intent={mockIntent} />);
    expect(getByText('2/5')).toBeTruthy();
  });
});
