/**
 * Comprehensive seed script matching ALL frontend mock data
 * Run with: npm run seed
 */

import sequelize from './config/database';
import {User, Activity, ActivityRequest, ConnectionRequest, Connection} from './models';

// Demo User (ID 1) - Login with demo@uw.edu to see MyActivities data
const demoUser = {
  email: 'demo@uw.edu',
  name: 'Demo User',
  googleId: 'demo-google-id', // Matches the "Skip to Demo" button
  bio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
  preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
  activityTags: ['Gym', 'Study Groups', 'Coffee', 'Hiking'],
  phone: '206-555-0100',
  instagram: '@demouser_uw',
  contactEmail: 'demouser.contact@gmail.com',
  campusLocation: 'North Campus',
};

// ALL Mock Users (exactly from mockUsers.ts - IDs 2-12)
const mockUsers = [
  {
    email: 'sarah.j@uw.edu',
    name: 'Sarah Johnson',
    bio: 'Senior studying Biology. Love hiking, study groups, and playing soccer on weekends!',
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    activityTags: ['Soccer', 'Hiking', 'BIO 180', 'Study Groups', 'Coffee'],
    phone: '206-555-0124',
    instagram: '@sarahj_uw',
    contactEmail: 'sarah.johnson.bio@gmail.com',
    campusLocation: 'South Campus',
  },
  {
    email: 'mike.chen@uw.edu',
    name: 'Mike Chen',
    bio: 'CSE major who loves basketball and coding. Always down to work on side projects!',
    preferredTimes: ['Weekday Afternoons', 'Weekend Mornings'],
    activityTags: ['Basketball', 'CSE 373', 'Coding Projects', 'Gym', 'Gaming'],
    phone: '425-555-0198',
    instagram: '@mikechen_dev',
    campusLocation: 'North Campus',
  },
  {
    email: 'emily.park@uw.edu',
    name: 'Emily Park',
    bio: 'Psychology major interested in research and coffee chats. Looking for study buddies for stats!',
    preferredTimes: ['Weekday Mornings', 'Weekday Afternoons'],
    activityTags: ['PSYCH 210', 'Study Groups', 'Coffee', 'Running', 'Photography'],
    instagram: '@emilyp.uw',
    contactEmail: 'emilypark.psych@outlook.com',
    campusLocation: 'Central Campus',
  },
  {
    email: 'alex.rodriguez@uw.edu',
    name: 'Alex Rodriguez',
    bio: 'Econ student and gym enthusiast. Love playing tennis and discussing markets!',
    preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
    activityTags: ['Gym', 'Tennis', 'ECON 200', 'Finance Club', 'Investing'],
    phone: '253-555-0177',
    instagram: '@alexr_uw',
    campusLocation: 'North Campus',
  },
  {
    email: 'jessica.kim@uw.edu',
    name: 'Jessica Kim',
    bio: 'Art major looking for creative collaborators! Also love yoga and exploring Seattle.',
    preferredTimes: ['Weekend Afternoons', 'Weekend Evenings'],
    activityTags: ['Art', 'Design', 'Yoga', 'Photography', 'Exploring Seattle'],
    instagram: '@jess.creates',
    campusLocation: 'South Campus',
  },
  {
    email: 'david.nguyen@uw.edu',
    name: 'David Nguyen',
    bio: 'Pre-med studying hard! Looking for study partners for organic chem and fellow gym-goers.',
    preferredTimes: ['Weekday Mornings', 'Weekday Evenings'],
    activityTags: ['CHEM 238', 'Study Groups', 'Gym', 'Meal Prep', 'Running'],
    phone: '206-555-0155',
    campusLocation: 'South Campus',
  },
  {
    email: 'rachel.brown@uw.edu',
    name: 'Rachel Brown',
    bio: 'Music major and coffee addict. Always looking for people to jam with or grab coffee!',
    preferredTimes: ['Weekend Mornings', 'Weekend Afternoons'],
    activityTags: ['Music', 'Piano', 'Coffee', 'Concerts', 'Songwriting'],
    instagram: '@rachelmusic',
    campusLocation: 'Central Campus',
  },
  {
    email: 'james.lee@uw.edu',
    name: 'James Lee',
    bio: 'Business student passionate about entrepreneurship. Love soccer and networking events!',
    preferredTimes: ['Weekday Afternoons', 'Weekend Evenings'],
    activityTags: ['Soccer', 'Entrepreneurship', 'Business Club', 'Networking', 'Startup'],
    phone: '425-555-0143',
    instagram: '@jameslee_biz',
    campusLocation: 'North Campus',
  },
  {
    email: 'olivia.white@uw.edu',
    name: 'Olivia White',
    bio: 'Environmental Science major. Love hiking, sustainability projects, and study groups!',
    preferredTimes: ['Weekend Mornings', 'Weekend Afternoons'],
    activityTags: ['Hiking', 'Environmental Club', 'Study Groups', 'Volunteering', 'Camping'],
    campusLocation: 'South Campus',
  },
  {
    email: 'chris.davis@uw.edu',
    name: 'Chris Davis',
    bio: 'Math major who loves problem-solving and rock climbing. Looking for study partners!',
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    activityTags: ['Rock Climbing', 'MATH 308', 'Study Groups', 'Chess', 'Puzzles'],
    phone: '206-555-0188',
    campusLocation: 'Central Campus',
  },
  {
    email: 'sophia.martinez@uw.edu',
    name: 'Sophia Martinez',
    bio: 'Public Health student interested in global health and volunteering. Love running too!',
    preferredTimes: ['Weekday Mornings', 'Weekend Mornings'],
    activityTags: ['Running', 'Volunteering', 'Public Health Club', 'Study Groups', 'Coffee'],
    instagram: '@sophiam_uw',
    campusLocation: 'South Campus',
  },
  {
    email: 'nathan.brooks@uw.edu',
    name: 'Nathan Brooks',
    bio: 'CS and Math double major. Love competitive programming and teaching others!',
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    activityTags: ['Coding', 'ACM', 'Study Groups', 'Hackathons', 'Chess'],
    phone: '425-555-0221',
    instagram: '@nathancodes',
    campusLocation: 'North Campus',
  },
  {
    email: 'maria.gonzalez@uw.edu',
    name: 'Maria Gonzalez',
    bio: 'Biochemistry major and yoga instructor. Looking for lab partners and wellness buddies!',
    preferredTimes: ['Weekend Mornings', 'Weekday Mornings'],
    activityTags: ['BIOC 405', 'Yoga', 'Wellness', 'Study Groups', 'Lab Work'],
    instagram: '@maria_wellness',
    contactEmail: 'maria.wellness@gmail.com',
    campusLocation: 'South Campus',
  },
  {
    email: 'kevin.huang@uw.edu',
    name: 'Kevin Huang',
    bio: 'Electrical Engineering student into robotics and tinkering. Always building something cool!',
    preferredTimes: ['Weekday Afternoons', 'Weekend Evenings'],
    activityTags: ['Robotics', 'Engineering', 'Makerspace', 'EE 215', 'Projects'],
    phone: '206-555-0244',
    campusLocation: 'North Campus',
  },
  {
    email: 'amanda.taylor@uw.edu',
    name: 'Amanda Taylor',
    bio: 'Journalism student covering campus events. Love writing, photography, and meeting people!',
    preferredTimes: ['Weekday Afternoons', 'Weekend Afternoons'],
    activityTags: ['Writing', 'Photography', 'The Daily', 'Coffee', 'Networking'],
    instagram: '@amandawrites_uw',
    campusLocation: 'Central Campus',
  },
  {
    email: 'ryan.patel@uw.edu',
    name: 'Ryan Patel',
    bio: 'Finance major and gym rat. Love discussing stocks and working out!',
    preferredTimes: ['Weekday Mornings', 'Weekday Evenings'],
    activityTags: ['Gym', 'Finance Club', 'Investing', 'ECON 300', 'Powerlifting'],
    phone: '253-555-0267',
    instagram: '@ryanlifts',
    campusLocation: 'North Campus',
  },
  {
    email: 'jennifer.liu@uw.edu',
    name: 'Jennifer Liu',
    bio: 'Architecture student passionate about sustainable design. Love sketching and exploring!',
    preferredTimes: ['Weekend Afternoons', 'Weekday Evenings'],
    activityTags: ['Architecture', 'Design', 'Sustainability', 'Art', 'Urban Planning'],
    instagram: '@jenniferdesigns',
    campusLocation: 'Central Campus',
  },
  {
    email: 'tyler.anderson@uw.edu',
    name: 'Tyler Anderson',
    bio: 'Political Science major and debate team member. Love discussing current events!',
    preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
    activityTags: ['Debate', 'POL S 201', 'Study Groups', 'Current Events', 'Coffee'],
    phone: '425-555-0289',
    campusLocation: 'South Campus',
  },
  {
    email: 'nicole.santos@uw.edu',
    name: 'Nicole Santos',
    bio: 'Neuroscience student researching brain plasticity. Love running and science outreach!',
    preferredTimes: ['Weekday Mornings', 'Weekend Mornings'],
    activityTags: ['Running', 'Neuroscience', 'Research', 'Study Groups', 'STEM Outreach'],
    instagram: '@nicole_neuro',
    contactEmail: 'nicole.brain@outlook.com',
    campusLocation: 'South Campus',
  },
  {
    email: 'brandon.lee@uw.edu',
    name: 'Brandon Lee',
    bio: 'Film & Media student making documentaries. Always looking for creative collaborators!',
    preferredTimes: ['Weekend Afternoons', 'Weekday Evenings'],
    activityTags: ['Film', 'Video Production', 'Photography', 'Creative Projects', 'Art'],
    instagram: '@brandonfilms',
    campusLocation: 'Central Campus',
  },
  {
    email: 'stephanie.wright@uw.edu',
    name: 'Stephanie Wright',
    bio: 'Linguistics major fascinated by language! Love learning new languages and cultural exchange.',
    preferredTimes: ['Weekday Afternoons', 'Weekend Mornings'],
    activityTags: ['Languages', 'LING 200', 'Study Groups', 'Cultural Exchange', 'Coffee'],
    phone: '206-555-0311',
    instagram: '@steph_polyglot',
    campusLocation: 'Central Campus',
  },
];

// Users who create activities (from mockActivityIntents.ts)
const activityCreators = [
  {
    email: 'sarah.chen@uw.edu',
    name: 'Sarah Chen',
    bio: 'Computer Science student who loves studying in groups',
    preferredTimes: ['Evenings', 'Weekends'],
    activityTags: ['Study Groups', 'CSE'],
    campusLocation: 'North Campus',
  },
  {
    email: 'mike.johnson@uw.edu',
    name: 'Mike Johnson',
    bio: 'Sports enthusiast and basketball player',
    preferredTimes: ['Evenings'],
    activityTags: ['Basketball', 'Sports'],
    campusLocation: 'IMA',
  },
  {
    email: 'emily.rodriguez@uw.edu',
    name: 'Emily Rodriguez',
    bio: 'Photography and art lover',
    preferredTimes: ['Weekends'],
    activityTags: ['Photography', 'Art'],
    campusLocation: 'Central Campus',
  },
  {
    email: 'david.kim@uw.edu',
    name: 'David Kim',
    bio: 'Chemistry major helping fellow students',
    preferredTimes: ['Afternoons'],
    activityTags: ['Study Groups', 'Chemistry'],
    campusLocation: 'South Campus',
  },
  {
    email: 'lisa.wang@uw.edu',
    name: 'Lisa Wang',
    bio: 'Ultimate frisbee team captain',
    preferredTimes: ['Weekends'],
    activityTags: ['Frisbee', 'Sports'],
    campusLocation: 'IMA',
  },
  {
    email: 'alex.thompson@uw.edu',
    name: 'Alex Thompson',
    bio: 'Musician and guitar enthusiast',
    preferredTimes: ['Evenings'],
    activityTags: ['Music', 'Guitar'],
    campusLocation: 'HUB',
  },
  {
    email: 'zoe.garcia@uw.edu',
    name: 'Zoe Garcia',
    bio: 'Yoga instructor and wellness advocate',
    preferredTimes: ['Mornings', 'Evenings'],
    activityTags: ['Yoga', 'Wellness', 'Meditation'],
    campusLocation: 'IMA',
  },
  {
    email: 'tom.williams@uw.edu',
    name: 'Tom Williams',
    bio: 'Board game enthusiast and strategy lover',
    preferredTimes: ['Evenings', 'Weekends'],
    activityTags: ['Board Games', 'Gaming', 'Social'],
    campusLocation: 'HUB',
  },
  {
    email: 'maya.patel@uw.edu',
    name: 'Maya Patel',
    bio: 'Dance team member and choreographer',
    preferredTimes: ['Evenings', 'Weekends'],
    activityTags: ['Dance', 'Performance', 'Fitness'],
    campusLocation: 'IMA',
  },
  {
    email: 'carlos.rivera@uw.edu',
    name: 'Carlos Rivera',
    bio: 'Spanish conversation group leader',
    preferredTimes: ['Afternoons', 'Evenings'],
    activityTags: ['Languages', 'Spanish', 'Cultural Exchange'],
    campusLocation: 'Raitt Hall',
  },
];

// ALL Activities (exactly from mockActivityIntents.ts)
const mockActivities = [
  {
    creatorEmail: 'sarah.chen@uw.edu',
    title: 'Evening Study Group - CSE 143',
    description:
      'Looking for motivated students to form a study group for CSE 143. We can meet at Odegaard Library and work through problem sets together.',
    maxPeople: 4,
    currentPeople: 2,
    scheduledTimes: ['Wed 6-8pm', 'Fri 5-7pm'],
    campusLocation: 'Odegaard Library',
  },
  {
    creatorEmail: 'mike.johnson@uw.edu',
    title: 'Basketball Pickup Game',
    description:
      'Regular pickup basketball games at the IMA. All skill levels welcome! We usually play 5v5 full court.',
    maxPeople: 10,
    currentPeople: 6,
    scheduledTimes: ['Tue 7-9pm', 'Thu 7-9pm', 'Sun 2-4pm'],
    campusLocation: 'IMA',
  },
  {
    creatorEmail: 'emily.rodriguez@uw.edu',
    title: 'Photography Walk Around Campus',
    description:
      "Exploring different parts of campus for photography. Bring your camera (phone cameras totally fine!) and let's capture some beautiful shots.",
    maxPeople: 6,
    currentPeople: 3,
    scheduledTimes: ['Sat 10am-12pm'],
    campusLocation: 'Quad',
  },
  {
    creatorEmail: 'david.kim@uw.edu',
    title: 'Chemistry Lab Study Session',
    description:
      "Need help with Chem 152? Let's work through lab reports and practice problems together. I have notes from previous quarters.",
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Mon 3-5pm', 'Wed 1-3pm'],
    campusLocation: 'Bagley Hall',
  },
  {
    creatorEmail: 'lisa.wang@uw.edu',
    title: 'Ultimate Frisbee Practice',
    description:
      'Join our casual ultimate frisbee group! We focus on learning the basics and having fun. No experience necessary.',
    maxPeople: 12,
    currentPeople: 8,
    scheduledTimes: ['Sat 1-3pm'],
    campusLocation: 'Intramural Activities Building',
  },
  {
    creatorEmail: 'alex.thompson@uw.edu',
    title: 'Guitar Jam Session',
    description:
      "Calling all musicians! Let's get together for some casual jamming. Bring your instruments or just come to listen and sing along.",
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Sun 6-8pm'],
    campusLocation: 'HUB',
  },
  {
    creatorEmail: 'zoe.garcia@uw.edu',
    title: 'Morning Yoga & Meditation',
    description:
      'Start your day with gentle yoga and guided meditation. Perfect for beginners and experienced yogis alike. Bring your own mat!',
    maxPeople: 15,
    currentPeople: 7,
    scheduledTimes: ['Mon 7-8am', 'Wed 7-8am', 'Fri 7-8am'],
    campusLocation: 'IMA Studio',
  },
  {
    creatorEmail: 'tom.williams@uw.edu',
    title: 'Board Game Night',
    description:
      "Love strategy games? Join us for weekly board game nights! We play everything from Settlers of Catan to Ticket to Ride. All games provided.",
    maxPeople: 10,
    currentPeople: 5,
    scheduledTimes: ['Thu 7-10pm'],
    campusLocation: 'HUB Commuter & Transfer Center',
  },
  {
    creatorEmail: 'maya.patel@uw.edu',
    title: 'Hip Hop Dance Workshop',
    description:
      'Learn hip hop choreography in a fun, supportive environment! No dance experience required. Come ready to move and have fun!',
    maxPeople: 20,
    currentPeople: 12,
    scheduledTimes: ['Tue 6-7:30pm', 'Thu 6-7:30pm'],
    campusLocation: 'IMA Dance Studio',
  },
  {
    creatorEmail: 'carlos.rivera@uw.edu',
    title: 'Spanish Conversation Group',
    description:
      'Practice your Spanish in a relaxed setting! All levels welcome. We discuss current events, culture, and everyday topics in Spanish.',
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Wed 4-5:30pm'],
    campusLocation: 'Raitt Hall Language Lab',
  },
  {
    creatorEmail: 'emily.rodriguez@uw.edu',
    title: 'Weekend Hiking Trip - Rattlesnake Ledge',
    description:
      "Let's explore the beautiful PNW trails! This weekend we're hitting Rattlesnake Ledge. Moderate difficulty, amazing views. Carpooling available.",
    maxPeople: 8,
    currentPeople: 3,
    scheduledTimes: ['Sat 8am-2pm'],
    campusLocation: 'Meet at UW Parking',
  },
  {
    creatorEmail: 'sarah.chen@uw.edu',
    title: 'Hackathon Prep Team',
    description:
      'Forming a team for upcoming hackathons! Looking for developers, designers, and project managers. Great for building your portfolio.',
    maxPeople: 5,
    currentPeople: 2,
    scheduledTimes: ['Sat 1-5pm', 'Sun 1-5pm'],
    campusLocation: 'CSE2 Breakout Room',
  },
  {
    creatorEmail: 'david.kim@uw.edu',
    title: 'Coffee & Psychology Study Group',
    description:
      'Study group for PSYCH 210 students. We meet at a coffee shop to review lectures, share notes, and prepare for exams together.',
    maxPeople: 6,
    currentPeople: 3,
    scheduledTimes: ['Tue 2-4pm', 'Thu 3-5pm'],
    campusLocation: 'Allegro Coffee',
  },
  {
    creatorEmail: 'mike.johnson@uw.edu',
    title: 'Tennis Practice & Play',
    description:
      'Weekly tennis sessions for all skill levels. We do drills, practice serves, and play matches. Rackets available if needed.',
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Sat 9-11am', 'Sun 9-11am'],
    campusLocation: 'IMA Tennis Courts',
  },
  {
    creatorEmail: 'emily.rodriguez@uw.edu',
    title: 'Digital Art & Design Meetup',
    description:
      'Calling all digital artists and designers! Work on personal projects, share techniques, and get feedback in a creative community.',
    maxPeople: 10,
    currentPeople: 5,
    scheduledTimes: ['Fri 4-7pm'],
    campusLocation: 'Art Building Computer Lab',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting comprehensive database seed...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database
    await sequelize.sync({force: false});
    console.log('✅ Database synced');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Connection.destroy({where: {}});
    await ConnectionRequest.destroy({where: {}});
    await ActivityRequest.destroy({where: {}});
    await Activity.destroy({where: {}});
    await User.destroy({where: {}});

    // Create Demo User FIRST (so they can have activities)
    console.log('👤 Creating Demo User...');
    const createdDemoUser = await User.create(demoUser);
    console.log(`✅ Created Demo User: ${createdDemoUser.email}`);

    // Create ALL mock users (IDs 2-12)
    console.log('👥 Creating mock users (11 total)...');
    const createdMockUsers = await User.bulkCreate(mockUsers);
    console.log(`✅ Created ${createdMockUsers.length} mock users`);

    // Create activity creator users
    console.log('👥 Creating activity creators (6 total)...');
    const createdCreators = await User.bulkCreate(activityCreators);
    console.log(`✅ Created ${createdCreators.length} activity creators`);

    // Map creator emails to user objects
    const creatorMap = new Map();
    createdCreators.forEach((user) => {
      creatorMap.set(user.email, user);
    });

    // Create ALL activities with correct creators
    console.log('🎯 Creating activities (6 total)...');
    const activitiesWithCreators = mockActivities.map((activity) => {
      const creator = creatorMap.get(activity.creatorEmail);
      if (!creator) {
        throw new Error(`Creator not found: ${activity.creatorEmail}`);
      }
      return {
        title: activity.title,
        description: activity.description,
        maxPeople: activity.maxPeople,
        currentPeople: activity.currentPeople,
        scheduledTimes: activity.scheduledTimes,
        campusLocation: activity.campusLocation,
        userId: creator.id,
        userName: creator.name,
      };
    });

    const createdActivities = await Activity.bulkCreate(activitiesWithCreators);
    console.log(`✅ Created ${createdActivities.length} activities`);

    // Create Demo User's Activities (for MyActivities "Organizing" tab)
    console.log('🎯 Creating Demo User activities (for MyActivities)...');
    const demoActivities = [
      {
        title: 'Study Group - Data Structures',
        description: 'Working through CSE 373 problem sets. Looking for study partners!',
        maxPeople: 4,
        currentPeople: 1,
        scheduledTimes: ['Mon 5-7pm', 'Wed 5-7pm'],
        campusLocation: 'Allen Library',
        userId: createdDemoUser.id,
        userName: createdDemoUser.name,
      },
      {
        title: 'Morning Gym Buddy Needed',
        description: 'Regular gym sessions at the IMA. Looking for workout buddies!',
        maxPeople: 3,
        currentPeople: 1,
        scheduledTimes: ['Mon-Fri 7-8am'],
        campusLocation: 'IMA',
        userId: createdDemoUser.id,
        userName: createdDemoUser.name,
      },
    ];
    const createdDemoActivities = await Activity.bulkCreate(demoActivities);
    console.log(`✅ Created ${createdDemoActivities.length} activities by Demo User`);

    // Create Activity Requests matching mockActivityRequests.ts
    console.log('📝 Creating activity requests...');
    const requests: Array<{
      activityId: string;
      userId: string;
      userName: string;
      userBio: string;
      userSkills: string[];
      status: 'pending' | 'approved' | 'declined';
    }> = [];

    // === Requests TO Demo User's activities (for "Organizing" tab) ===
    
    // Sarah Johnson wants to join Demo User's study group - PENDING
    requests.push({
      activityId: createdDemoActivities[0].id, // demo-activity-1
      userId: createdMockUsers[0].id, // Sarah Johnson
      userName: createdMockUsers[0].name,
      userBio: createdMockUsers[0].bio,
      userSkills: [],
      status: 'pending' as const,
    });

    // Mike Chen wants to join Demo User's study group - PENDING
    requests.push({
      activityId: createdDemoActivities[0].id, // demo-activity-1
      userId: createdMockUsers[1].id, // Mike Chen
      userName: createdMockUsers[1].name,
      userBio: createdMockUsers[1].bio,
      userSkills: [],
      status: 'pending' as const,
    });

    // Emily Park wants to join Demo User's study group - APPROVED
    requests.push({
      activityId: createdDemoActivities[0].id, // demo-activity-1
      userId: createdMockUsers[2].id, // Emily Park
      userName: createdMockUsers[2].name,
      userBio: createdMockUsers[2].bio,
      userSkills: [],
      status: 'approved' as const,
    });

    // Alex Rodriguez wants to join Demo User's gym - PENDING
    requests.push({
      activityId: createdDemoActivities[1].id, // demo-activity-2
      userId: createdMockUsers[3].id, // Alex Rodriguez
      userName: createdMockUsers[3].name,
      userBio: createdMockUsers[3].bio,
      userSkills: [],
      status: 'pending' as const,
    });

    // Jessica Kim wants to join Demo User's gym - PENDING
    requests.push({
      activityId: createdDemoActivities[1].id, // demo-activity-2
      userId: createdMockUsers[4].id, // Jessica Kim
      userName: createdMockUsers[4].name,
      userBio: createdMockUsers[4].bio,
      userSkills: [],
      status: 'pending' as const,
    });

    // === Requests FROM Demo User to join other activities (for "Participating" tab) ===
    
    // Demo User wants to join CSE 143 Study Group (intent-1) - PENDING
    requests.push({
      activityId: createdActivities[0].id, // CSE 143 Study Group
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: [],
      status: 'pending' as const,
    });

    // Demo User wants to join Basketball (intent-2) - APPROVED
    requests.push({
      activityId: createdActivities[1].id, // Basketball
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: [],
      status: 'approved' as const,
    });

    // Demo User wants to join Photography Walk (intent-3) - DECLINED
    requests.push({
      activityId: createdActivities[2].id, // Photography Walk
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: [],
      status: 'declined' as const,
    });

    const createdRequests = await ActivityRequest.bulkCreate(requests);
    console.log(`✅ Created ${createdRequests.length} activity requests`);

    // === Connection Requests and Connections ===
    console.log('🤝 Creating connection requests and connections...');
    
    // Connection requests RECEIVED by Demo User (pending)
    const receivedConnectionRequests = [
      {
        fromUserId: createdMockUsers[5].id, // David Nguyen
        toUserId: createdDemoUser.id,
        message: 'Hey! I saw you\'re looking for gym buddies. Would love to connect!',
        status: 'pending' as const,
      },
      {
        fromUserId: createdMockUsers[7].id, // James Lee
        toUserId: createdDemoUser.id,
        message: 'Hi! I\'m also a CS student. Let\'s connect and maybe work on projects together!',
        status: 'pending' as const,
      },
      {
        fromUserId: createdMockUsers[6].id, // Rachel Brown
        toUserId: createdDemoUser.id,
        message: 'Would love to grab coffee and chat about study groups!',
        status: 'pending' as const,
      },
    ];

    // Connection requests SENT by Demo User (pending)
    const sentConnectionRequests = [
      {
        fromUserId: createdDemoUser.id,
        toUserId: createdMockUsers[8].id, // Olivia White
        message: 'Hi Olivia! I love hiking too. Would you like to connect?',
        status: 'pending' as const,
      },
      {
        fromUserId: createdDemoUser.id,
        toUserId: createdMockUsers[9].id, // Chris Davis
        message: 'Hey Chris! Saw you\'re into rock climbing. Let\'s connect!',
        status: 'pending' as const,
      },
    ];

    // Create all connection requests
    const allConnectionRequests = [...receivedConnectionRequests, ...sentConnectionRequests];
    const createdConnectionRequests = await ConnectionRequest.bulkCreate(allConnectionRequests);
    console.log(`✅ Created ${createdConnectionRequests.length} connection requests (${receivedConnectionRequests.length} received, ${sentConnectionRequests.length} sent)`);

    // Create established connections (bidirectional)
    const connections = [];
    
    // Demo User is connected with Sarah Johnson
    connections.push(
      {
        userId: createdDemoUser.id,
        connectedUserId: createdMockUsers[0].id, // Sarah Johnson
      },
      {
        userId: createdMockUsers[0].id,
        connectedUserId: createdDemoUser.id,
      }
    );

    // Demo User is connected with Mike Chen
    connections.push(
      {
        userId: createdDemoUser.id,
        connectedUserId: createdMockUsers[1].id, // Mike Chen
      },
      {
        userId: createdMockUsers[1].id,
        connectedUserId: createdDemoUser.id,
      }
    );

    // Demo User is connected with Emily Park
    connections.push(
      {
        userId: createdDemoUser.id,
        connectedUserId: createdMockUsers[2].id, // Emily Park
      },
      {
        userId: createdMockUsers[2].id,
        connectedUserId: createdDemoUser.id,
      }
    );

    // Demo User is connected with Alex Rodriguez
    connections.push(
      {
        userId: createdDemoUser.id,
        connectedUserId: createdMockUsers[3].id, // Alex Rodriguez
      },
      {
        userId: createdMockUsers[3].id,
        connectedUserId: createdDemoUser.id,
      }
    );

    const createdConnections = await Connection.bulkCreate(connections);
    console.log(`✅ Created ${createdConnections.length / 2} connections (${createdConnections.length} total records)`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Demo User: demo@uw.edu`);
    console.log(`     - 2 activities created (for MyActivities "Organizing")`);
    console.log(`     - 5 requests to their activities (3 pending, 1 approved, 1 declined)`);
    console.log(`     - 3 requests from them to join activities (for MyActivities "Participating")`);
    console.log(`     - 3 connection requests received (pending)`);
    console.log(`     - 2 connection requests sent (pending)`);
    console.log(`     - 4 established connections`);
    console.log(`   Mock Users: ${createdMockUsers.length}`);
    console.log(`     - Sarah Johnson, Mike Chen, Emily Park, Alex Rodriguez,`);
    console.log(`     - Jessica Kim, David Nguyen, Rachel Brown, James Lee,`);
    console.log(`     - Olivia White, Chris Davis, Sophia Martinez`);
    console.log(`   Activity Creators: ${createdCreators.length}`);
    console.log(`     - Sarah Chen, Mike Johnson, Emily Rodriguez,`);
    console.log(`     - David Kim, Lisa Wang, Alex Thompson`);
    console.log(`   Browse Activities: ${createdActivities.length}`);
    console.log(`     - CSE 143 Study Group, Basketball, Photography Walk,`);
    console.log(`     - Chemistry Lab, Ultimate Frisbee, Guitar Jam`);
    console.log(`   Demo User Activities: ${createdDemoActivities.length}`);
    console.log(`     - Study Group - Data Structures, Morning Gym Buddy Needed`);
    console.log(`   Total Activity Requests: ${createdRequests.length}`);
    console.log(`   Total Connection Requests: ${createdConnectionRequests.length}`);
    console.log(`   Total Connections: ${createdConnections.length / 2} (bidirectional)`);
    console.log('\n💡 Your backend now has ALL the mock data!');
    console.log('📱 Login with demo@uw.edu to see MyActivities and Connections data');
    console.log('📱 Or login with any other @uw.edu email to browse all users/activities');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
