/**
 * Seed Data Script for Testing AI Recommendation Engine
 * Run with: npm run seed or ts-node src/utils/seedData.ts
 */

import { User, Activity, ActivityRequest, Connection } from '../models';

// Seed users with diverse profiles
const SEED_USERS = [
  {
    email: 'alice@uw.edu',
    name: 'Alice Chen',
    bio: 'CS major interested in AI/ML. Love basketball and hackathons!',
    skills: ['Python', 'TensorFlow', 'React', 'Basketball'],
    activityTags: ['basketball', 'hackathon', 'coding', 'study group'],
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    campusLocation: 'CSE2 (Paul G. Allen Center)',
    phone: '206-555-0101',
    instagram: '@alice_chen',
    contactEmail: 'alice.chen@uw.edu',
  },
  {
    email: 'bob@uw.edu',
    name: 'Bob Martinez',
    bio: 'Fitness enthusiast and computer science student. Always down for a workout or study session.',
    skills: ['Java', 'Algorithms', 'Fitness Training'],
    activityTags: ['gym', 'fitness', 'study group', 'coding'],
    preferredTimes: ['Weekday Mornings', 'Weekend Mornings'],
    campusLocation: 'IMA (Intramural Activities Building)',
    phone: '206-555-0102',
    instagram: '@bob_fit',
  },
  {
    email: 'carol@uw.edu',
    name: 'Carol Williams',
    bio: 'Music lover and aspiring photographer. Let\'s jam or shoot some photos!',
    skills: ['Guitar', 'Photography', 'Video Editing'],
    activityTags: ['music', 'photography', 'art', 'coffee chat'],
    preferredTimes: ['Weekend Afternoons', 'Weekday Evenings'],
    campusLocation: 'HUB (Husky Union Building)',
    contactEmail: 'carol.williams@uw.edu',
  },
  {
    email: 'david@uw.edu',
    name: 'David Kim',
    bio: 'Basketball captain and coding bootcamp mentor. Let\'s play or code together!',
    skills: ['Basketball', 'JavaScript', 'Node.js', 'Leadership'],
    activityTags: ['basketball', 'soccer', 'coding', 'tutoring'],
    preferredTimes: ['Weekday Afternoons', 'Weekend Evenings'],
    campusLocation: 'IMA (Intramural Activities Building)',
    phone: '206-555-0103',
    instagram: '@davidkim_hoops',
  },
  {
    email: 'emma@uw.edu',
    name: 'Emma Johnson',
    bio: 'Yoga instructor and wellness advocate. Finding balance in life and code.',
    skills: ['Yoga', 'Meditation', 'Nutrition', 'Python'],
    activityTags: ['yoga', 'meditation', 'wellness', 'hiking'],
    preferredTimes: ['Weekday Mornings', 'Weekend Mornings'],
    campusLocation: 'IMA (Intramural Activities Building)',
    contactEmail: 'emma.wellness@uw.edu',
  },
  {
    email: 'frank@uw.edu',
    name: 'Frank Zhang',
    bio: 'Hackathon regular and AI researcher. Building the future one line of code at a time.',
    skills: ['Machine Learning', 'PyTorch', 'Research', 'Public Speaking'],
    activityTags: ['hackathon', 'research', 'coding', 'networking'],
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons', 'Flexible'],
    campusLocation: 'Allen Center',
    phone: '206-555-0104',
  },
  {
    email: 'grace@uw.edu',
    name: 'Grace Lee',
    bio: 'Design thinking enthusiast. Love UI/UX, coffee, and creative collaborations.',
    skills: ['Figma', 'UI/UX Design', 'React', 'Design Thinking'],
    activityTags: ['design', 'coffee chat', 'project collaboration', 'art'],
    preferredTimes: ['Weekday Afternoons', 'Weekend Afternoons'],
    campusLocation: 'HUB (Husky Union Building)',
    instagram: '@grace_designs',
  },
  {
    email: 'henry@uw.edu',
    name: 'Henry Patel',
    bio: 'Soccer player and study group organizer. Let\'s ace those exams together!',
    skills: ['Soccer', 'Teaching', 'Algorithms', 'Data Structures'],
    activityTags: ['soccer', 'study group', 'tutoring', 'networking'],
    preferredTimes: ['Weekday Evenings', 'Weekend Evenings'],
    campusLocation: 'Suzzallo Library',
    contactEmail: 'henry.study@uw.edu',
  },
  {
    email: 'iris@uw.edu',
    name: 'Iris Taylor',
    bio: 'Runner, writer, and coffee connoisseur. Always exploring new trails and ideas.',
    skills: ['Creative Writing', 'Running', 'Photography'],
    activityTags: ['running', 'hiking', 'writing', 'coffee chat'],
    preferredTimes: ['Weekend Mornings', 'Weekday Mornings'],
    campusLocation: 'Drumheller Fountain',
    instagram: '@iris_runs',
  },
  {
    email: 'jack@uw.edu',
    name: 'Jack Cooper',
    bio: 'Game developer and board game enthusiast. Let\'s play or build something cool!',
    skills: ['Unity', 'C#', 'Game Design', 'Board Games'],
    activityTags: ['game night', 'coding', 'project collaboration', 'party'],
    preferredTimes: ['Weekday Evenings', 'Weekend Evenings', 'Flexible'],
    campusLocation: 'HUB (Husky Union Building)',
    phone: '206-555-0105',
  },
];

// Seed activities created by users
const SEED_ACTIVITIES = [
  {
    title: 'Basketball Pickup Game',
    description: 'Looking for players for a casual pickup game. All skill levels welcome! Bring water and good vibes.',
    maxPeople: 10,
    currentPeople: 3,
    scheduledTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    campusLocation: 'IMA (Intramural Activities Building)',
    creatorEmail: 'alice@uw.edu', // Will be replaced with userId
  },
  {
    title: 'ML Study Group - Neural Networks',
    description: 'Weekly study session covering neural networks and deep learning. Working through Stanford CS231n materials.',
    maxPeople: 6,
    currentPeople: 2,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'CSE2 (Paul G. Allen Center)',
    creatorEmail: 'frank@uw.edu',
  },
  {
    title: 'Morning Yoga by the Fountain',
    description: 'Join me for sunrise yoga sessions. Beginner-friendly, bring your own mat. Let\'s start the day with mindfulness!',
    maxPeople: 8,
    currentPeople: 1,
    scheduledTimes: ['Weekday Mornings', 'Weekend Mornings'],
    campusLocation: 'Drumheller Fountain',
    creatorEmail: 'emma@uw.edu',
  },
  {
    title: 'Coffee & Code Chat',
    description: 'Casual meetup to discuss coding projects over coffee. Great for networking and getting feedback on your ideas.',
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Weekday Afternoons', 'Weekend Afternoons'],
    campusLocation: 'HUB (Husky Union Building)',
    creatorEmail: 'grace@uw.edu',
  },
  {
    title: 'Soccer Sunday League',
    description: 'Weekly Sunday soccer games. Looking for committed players for the rest of the quarter. Competitive but friendly!',
    maxPeople: 14,
    currentPeople: 8,
    scheduledTimes: ['Weekend Afternoons'],
    campusLocation: 'IMA (Intramural Activities Building)',
    creatorEmail: 'henry@uw.edu',
  },
  {
    title: 'Photography Walk - Campus Tour',
    description: 'Exploring beautiful spots on campus for photography. Beginners welcome, bring any camera (phone is fine!).',
    maxPeople: 6,
    currentPeople: 1,
    scheduledTimes: ['Weekend Afternoons'],
    campusLocation: 'Red Square',
    creatorEmail: 'carol@uw.edu',
  },
  {
    title: 'HuskyHacks Hackathon Team',
    description: 'Forming a team for the upcoming HuskyHacks. Looking for 2 more developers (frontend + ML preferred).',
    maxPeople: 4,
    currentPeople: 2,
    scheduledTimes: ['Weekend Evenings', 'Flexible'],
    campusLocation: 'Allen Center',
    creatorEmail: 'alice@uw.edu',
  },
  {
    title: 'Early Morning Run Club',
    description: '5-mile run around campus and Greenlake. Pace: 8-9 min/mile. Let\'s start the day energized!',
    maxPeople: 8,
    currentPeople: 3,
    scheduledTimes: ['Weekday Mornings', 'Weekend Mornings'],
    campusLocation: 'Drumheller Fountain',
    creatorEmail: 'iris@uw.edu',
  },
  {
    title: 'Board Game Night',
    description: 'Weekly board game sessions. We have Catan, Ticket to Ride, Codenames, and more. Snacks provided!',
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Weekday Evenings', 'Weekend Evenings'],
    campusLocation: 'HUB (Husky Union Building)',
    creatorEmail: 'jack@uw.edu',
  },
  {
    title: 'Gym Workout Buddies',
    description: 'Looking for workout partners for strength training sessions. Can help with form and programming!',
    maxPeople: 4,
    currentPeople: 1,
    scheduledTimes: ['Weekday Mornings', 'Weekday Afternoons'],
    campusLocation: 'IMA (Intramural Activities Building)',
    creatorEmail: 'bob@uw.edu',
  },
  {
    title: 'Algorithms Study Session',
    description: 'Preparing for technical interviews. Grinding LeetCode medium/hard problems together. CSE 373 students welcome!',
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'Suzzallo Library',
    creatorEmail: 'henry@uw.edu',
  },
  {
    title: 'Meditation & Mindfulness Circle',
    description: 'Guided meditation sessions for stress relief. Perfect for finals week anxiety. All experience levels welcome.',
    maxPeople: 10,
    currentPeople: 3,
    scheduledTimes: ['Weekday Evenings', 'Weekend Mornings'],
    campusLocation: 'IMA (Intramural Activities Building)',
    creatorEmail: 'emma@uw.edu',
  },
  {
    title: 'UI/UX Design Workshop',
    description: 'Hands-on workshop covering Figma basics and design principles. Bring your laptop and ideas!',
    maxPeople: 12,
    currentPeople: 5,
    scheduledTimes: ['Weekend Afternoons'],
    campusLocation: 'Allen Center',
    creatorEmail: 'grace@uw.edu',
  },
  {
    title: 'Tennis Anyone?',
    description: 'Casual tennis matches. Intermediate level preferred but all welcome. Bring your own racket!',
    maxPeople: 4,
    currentPeople: 2,
    scheduledTimes: ['Weekend Mornings', 'Weekday Afternoons'],
    campusLocation: 'IMA (Intramural Activities Building)',
    creatorEmail: 'david@uw.edu',
  },
  {
    title: 'Creative Writing Group',
    description: 'Share your creative writing and get feedback. Poetry, short stories, anything goes. Supportive environment!',
    maxPeople: 8,
    currentPeople: 3,
    scheduledTimes: ['Weekend Afternoons'],
    campusLocation: 'HUB (Husky Union Building)',
    creatorEmail: 'iris@uw.edu',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await ActivityRequest.destroy({ where: {} });
    await Connection.destroy({ where: {} });
    await Activity.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Create users
    console.log('👥 Creating users...');
    const users = [];
    for (const userData of SEED_USERS) {
      const user = await User.create({
        ...userData,
        googleId: `google_${userData.email.split('@')[0]}`,
        profilePicture: `https://i.pravatar.cc/150?u=${userData.email}`,
      });
      users.push(user);
      console.log(`  ✓ Created user: ${user.name}`);
    }

    // Create a map of email to userId
    const emailToUser = new Map(users.map(u => [u.email, u]));

    // Create activities
    console.log('🎯 Creating activities...');
    const activities = [];
    for (const activityData of SEED_ACTIVITIES) {
      const creator = emailToUser.get(activityData.creatorEmail);
      if (!creator) continue;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { creatorEmail, ...activityFields } = activityData;
      const activity = await Activity.create({
        ...activityFields,
        userId: creator.id,
        userName: creator.name,
        status: 'active',
      });
      activities.push(activity);
      console.log(`  ✓ Created activity: ${activity.title}`);
    }

    // Create connections (social graph)
    console.log('🤝 Creating connections...');
    const connectionPairs = [
      ['alice@uw.edu', 'frank@uw.edu'], // Both interested in hackathons/coding
      ['alice@uw.edu', 'david@uw.edu'], // Both play basketball
      ['bob@uw.edu', 'emma@uw.edu'],    // Both fitness enthusiasts
      ['carol@uw.edu', 'grace@uw.edu'], // Both creative types
      ['carol@uw.edu', 'iris@uw.edu'],  // Both into photography/writing
      ['david@uw.edu', 'henry@uw.edu'], // Both play sports
      ['frank@uw.edu', 'grace@uw.edu'], // Tech collaboration
      ['henry@uw.edu', 'alice@uw.edu'], // Study buddies
      ['iris@uw.edu', 'emma@uw.edu'],   // Wellness/mindfulness
      ['jack@uw.edu', 'frank@uw.edu'],  // Gaming/coding
    ];

    for (const [email1, email2] of connectionPairs) {
      const user1 = emailToUser.get(email1);
      const user2 = emailToUser.get(email2);
      if (user1 && user2) {
        // Create bidirectional connections
        await Connection.create({
          userId: user1.id,
          connectedUserId: user2.id,
        });
        await Connection.create({
          userId: user2.id,
          connectedUserId: user1.id,
        });
        console.log(`  ✓ Connected: ${user1.name} ↔ ${user2.name}`);
      }
    }

    // Create activity requests (for collaborative filtering)
    console.log('📝 Creating activity requests...');
    const requestData = [
      // Alice's requests (basketball, coding)
      { userEmail: 'alice@uw.edu', activityTitle: 'ML Study Group - Neural Networks', status: 'approved' },
      { userEmail: 'alice@uw.edu', activityTitle: 'Coffee & Code Chat', status: 'approved' },

      // Bob's requests (fitness)
      { userEmail: 'bob@uw.edu', activityTitle: 'Morning Yoga by the Fountain', status: 'approved' },
      { userEmail: 'bob@uw.edu', activityTitle: 'Early Morning Run Club', status: 'pending' },

      // Carol's requests (creative)
      { userEmail: 'carol@uw.edu', activityTitle: 'UI/UX Design Workshop', status: 'approved' },
      { userEmail: 'carol@uw.edu', activityTitle: 'Creative Writing Group', status: 'approved' },

      // David's requests (basketball, sports)
      { userEmail: 'david@uw.edu', activityTitle: 'Basketball Pickup Game', status: 'approved' },
      { userEmail: 'david@uw.edu', activityTitle: 'Soccer Sunday League', status: 'approved' },

      // Emma's requests (wellness)
      { userEmail: 'emma@uw.edu', activityTitle: 'Early Morning Run Club', status: 'approved' },

      // Frank's requests (hackathon, coding)
      { userEmail: 'frank@uw.edu', activityTitle: 'HuskyHacks Hackathon Team', status: 'approved' },
      { userEmail: 'frank@uw.edu', activityTitle: 'Algorithms Study Session', status: 'pending' },

      // Grace's requests (design, coffee)
      { userEmail: 'grace@uw.edu', activityTitle: 'Photography Walk - Campus Tour', status: 'approved' },

      // Henry's requests (study, sports)
      { userEmail: 'henry@uw.edu', activityTitle: 'Basketball Pickup Game', status: 'approved' },
      { userEmail: 'henry@uw.edu', activityTitle: 'ML Study Group - Neural Networks', status: 'approved' },

      // Iris's requests (running, writing)
      { userEmail: 'iris@uw.edu', activityTitle: 'Meditation & Mindfulness Circle', status: 'approved' },

      // Jack's requests (gaming, coding)
      { userEmail: 'jack@uw.edu', activityTitle: 'Coffee & Code Chat', status: 'pending' },
      { userEmail: 'jack@uw.edu', activityTitle: 'HuskyHacks Hackathon Team', status: 'approved' },
    ];

    for (const request of requestData) {
      const user = emailToUser.get(request.userEmail);
      const activity = activities.find(a => a.title === request.activityTitle);

      if (user && activity) {
        await ActivityRequest.create({
          activityId: activity.id,
          userId: user.id,
          userName: user.name,
          userBio: user.bio,
          userSkills: user.skills,
          status: request.status as 'pending' | 'approved' | 'declined',
        });
        console.log(`  ✓ Request: ${user.name} → ${activity.title} (${request.status})`);
      }
    }

    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users created: ${users.length}`);
    console.log(`  - Activities created: ${activities.length}`);
    console.log(`  - Connections created: ${connectionPairs.length * 2} (bidirectional)`);
    console.log(`  - Activity requests created: ${requestData.length}`);
    console.log('\n💡 Test the recommendation engine with different user IDs:');
    users.slice(0, 5).forEach(u => {
      console.log(`  - ${u.name} (${u.email}): ${u.id}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n👋 Seeding complete! Exiting...');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;
