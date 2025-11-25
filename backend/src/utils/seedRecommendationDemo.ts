/**
 * Seed script specifically for AI Recommendation Engine Demo
 * Creates activities that demonstrate different aspects of the recommendation system:
 * - Content-based filtering (high/medium/low match with demo user's interests)
 * - Location matching (North Campus)
 * - Time preference matching (Weekday Evenings, Weekend Mornings)
 * - Social graph (activities from connected users)
 * - Collaborative filtering (similar users participating)
 * 
 * Run with: npm run seed:recommendations
 * Or: ts-node src/utils/seedRecommendationDemo.ts
 */

import sequelize from '../config/database';
import { User, Activity, ActivityRequest, Connection } from '../models/index';
import { Op } from 'sequelize';

// Demo user profile for reference:
// - activityTags: ['Gym', 'Study Groups', 'Coffee', 'Hiking']
// - preferredTimes: ['Weekday Evenings', 'Weekend Mornings']
// - campusLocation: 'North Campus'

const DEMO_ACTIVITIES = [
  // ===== HIGH CONTENT MATCH + LOCATION MATCH =====
  {
    title: 'Evening Gym Workout Session',
    description: 'Looking for workout partners for evening gym sessions. Focus on strength training and cardio. All fitness levels welcome!',
    maxPeople: 6,
    currentPeople: 2,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'North Campus',
    tags: ['Gym', 'Fitness', 'Workout'],
    matchType: 'HIGH - Perfect match: Gym + Weekday Evenings + North Campus',
  },
  {
    title: 'Weekend Morning Study Group - CSE 373',
    description: 'Study group for CSE 373 algorithms course. Meet Saturday mornings to work through problem sets and review concepts together.',
    maxPeople: 5,
    currentPeople: 1,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Study Groups', 'CSE 373', 'Algorithms'],
    matchType: 'HIGH - Perfect match: Study Groups + Weekend Mornings + North Campus',
  },
  {
    title: 'Saturday Morning Coffee & Code',
    description: 'Casual coding session over coffee. Work on personal projects, share ideas, and get feedback. Great for networking!',
    maxPeople: 8,
    currentPeople: 3,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Coffee', 'Coding', 'Networking'],
    matchType: 'HIGH - Perfect match: Coffee + Weekend Mornings + North Campus',
  },
  {
    title: 'Early Morning Hiking - Discovery Park',
    description: 'Weekend morning hike at Discovery Park. Moderate trail, beautiful views. Meet at North Campus parking lot at 7am.',
    maxPeople: 8,
    currentPeople: 2,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Hiking', 'Outdoor', 'Nature'],
    matchType: 'HIGH - Perfect match: Hiking + Weekend Mornings + North Campus',
  },

  // ===== MEDIUM CONTENT MATCH =====
  {
    title: 'Evening Basketball at IMA',
    description: 'Pickup basketball games. Good for staying active and meeting new people. All skill levels welcome!',
    maxPeople: 10,
    currentPeople: 6,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'IMA',
    tags: ['Basketball', 'Sports', 'Fitness'],
    matchType: 'MEDIUM - Time match (Weekday Evenings), but different location and sport',
  },
  {
    title: 'Study Session at Odegaard Library',
    description: 'Group study session for various CS courses. Bring your laptop and questions. We help each other out!',
    maxPeople: 6,
    currentPeople: 3,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'Odegaard Library',
    tags: ['Study Groups', 'CS', 'Academic'],
    matchType: 'MEDIUM - Content match (Study Groups) + Time match, but different location',
  },
  {
    title: 'Coffee Chat & Networking',
    description: 'Casual meetup for students interested in tech careers. Share experiences, tips, and connect with peers.',
    maxPeople: 10,
    currentPeople: 5,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'HUB',
    tags: ['Coffee', 'Networking', 'Career'],
    matchType: 'MEDIUM - Content match (Coffee) + Time match, but different location',
  },
  {
    title: 'Trail Running Group',
    description: 'Weekly trail running sessions. We explore different trails around Seattle. Great cardio workout!',
    maxPeople: 8,
    currentPeople: 4,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'Meet at IMA',
    tags: ['Running', 'Outdoor', 'Fitness'],
    matchType: 'MEDIUM - Time match (Weekend Mornings) + outdoor activity, but not exactly hiking',
  },

  // ===== LOW CONTENT MATCH (for comparison) =====
  {
    title: 'Photography Workshop',
    description: 'Learn photography techniques and explore campus. Bring any camera, even phone cameras work!',
    maxPeople: 8,
    currentPeople: 5,
    scheduledTimes: ['Weekday Afternoons'],
    campusLocation: 'South Campus',
    tags: ['Photography', 'Art', 'Creative'],
    matchType: 'LOW - No content, time, or location match',
  },
  {
    title: 'Yoga & Meditation Class',
    description: 'Relaxing yoga session followed by guided meditation. Perfect for stress relief and mindfulness.',
    maxPeople: 15,
    currentPeople: 8,
    scheduledTimes: ['Weekday Mornings'],
    campusLocation: 'IMA Studio',
    tags: ['Yoga', 'Meditation', 'Wellness'],
    matchType: 'LOW - Different time, location, and interests',
  },
  {
    title: 'Board Game Night',
    description: 'Weekly board game sessions. We play strategy games, party games, and everything in between!',
    maxPeople: 12,
    currentPeople: 7,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'HUB',
    tags: ['Board Games', 'Social', 'Entertainment'],
    matchType: 'LOW - Only time match, no content or location match',
  },

  // ===== SOCIAL GRAPH DEMO (from connected users) =====
  {
    title: 'Gym Training Program',
    description: 'Structured gym training program focusing on strength and conditioning. Perfect for beginners!',
    maxPeople: 6,
    currentPeople: 2,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'North Campus',
    tags: ['Gym', 'Training', 'Fitness'],
    matchType: 'SOCIAL - From connected user + high content match',
    creatorEmail: 'sarah.j@uw.edu', // Demo user is connected with Sarah
  },
  {
    title: 'Study Group - Data Structures',
    description: 'Study group for CSE 332. Work through assignments and prepare for exams together.',
    maxPeople: 5,
    currentPeople: 1,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Study Groups', 'CSE 332', 'Data Structures'],
    matchType: 'SOCIAL - From connected user + perfect match',
    creatorEmail: 'mike.chen@uw.edu', // Demo user is connected with Mike
  },
  {
    title: 'Coffee & Career Chat',
    description: 'Informal meetup to discuss career paths, internships, and share advice over coffee.',
    maxPeople: 8,
    currentPeople: 3,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Coffee', 'Career', 'Networking'],
    matchType: 'SOCIAL - From connected user + high match',
    creatorEmail: 'emily.park@uw.edu', // Demo user is connected with Emily
  },

  // ===== COLLABORATIVE FILTERING DEMO =====
  {
    title: 'Evening Gym Session - Advanced',
    description: 'Advanced gym workout session for experienced lifters. Focus on progressive overload and technique.',
    maxPeople: 4,
    currentPeople: 2,
    scheduledTimes: ['Weekday Evenings'],
    campusLocation: 'North Campus',
    tags: ['Gym', 'Advanced', 'Strength Training'],
    matchType: 'COLLABORATIVE - Similar users (with Gym interest) already joined',
    participants: ['sarah.j@uw.edu', 'mike.chen@uw.edu'], // Users with similar interests
  },
  {
    title: 'Weekend Study Marathon',
    description: 'Intensive study session for finals prep. Bring snacks, notes, and determination!',
    maxPeople: 6,
    currentPeople: 3,
    scheduledTimes: ['Weekend Mornings'],
    campusLocation: 'North Campus',
    tags: ['Study Groups', 'Finals', 'Academic'],
    matchType: 'COLLABORATIVE - Similar users (with Study Groups interest) already joined',
    participants: ['sarah.j@uw.edu', 'emily.park@uw.edu'],
  },
];

async function seedRecommendationDemo() {
  try {
    console.log('🌱 Starting AI Recommendation Demo Data Seeding...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Get demo user
    const demoUser = await User.findOne({ where: { email: 'demo@uw.edu' } });
    if (!demoUser) {
      console.error('❌ Demo user not found! Please run the main seed script first.');
      process.exit(1);
    }
    console.log(`✅ Found demo user: ${demoUser.name} (${demoUser.email})`);

    // Get other users for social graph and collaborative filtering
    const sarah = await User.findOne({ where: { email: 'sarah.j@uw.edu' } });
    const mike = await User.findOne({ where: { email: 'mike.chen@uw.edu' } });
    const emily = await User.findOne({ where: { email: 'emily.park@uw.edu' } });

    // Ensure connections exist for social graph demo
    if (sarah && mike && emily) {
      console.log('🔗 Ensuring connections for social graph demo...');
      
      // Check/create connections
      const connections = [
        { userId: demoUser.id, connectedUserId: sarah.id },
        { userId: demoUser.id, connectedUserId: mike.id },
        { userId: demoUser.id, connectedUserId: emily.id },
      ];

      for (const conn of connections) {
        const exists = await Connection.findOne({
          where: {
            userId: conn.userId,
            connectedUserId: conn.connectedUserId,
          },
        });
        if (!exists) {
          await Connection.create(conn);
          await Connection.create({
            userId: conn.connectedUserId,
            connectedUserId: conn.userId,
          });
        }
      }
      console.log('✅ Connections verified');
    }

    // Delete existing demo recommendation activities (to avoid duplicates)
    console.log('\n🗑️  Cleaning up existing demo recommendation activities...');
    const existingActivities = await Activity.findAll({
      where: {
        title: { [Op.in]: DEMO_ACTIVITIES.map(a => a.title) },
      },
    });
    if (existingActivities.length > 0) {
      await ActivityRequest.destroy({
        where: { activityId: { [Op.in]: existingActivities.map(a => a.id) } },
      });
      await Activity.destroy({
        where: { id: { [Op.in]: existingActivities.map(a => a.id) } },
      });
      console.log(`   Removed ${existingActivities.length} existing activities`);
    }

    // Create activities
    console.log('\n🎯 Creating recommendation demo activities...');
    const createdActivities = [];

    for (const activityData of DEMO_ACTIVITIES) {
      // Determine creator
      let creatorId = demoUser.id;
      let creatorName = demoUser.name;

      if (activityData.creatorEmail) {
        const creator = await User.findOne({ where: { email: activityData.creatorEmail } });
        if (creator) {
          creatorId = creator.id;
          creatorName = creator.name;
        }
      }

      // Create activity
      const activity = await Activity.create({
        title: activityData.title,
        description: activityData.description,
        maxPeople: activityData.maxPeople,
        currentPeople: activityData.currentPeople,
        scheduledTimes: activityData.scheduledTimes,
        campusLocation: activityData.campusLocation,
        userId: creatorId,
        userName: creatorName,
        status: 'active',
      });

      createdActivities.push({ activity, activityData });

      // Create activity requests for collaborative filtering demo
      if (activityData.participants) {
        for (const participantEmail of activityData.participants) {
          const participant = await User.findOne({ where: { email: participantEmail } });
          if (participant) {
            // Check if request already exists
            const existing = await ActivityRequest.findOne({
              where: {
                activityId: activity.id,
                userId: participant.id,
              },
            });

            if (!existing) {
              await ActivityRequest.create({
                activityId: activity.id,
                userId: participant.id,
                userName: participant.name,
                userBio: participant.bio || '',
                userSkills: participant.skills || [],
                status: 'approved',
              });
              // Update activity currentPeople count
              await activity.update({
                currentPeople: activity.currentPeople + 1,
              });
            }
          }
        }
      }

      console.log(`   ✓ ${activityData.title}`);
      console.log(`     ${activityData.matchType}`);
    }

    console.log(`\n✅ Created ${createdActivities.length} recommendation demo activities`);

    // Summary
    console.log('\n📊 Recommendation Demo Data Summary:');
    console.log('   High Match Activities: 4 (Perfect content + location + time)');
    console.log('   Medium Match Activities: 4 (Partial matches)');
    console.log('   Low Match Activities: 3 (For comparison)');
    console.log('   Social Graph Activities: 3 (From connected users)');
    console.log('   Collaborative Filtering: 2 (Similar users participating)');
    console.log('\n💡 Demo User Profile:');
    console.log(`   Interests: ${demoUser.activityTags?.join(', ') || 'none'}`);
    console.log(`   Preferred Times: ${demoUser.preferredTimes?.join(', ') || 'none'}`);
    console.log(`   Campus Location: ${demoUser.campusLocation || 'none'}`);
    console.log('\n🚀 Login with demo@uw.edu and check the "For You" page to see AI recommendations!');
    console.log('   The top recommendations should match your interests, location, and schedule.');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Error seeding recommendation demo data:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedRecommendationDemo();
}

export default seedRecommendationDemo;

