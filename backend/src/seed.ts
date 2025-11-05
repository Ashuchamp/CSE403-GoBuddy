/**
 * Comprehensive seed script matching ALL frontend mock data
 * Run with: npm run seed
 */

import sequelize from './config/database';
import {User, Activity, ActivityRequest} from './models';

// Demo User (ID 1) - Login with demo@uw.edu to see MyActivities data
const demoUser = {
  email: 'demo@uw.edu',
  name: 'Demo User',
  googleId: 'demo-google-id', // Matches the "Skip to Demo" button
  bio: "Hey! I'm a junior studying Computer Science. Looking for gym buddies and study partners!",
  skills: ['Python', 'React', 'Data Structures'],
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
    skills: ['Molecular Biology', 'Lab Techniques', 'Scientific Writing'],
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
    skills: ['Java', 'C++', 'Machine Learning', 'iOS Development'],
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
    skills: ['SPSS', 'Research Methods', 'Data Analysis'],
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
    skills: ['Financial Analysis', 'Excel', 'Economics', 'Statistics'],
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
    skills: ['Illustration', 'Graphic Design', 'Adobe Creative Suite'],
    preferredTimes: ['Weekend Afternoons', 'Weekend Evenings'],
    activityTags: ['Art', 'Design', 'Yoga', 'Photography', 'Exploring Seattle'],
    instagram: '@jess.creates',
    campusLocation: 'South Campus',
  },
  {
    email: 'david.nguyen@uw.edu',
    name: 'David Nguyen',
    bio: 'Pre-med studying hard! Looking for study partners for organic chem and fellow gym-goers.',
    skills: ['Chemistry', 'Biology', 'MCAT Prep'],
    preferredTimes: ['Weekday Mornings', 'Weekday Evenings'],
    activityTags: ['CHEM 238', 'Study Groups', 'Gym', 'Meal Prep', 'Running'],
    phone: '206-555-0155',
    campusLocation: 'South Campus',
  },
  {
    email: 'rachel.brown@uw.edu',
    name: 'Rachel Brown',
    bio: 'Music major and coffee addict. Always looking for people to jam with or grab coffee!',
    skills: ['Piano', 'Music Theory', 'Composition'],
    preferredTimes: ['Weekend Mornings', 'Weekend Afternoons'],
    activityTags: ['Music', 'Piano', 'Coffee', 'Concerts', 'Songwriting'],
    instagram: '@rachelmusic',
    campusLocation: 'Central Campus',
  },
  {
    email: 'james.lee@uw.edu',
    name: 'James Lee',
    bio: 'Business student passionate about entrepreneurship. Love soccer and networking events!',
    skills: ['Business Strategy', 'Marketing', 'Public Speaking'],
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
    skills: ['GIS', 'Field Research', 'Environmental Policy'],
    preferredTimes: ['Weekend Mornings', 'Weekend Afternoons'],
    activityTags: ['Hiking', 'Environmental Club', 'Study Groups', 'Volunteering', 'Camping'],
    campusLocation: 'South Campus',
  },
  {
    email: 'chris.davis@uw.edu',
    name: 'Chris Davis',
    bio: 'Math major who loves problem-solving and rock climbing. Looking for study partners!',
    skills: ['Calculus', 'Linear Algebra', 'Proof Writing'],
    preferredTimes: ['Weekday Evenings', 'Weekend Afternoons'],
    activityTags: ['Rock Climbing', 'MATH 308', 'Study Groups', 'Chess', 'Puzzles'],
    phone: '206-555-0188',
    campusLocation: 'Central Campus',
  },
  {
    email: 'sophia.martinez@uw.edu',
    name: 'Sophia Martinez',
    bio: 'Public Health student interested in global health and volunteering. Love running too!',
    skills: ['Public Health', 'Statistics', 'Community Outreach'],
    preferredTimes: ['Weekday Mornings', 'Weekend Mornings'],
    activityTags: ['Running', 'Volunteering', 'Public Health Club', 'Study Groups', 'Coffee'],
    instagram: '@sophiam_uw',
    campusLocation: 'South Campus',
  },
];

// Users who create activities (from mockActivityIntents.ts)
const activityCreators = [
  {
    email: 'sarah.chen@uw.edu',
    name: 'Sarah Chen',
    bio: 'Computer Science student who loves studying in groups',
    skills: ['Python', 'Java', 'Algorithms'],
    preferredTimes: ['Evenings', 'Weekends'],
    activityTags: ['Study Groups', 'CSE'],
    campusLocation: 'North Campus',
  },
  {
    email: 'mike.johnson@uw.edu',
    name: 'Mike Johnson',
    bio: 'Sports enthusiast and basketball player',
    skills: ['Leadership', 'Teamwork'],
    preferredTimes: ['Evenings'],
    activityTags: ['Basketball', 'Sports'],
    campusLocation: 'IMA',
  },
  {
    email: 'emily.rodriguez@uw.edu',
    name: 'Emily Rodriguez',
    bio: 'Photography and art lover',
    skills: ['Photography', 'Creative Arts'],
    preferredTimes: ['Weekends'],
    activityTags: ['Photography', 'Art'],
    campusLocation: 'Central Campus',
  },
  {
    email: 'david.kim@uw.edu',
    name: 'David Kim',
    bio: 'Chemistry major helping fellow students',
    skills: ['Chemistry', 'Tutoring'],
    preferredTimes: ['Afternoons'],
    activityTags: ['Study Groups', 'Chemistry'],
    campusLocation: 'South Campus',
  },
  {
    email: 'lisa.wang@uw.edu',
    name: 'Lisa Wang',
    bio: 'Ultimate frisbee team captain',
    skills: ['Ultimate Frisbee', 'Team Sports'],
    preferredTimes: ['Weekends'],
    activityTags: ['Frisbee', 'Sports'],
    campusLocation: 'IMA',
  },
  {
    email: 'alex.thompson@uw.edu',
    name: 'Alex Thompson',
    bio: 'Musician and guitar enthusiast',
    skills: ['Guitar', 'Music'],
    preferredTimes: ['Evenings'],
    activityTags: ['Music', 'Guitar'],
    campusLocation: 'HUB',
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
      userSkills: createdMockUsers[0].skills,
      status: 'pending' as const,
    });

    // Mike Chen wants to join Demo User's study group - PENDING
    requests.push({
      activityId: createdDemoActivities[0].id, // demo-activity-1
      userId: createdMockUsers[1].id, // Mike Chen
      userName: createdMockUsers[1].name,
      userBio: createdMockUsers[1].bio,
      userSkills: createdMockUsers[1].skills,
      status: 'pending' as const,
    });

    // Emily Park wants to join Demo User's study group - APPROVED
    requests.push({
      activityId: createdDemoActivities[0].id, // demo-activity-1
      userId: createdMockUsers[2].id, // Emily Park
      userName: createdMockUsers[2].name,
      userBio: createdMockUsers[2].bio,
      userSkills: createdMockUsers[2].skills,
      status: 'approved' as const,
    });

    // Alex Rodriguez wants to join Demo User's gym - PENDING
    requests.push({
      activityId: createdDemoActivities[1].id, // demo-activity-2
      userId: createdMockUsers[3].id, // Alex Rodriguez
      userName: createdMockUsers[3].name,
      userBio: createdMockUsers[3].bio,
      userSkills: createdMockUsers[3].skills,
      status: 'pending' as const,
    });

    // Jessica Kim wants to join Demo User's gym - PENDING
    requests.push({
      activityId: createdDemoActivities[1].id, // demo-activity-2
      userId: createdMockUsers[4].id, // Jessica Kim
      userName: createdMockUsers[4].name,
      userBio: createdMockUsers[4].bio,
      userSkills: createdMockUsers[4].skills,
      status: 'pending' as const,
    });

    // === Requests FROM Demo User to join other activities (for "Participating" tab) ===
    
    // Demo User wants to join CSE 143 Study Group (intent-1) - PENDING
    requests.push({
      activityId: createdActivities[0].id, // CSE 143 Study Group
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: createdDemoUser.skills,
      status: 'pending' as const,
    });

    // Demo User wants to join Basketball (intent-2) - APPROVED
    requests.push({
      activityId: createdActivities[1].id, // Basketball
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: createdDemoUser.skills,
      status: 'approved' as const,
    });

    // Demo User wants to join Photography Walk (intent-3) - DECLINED
    requests.push({
      activityId: createdActivities[2].id, // Photography Walk
      userId: createdDemoUser.id,
      userName: createdDemoUser.name,
      userBio: createdDemoUser.bio,
      userSkills: createdDemoUser.skills,
      status: 'declined' as const,
    });

    const createdRequests = await ActivityRequest.bulkCreate(requests);
    console.log(`✅ Created ${createdRequests.length} activity requests`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Demo User: demo@uw.edu`);
    console.log(`     - 2 activities created (for MyActivities "Organizing")`);
    console.log(`     - 5 requests to their activities (3 pending, 1 approved, 1 declined)`);
    console.log(`     - 3 requests from them to join activities (for MyActivities "Participating")`);
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
    console.log('\n💡 Your backend now has ALL the mock data!');
    console.log('📱 Login with demo@uw.edu to see MyActivities data');
    console.log('📱 Or login with any other @uw.edu email to browse all users/activities');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
