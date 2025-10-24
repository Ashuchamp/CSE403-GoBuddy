import { ActivityRequest } from '../types';

export const mockActivityRequests: ActivityRequest[] = [
  // Requests for activities created by the demo user (user ID '1')
  {
    id: 'req-1',
    activityId: 'demo-activity-1', // Will be created by demo user
    userId: 'user-2',
    userName: 'Alex Thompson',
    userBio: 'Senior studying Biology. Love outdoor activities and meeting new people!',
    userSkills: ['Lab Work', 'Research', 'Public Speaking'],
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    activityId: 'demo-activity-1',
    userId: 'user-3',
    userName: 'Mike Johnson',
    userBio: 'Junior in Computer Science. Passionate about basketball and fitness.',
    userSkills: ['Python', 'JavaScript', 'Team Leadership'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: 'req-3',
    activityId: 'demo-activity-1',
    userId: 'user-4',
    userName: 'Jennifer Lee',
    userBio: "Sophomore majoring in Psychology. I'm always up for trying new things!",
    userSkills: ['Communication', 'Organization', 'Creative Writing'],
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'req-4',
    activityId: 'demo-activity-2', // Another activity by demo user
    userId: 'user-5',
    userName: 'Emily Rodriguez',
    userBio: 'First-year student exploring campus life. Love photography and art!',
    userSkills: ['Photography', 'Adobe Creative Suite', 'Social Media'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  },
  {
    id: 'req-5',
    activityId: 'demo-activity-2',
    userId: 'user-6',
    userName: 'Chris Martinez',
    userBio: 'Business major with a passion for entrepreneurship and networking.',
    userSkills: ['Marketing', 'Public Relations', 'Event Planning'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
  },
  // Requests from the demo user to join other activities
  {
    id: 'req-6',
    activityId: 'intent-1', // From mockActivityIntents
    userId: '1',
    userName: 'Demo User',
    userBio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: 'req-7',
    activityId: 'intent-2',
    userId: '1',
    userName: 'Demo User',
    userBio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'req-8',
    activityId: 'intent-3',
    userId: '1',
    userName: 'Demo User',
    userBio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'declined',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

