import {User} from '../types';
import {mockUsers} from '../data/mockUsers';

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

let seeded = false;
export function ensureDemoSeed() {
  if (seeded) return;
  seeded = true;
  // Seed two connected users (Alex id '5', Jessica id '6') if present
  const alex = mockUsers.find((u) => u.id === '5');
  const jess = mockUsers.find((u) => u.id === '6');
  if (alex && !connectedUsersById.has(alex.id)) addConnectedUser(alex, false);
  if (jess && !connectedUsersById.has(jess.id)) addConnectedUser(jess, false);

  // Seed one sent request to Sarah (id '2') if present
  const sarah = mockUsers.find((u) => u.id === '2');
  if (sarah && sentRequests.length === 0) {
    const demoCurrent: User = {
      id: '1',
      email: 'current@uw.edu',
      name: 'Current User',
      bio: 'Demo user',
      skills: [],
      preferredTimes: [],
      activityTags: [],
    };
    addSentRequest({
      id: 'sent_demo_seed',
      from: demoCurrent,
      to: sarah,
      message: 'Hi Sarah! Looking to connect for study groups.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'pending',
    });
  }
}
