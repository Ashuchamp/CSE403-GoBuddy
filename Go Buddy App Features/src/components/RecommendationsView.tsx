import { User } from '../App';
import { UserCard } from './UserCard';
import { mockUsers } from '../data/mockUsers';
import { Sparkles } from 'lucide-react';

type RecommendationsViewProps = {
  currentUser: User;
};

export function RecommendationsView({ currentUser }: RecommendationsViewProps) {
  // Simple recommendation algorithm based on matching tags and time windows
  const recommendations = mockUsers
    .filter((user) => user.id !== currentUser.id)
    .map((user) => {
      let score = 0;

      // Score based on matching activity tags
      const matchingTags = user.activityTags.filter((tag) =>
        currentUser.activityTags.some((userTag) =>
          tag.toLowerCase().includes(userTag.toLowerCase()) ||
          userTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      score += matchingTags.length * 3;

      // Score based on matching time windows
      const matchingTimes = user.preferredTimes.filter((time) =>
        currentUser.preferredTimes.some((userTime) =>
          time.toLowerCase().includes(userTime.toLowerCase()) ||
          userTime.toLowerCase().includes(time.toLowerCase())
        )
      );
      score += matchingTimes.length * 2;

      // Score based on matching skills
      const matchingSkills = user.skills.filter((skill) =>
        currentUser.skills.some((userSkill) =>
          skill.toLowerCase().includes(userSkill.toLowerCase()) ||
          userSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      score += matchingSkills.length;

      // Score based on location
      if (user.campusLocation && currentUser.campusLocation &&
          user.campusLocation.toLowerCase() === currentUser.campusLocation.toLowerCase()) {
        score += 2;
      }

      return { user, score, matchingTags, matchingTimes };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 9);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="w-8 h-8 text-purple-600" />
        <div>
          <h2>Recommended For You</h2>
          <p className="text-gray-600 mt-1">
            Students who match your interests and availability
          </p>
        </div>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recommendations yet</p>
          <p className="text-gray-400 mt-2">
            Complete your profile with more activities and interests to get personalized recommendations!
          </p>
        </div>
      ) : (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-800">
              We found {recommendations.length} students who share your interests and availability! 
              These matches are based on your activity tags, preferred times, and campus location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map(({ user, matchingTags, matchingTimes }) => (
              <div key={user.id} className="relative">
                {matchingTags.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full z-10">
                    {matchingTags.length} matching {matchingTags.length === 1 ? 'tag' : 'tags'}
                  </div>
                )}
                <UserCard user={user} currentUser={currentUser} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
