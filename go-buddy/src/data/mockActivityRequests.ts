import {ActivityRequest} from '../types';

export const mockActivityRequests: ActivityRequest[] = [
  // Requests for activities created by the demo user (user ID '1')
  {
    id: 'req-1',
    activityId: 'demo-activity-1', // Will be created by demo user
    userId: '2',
    userName: 'Sarah Johnson',
    userBio: 'Senior studying Biology. Love hiking, study groups, and playing soccer on weekends!',
    userSkills: ['Molecular Biology', 'Lab Techniques', 'Scientific Writing'],
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    activityId: 'demo-activity-1',
    userId: '3',
    userName: 'Mike Chen',
    userBio: 'CSE major who loves basketball and coding. Always down to work on side projects!',
    userSkills: ['Java', 'C++', 'Machine Learning', 'iOS Development'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: 'req-3',
    activityId: 'demo-activity-1',
    userId: '4',
    userName: 'Emily Park',
    userBio:
      'Psychology major interested in research and coffee chats. Looking for study buddies for stats!',
    userSkills: ['SPSS', 'Research Methods', 'Data Analysis'],
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'req-4',
    activityId: 'demo-activity-2', // Another activity by demo user
    userId: '5',
    userName: 'Alex Rodriguez',
    userBio: 'Econ student and gym enthusiast. Love playing tennis and discussing markets!',
    userSkills: ['Financial Analysis', 'Excel', 'Economics', 'Statistics'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  },
  {
    id: 'req-5',
    activityId: 'demo-activity-2',
    userId: '6',
    userName: 'Jessica Kim',
    userBio: 'Art major looking for creative collaborators! Also love yoga and exploring Seattle.',
    userSkills: ['Illustration', 'Graphic Design', 'Adobe Creative Suite'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
  },
  // Requests from the demo user to join other activities
  {
    id: 'req-6',
    activityId: 'intent-1', // From mockActivityIntents
    userId: '1',
    userName: 'Demo User',
    userBio:
      "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
  },
  {
    id: 'req-7',
    activityId: 'intent-2',
    userId: '1',
    userName: 'Demo User',
    userBio:
      "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'req-8',
    activityId: 'intent-3',
    userId: '1',
    userName: 'Demo User',
    userBio:
      "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
    userSkills: ['Python', 'React', 'Data Structures'],
    status: 'declined',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];
