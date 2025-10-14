import { User } from '../App';

export type ConnectionRequest = {
  id: string;
  from: User;
  message?: string;
  sharedContact?: {
    phone?: string;
    instagram?: string;
  };
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
};

export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'req1',
    from: {
      id: '3',
      email: 'mike.chen@uw.edu',
      name: 'Mike Chen',
      bio: 'CSE major who loves basketball and coding. Always down to work on side projects!',
      skills: ['Java', 'C++', 'Machine Learning', 'iOS Development'],
      preferredTimes: ['Weekday Afternoons', 'Weekend Mornings'],
      activityTags: ['Basketball', 'CSE 373', 'Coding Projects', 'Gym', 'Gaming'],
      phone: '425-555-0198',
      instagram: '@mikechen_dev',
      campusLocation: 'North Campus',
    },
    message: 'Hey! I saw you\'re also interested in CSE 373 study groups. Want to team up for the upcoming assignments?',
    sharedContact: {
      instagram: '@mikechen_dev',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'pending',
  },
  {
    id: 'req2',
    from: {
      id: '2',
      email: 'sarah.j@uw.edu',
      name: 'Sarah Johnson',
      bio: 'Senior studying Biology. Love hiking, study groups, and playing soccer on weekends!',
      skills: ['Molecular Biology', 'Lab Techniques', 'Scientific Writing'],
      preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
      activityTags: ['Soccer', 'Hiking', 'BIO 180', 'Study Groups', 'Coffee'],
      phone: '206-555-0124',
      instagram: '@sarahj_uw',
      campusLocation: 'South Campus',
    },
    message: 'Would love to go on a hike this weekend if you\'re free!',
    sharedContact: {
      phone: '206-555-0124',
      instagram: '@sarahj_uw',
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    status: 'pending',
  },
  {
    id: 'req3',
    from: {
      id: '5',
      email: 'alex.rodriguez@uw.edu',
      name: 'Alex Rodriguez',
      bio: 'Econ student and gym enthusiast. Love playing tennis and discussing markets!',
      skills: ['Financial Analysis', 'Excel', 'Economics', 'Statistics'],
      preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
      activityTags: ['Gym', 'Tennis', 'ECON 200', 'Finance Club', 'Investing'],
      phone: '253-555-0177',
      instagram: '@alexr_uw',
      campusLocation: 'North Campus',
    },
    message: 'Looking for a gym buddy for morning workouts. Interested?',
    sharedContact: {
      instagram: '@alexr_uw',
    },
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    status: 'pending',
  },
];
