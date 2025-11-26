import {User} from '../types';

export type ConnectionRequestStoreItem = {
  id: string;
  from: User;
  to: User;
  message: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
};

type SentSubscriber = (item: ConnectionRequestStoreItem) => void;
type ConnectedSubscriber = (user: User) => void;

const sentRequests: ConnectionRequestStoreItem[] = [];
const sentSubscribers: Set<SentSubscriber> = new Set();

const connectedUsersById: Map<string, User> = new Map();
const connectedUserIds: string[] = [];

const demoConnectedUsers: User[] = [
  {
    id: 'mock1',
    email: 'sarah@test.com',
    name: 'Sarah Johnson',
    bio: 'Testing Instagram link',
    instagram: '@dubs_uw',
    phone: '206-000-0000',
    contactEmail: 'sarah@test.com',
    preferredTimes: [],
    activityTags: [],
    campusLocation: 'North Campus',
    skills: [],
  },
  {
    id: 'mock2',
    email: 'mike@test.com',
    name: 'Mike Chen',
    bio: 'Gym buddy tester',
    instagram: '@mikechen_dev',
    preferredTimes: [],
    activityTags: [],
    campusLocation: 'South Campus',
    skills: [],
  },
];


// Load demo users into store
demoConnectedUsers.forEach((u) => {
  connectedUsersById.set(u.id, u);
  connectedUserIds.push(u.id);
});

const connectedSubscribers: Set<ConnectedSubscriber> = new Set();

export function addSentRequest(item: ConnectionRequestStoreItem) {
  sentRequests.push(item);
  sentSubscribers.forEach((cb) => cb(item));
}

export function getSentRequests(): ConnectionRequestStoreItem[] {
  return [...sentRequests];
}

export function subscribeToSentRequests(cb: SentSubscriber) {
  sentSubscribers.add(cb);
  return () => sentSubscribers.delete(cb);
}

export function addConnectedUser(user: User, addToFront: boolean = true) {
  connectedUsersById.set(user.id, user);
  const existingIndex = connectedUserIds.indexOf(user.id);
  if (existingIndex !== -1) {
    connectedUserIds.splice(existingIndex, 1);
  }
  if (addToFront) {
    connectedUserIds.unshift(user.id);
  } else {
    connectedUserIds.push(user.id);
  }
  connectedSubscribers.forEach((cb) => cb(user));
}

export function getConnectedUsers(): User[] {
  return connectedUserIds.map((id) => connectedUsersById.get(id)!).filter(Boolean);
}

export function subscribeToConnectedUsers(cb: ConnectedSubscriber) {
  connectedSubscribers.add(cb);
  return () => connectedSubscribers.delete(cb);
}
