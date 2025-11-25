import natural from 'natural';
import { Activity, User, ActivityRequest, Connection } from '../models';
import { Op } from 'sequelize';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

interface ScoredActivity {
  activity: Activity;
  score: number;
  reasons: string[];
}

/**
 * ML-powered recommendation engine for activities
 * Uses a hybrid approach combining:
 * - Content-based filtering (TF-IDF on user tags vs activity content)
 * - Collaborative filtering (similar users' activities)
 * - Location and time matching
 * - Social graph (connections)
 */
export class RecommendationEngine {
  /**
   * Get recommended activities for a user
   * @param userId - The user ID to get recommendations for
   * @param limit - Maximum number of recommendations to return (default: 10)
   * @returns Array of recommended activities with scores
   */
  async getRecommendations(userId: string, limit: number = 10): Promise<Array<Activity & { recommendationScore: number; recommendationReasons: string[] }>> {
    // Get user data
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get all active activities (excluding user's own)
    const allActivities = await Activity.findAll({
      where: {
        userId: { [Op.ne]: userId },
        status: 'active',
      },
      order: [['createdAt', 'DESC']],
    });

    // Filter to only activities with available spots
    const activities = allActivities.filter(
      activity => activity.currentPeople < activity.maxPeople
    );

    // Get user's activity requests to exclude already requested activities
    const userRequests = await ActivityRequest.findAll({
      where: {
        userId,
        status: { [Op.in]: ['pending', 'approved'] },
      },
    });
    const requestedActivityIds = new Set(userRequests.map(r => r.activityId));

    // Filter out activities user has already requested
    const availableActivities = activities.filter(
      activity => !requestedActivityIds.has(activity.id)
    );

    if (availableActivities.length === 0) {
      return [];
    }

    // Get user's connections for social recommendations
    const connections = await Connection.findAll({
      where: { userId },
    });
    const connectedUserIds = new Set(connections.map(c => c.connectedUserId));

    // Get all users' activity participation for collaborative filtering
    const allApprovedRequests = await ActivityRequest.findAll({
      where: { status: 'approved' },
    });

    // Score each activity
    const scoredActivities: ScoredActivity[] = [];

    for (const activity of availableActivities) {
      const score = await this.calculateActivityScore(
        user,
        activity,
        connectedUserIds,
        allApprovedRequests
      );

      scoredActivities.push(score);
    }

    // Sort by score (descending) and return top N
    scoredActivities.sort((a, b) => b.score - a.score);

    return scoredActivities.slice(0, limit).map(sa => ({
      ...sa.activity.toJSON(),
      recommendationScore: sa.score,
      recommendationReasons: sa.reasons,
    }));
  }

  /**
   * Calculate recommendation score for an activity
   * Combines multiple ML and heuristic signals
   */
  private async calculateActivityScore(
    user: User,
    activity: Activity,
    connectedUserIds: Set<string>,
    allApprovedRequests: ActivityRequest[]
  ): Promise<ScoredActivity> {
    let totalScore = 0;
    const reasons: string[] = [];

    // 1. Content-based filtering: TF-IDF similarity between user tags and activity content
    const contentScore = this.calculateContentSimilarity(user, activity);
    totalScore += contentScore * 40; // Weight: 40%
    if (contentScore > 0.3) {
      reasons.push('Matches your interests');
    }

    // 2. Collaborative filtering: Similar users' preferences
    const collaborativeScore = await this.calculateCollaborativeScore(
      user,
      activity,
      allApprovedRequests
    );
    totalScore += collaborativeScore * 25; // Weight: 25%
    if (collaborativeScore > 0.5) {
      reasons.push('Popular with users like you');
    }

    // 3. Location matching
    if (user.campusLocation && activity.campusLocation) {
      if (user.campusLocation === activity.campusLocation) {
        totalScore += 15; // Weight: 15%
        reasons.push('Near your preferred location');
      }
    }

    // 4. Time preference matching
    const timeScore = this.calculateTimeMatch(user, activity);
    totalScore += timeScore * 10; // Weight: 10%
    if (timeScore > 0.5) {
      reasons.push('Fits your schedule');
    }

    // 5. Social graph: Activity from connected users
    if (connectedUserIds.has(activity.userId)) {
      totalScore += 10; // Weight: 10%
      reasons.push('Created by someone you know');
    }

    // 6. Recency boost (prefer newer activities)
    const recencyScore = this.calculateRecencyScore(activity);
    totalScore += recencyScore * 5; // Weight: 5%

    // 7. Availability boost (prefer activities with more spots)
    const availabilityRatio = (activity.maxPeople - activity.currentPeople) / activity.maxPeople;
    totalScore += availabilityRatio * 5; // Weight: 5%

    // Normalize score to 0-100 range
    const normalizedScore = Math.min(100, Math.max(0, totalScore));

    return {
      activity,
      score: normalizedScore,
      reasons: reasons.length > 0 ? reasons : ['Might interest you'],
    };
  }

  /**
   * Calculate content similarity using TF-IDF
   * Compares user's activity tags with activity title and description
   */
  private calculateContentSimilarity(user: User, activity: Activity): number {
    const tfidf = new TfIdf();

    // Create documents for TF-IDF
    // Document 1: User's interests (activity tags)
    const userInterests = (user.activityTags || []).join(' ').toLowerCase();

    // Document 2: Activity content (title + description)
    const activityContent = `${activity.title} ${activity.description || ''}`.toLowerCase();

    if (!userInterests || !activityContent) {
      return 0;
    }

    // Add documents to TF-IDF
    tfidf.addDocument(userInterests);
    tfidf.addDocument(activityContent);

    // Calculate similarity using cosine similarity of TF-IDF vectors
    const userTokens = tokenizer.tokenize(userInterests) || [];
    const activityTokens = tokenizer.tokenize(activityContent) || [];

    if (userTokens.length === 0 || activityTokens.length === 0) {
      return 0;
    }

    // Get all unique terms
    const allTerms = new Set([...userTokens, ...activityTokens]);

    // Build TF-IDF vectors
    const userVector: number[] = [];
    const activityVector: number[] = [];

    allTerms.forEach((term) => {
      userVector.push(tfidf.tfidf(term, 0));
      activityVector.push(tfidf.tfidf(term, 1));
    });

    // Calculate cosine similarity
    const similarity = this.cosineSimilarity(userVector, activityVector);

    return similarity;
  }

  /**
   * Collaborative filtering: Find users with similar interests and recommend their activities
   * Users with similar activity tags who joined this activity
   */
  private async calculateCollaborativeScore(
    user: User,
    activity: Activity,
    allApprovedRequests: ActivityRequest[]
  ): Promise<number> {
    // Find users who joined this activity
    const activityParticipants = allApprovedRequests.filter(
      req => req.activityId === activity.id
    );

    if (activityParticipants.length === 0) {
      return 0; // No one has joined yet
    }

    // Get users who joined this activity
    const participantIds = activityParticipants.map(req => req.userId);
    const participants = await User.findAll({
      where: { id: { [Op.in]: participantIds } },
    });

    // Calculate similarity with each participant
    let maxSimilarity = 0;
    for (const participant of participants) {
      const similarity = this.calculateUserSimilarity(user, participant);
      maxSimilarity = Math.max(maxSimilarity, similarity);
    }

    return maxSimilarity;
  }

  /**
   * Calculate similarity between two users based on their activity tags
   * Uses Jaccard similarity coefficient
   */
  private calculateUserSimilarity(user1: User, user2: User): number {
    const tags1 = new Set((user1.activityTags || []).map((t: string) => t.toLowerCase()));
    const tags2 = new Set((user2.activityTags || []).map((t: string) => t.toLowerCase()));

    if (tags1.size === 0 && tags2.size === 0) {
      return 0;
    }

    // Jaccard similarity: intersection / union
    const intersection = new Set([...tags1].filter(x => tags2.has(x)));
    const union = new Set([...tags1, ...tags2]);

    return intersection.size / union.size;
  }

  /**
   * Calculate time preference matching
   * Simple overlap check between user's preferred times and activity scheduled times
   */
  private calculateTimeMatch(user: User, activity: Activity): number {
    const userTimes: Set<string> = new Set((user.preferredTimes || []).map((t: string) => t.toLowerCase()));
    const activityTimes: string[] = (activity.scheduledTimes || []).map((t: string) => t.toLowerCase());

    if (userTimes.size === 0 || activityTimes.length === 0) {
      return 0.5; // Neutral score if no time preference
    }

    // Check if any activity time matches user's preferred times
    const matches = activityTimes.filter((t: string) => {
      // Check for partial matches (e.g., "morning" in "Weekday Mornings")
      return [...userTimes].some((userTime: string) =>
        t.includes(userTime) || userTime.includes(t)
      );
    });

    return matches.length / activityTimes.length;
  }

  /**
   * Calculate recency score
   * Prefer newer activities (created within last week get full score)
   */
  private calculateRecencyScore(activity: Activity): number {
    const now = new Date();
    const createdAt = new Date(activity.createdAt);
    const daysSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceCreation <= 7) {
      return 1; // Full score for activities created in last week
    } else if (daysSinceCreation <= 30) {
      return 0.5; // Half score for activities created in last month
    } else {
      return 0.2; // Low score for older activities
    }
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      return 0;
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();
