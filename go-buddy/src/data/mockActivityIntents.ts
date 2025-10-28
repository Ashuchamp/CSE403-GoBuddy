import {ActivityIntent} from '../types';

export const mockActivityIntents: ActivityIntent[] = [
  {
    id: 'intent-1',
    userId: 'user-1',
    userName: 'Sarah Chen',
    title: 'Evening Study Group - CSE 143',
    description:
      'Looking for motivated students to form a study group for CSE 143. We can meet at Odegaard Library and work through problem sets together.',
    maxPeople: 4,
    currentPeople: 2,
    scheduledTimes: ['Wed 6-8pm', 'Fri 5-7pm'],
    createdAt: '2024-10-05',
    campusLocation: 'Odegaard Library',
  },
  {
    id: 'intent-2',
    userId: 'user-3',
    userName: 'Mike Johnson',
    title: 'Basketball Pickup Game',
    description:
      'Regular pickup basketball games at the IMA. All skill levels welcome! We usually play 5v5 full court.',
    maxPeople: 10,
    currentPeople: 6,
    scheduledTimes: ['Tue 7-9pm', 'Thu 7-9pm', 'Sun 2-4pm'],
    createdAt: '2024-10-04',
    campusLocation: 'IMA',
  },
  {
    id: 'intent-3',
    userId: 'user-5',
    userName: 'Emily Rodriguez',
    title: 'Photography Walk Around Campus',
    description:
      "Exploring different parts of campus for photography. Bring your camera (phone cameras totally fine!) and let's capture some beautiful shots.",
    maxPeople: 6,
    currentPeople: 3,
    scheduledTimes: ['Sat 10am-12pm'],
    createdAt: '2024-10-06',
    campusLocation: 'Quad',
  },
  {
    id: 'intent-4',
    userId: 'user-7',
    userName: 'David Kim',
    title: 'Chemistry Lab Study Session',
    description:
      "Need help with Chem 152? Let's work through lab reports and practice problems together. I have notes from previous quarters.",
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Mon 3-5pm', 'Wed 1-3pm'],
    createdAt: '2024-10-05',
    campusLocation: 'Bagley Hall',
  },
  {
    id: 'intent-5',
    userId: 'user-9',
    userName: 'Lisa Wang',
    title: 'Ultimate Frisbee Practice',
    description:
      'Join our casual ultimate frisbee group! We focus on learning the basics and having fun. No experience necessary.',
    maxPeople: 12,
    currentPeople: 8,
    scheduledTimes: ['Sat 1-3pm'],
    createdAt: '2024-10-03',
    campusLocation: 'Intramural Activities Building',
  },
  {
    id: 'intent-6',
    userId: 'user-2',
    userName: 'Alex Thompson',
    title: 'Guitar Jam Session',
    description:
      "Calling all musicians! Let's get together for some casual jamming. Bring your instruments or just come to listen and sing along.",
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Sun 6-8pm'],
    createdAt: '2024-10-07',
    campusLocation: 'HUB',
  },
];
