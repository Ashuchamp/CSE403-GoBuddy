import { ActivityIntent } from '../App';

// Mock activities created by the current user
export const mockUserActivities: ActivityIntent[] = [
  {
    id: 'user-intent-1',
    userId: 'user-1', // This should match the current user's ID
    userName: 'Sarah Chen',
    title: 'Weekly Study Group - MATH 126',
    description: 'Looking for dedicated students to form a weekly calculus study group. We\'ll work through practice problems and help each other understand difficult concepts.',
    maxPeople: 6,
    currentPeople: 4,
    scheduledTimes: ['Wed 4-6pm', 'Fri 2-4pm'],
    tags: ['Study', 'Math', 'Calculus', 'Weekly'],
    createdAt: '2024-10-01',
    campusLocation: 'Odegaard Library'
  },
  {
    id: 'user-intent-2',
    userId: 'user-1',
    userName: 'Sarah Chen',
    title: 'Morning Yoga at the Quad',
    description: 'Join me for peaceful morning yoga sessions on the quad. All levels welcome! Bring your own mat.',
    maxPeople: 8,
    currentPeople: 6,
    scheduledTimes: ['Mon 7-8am', 'Wed 7-8am', 'Fri 7-8am'],
    tags: ['Wellness', 'Yoga', 'Morning', 'Outdoor'],
    createdAt: '2024-09-28',
    campusLocation: 'The Quad'
  },
  {
    id: 'user-intent-3',
    userId: 'user-1',
    userName: 'Sarah Chen',
    title: 'Board Game Night',
    description: 'Casual board game night every Saturday. We have a collection of games or feel free to bring your favorites!',
    maxPeople: 12,
    currentPeople: 8,
    scheduledTimes: ['Sat 6-10pm'],
    tags: ['Social', 'Games', 'Weekly', 'Indoor'],
    createdAt: '2024-09-25',
    campusLocation: 'HUB'
  },
  {
    id: 'user-intent-4',
    userId: 'user-1',
    userName: 'Sarah Chen',
    title: 'Photography Workshop - Cancelled',
    description: 'Learn basic photography techniques and explore campus together. This workshop was unfortunately cancelled due to low attendance.',
    maxPeople: 10,
    currentPeople: 2,
    scheduledTimes: ['Sun 1-4pm'],
    tags: ['Creative', 'Photography', 'Learning'],
    createdAt: '2024-09-20',
    campusLocation: 'Red Square'
  }
];

// Helper function to determine if an activity is active
export function isActivityActive(activity: ActivityIntent): boolean {
  // Consider activity active if it has good participation (>= 50% filled)
  // and it's not explicitly cancelled (checking description for now)
  const participationRate = activity.currentPeople / activity.maxPeople;
  const isCancelled = activity.description.toLowerCase().includes('cancelled');
  
  return participationRate >= 0.5 && !isCancelled;
}