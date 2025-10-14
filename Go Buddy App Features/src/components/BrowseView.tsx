import { useState, useMemo } from 'react';
import { User, ActivityIntent } from '../App';
import { mockUsers } from '../data/mockUsers';
import { mockActivityIntents } from '../data/mockActivityIntents';
import { UserCard } from './UserCard';
import { ActivityIntentCard } from './ActivityIntentCard';
import { SearchFilters } from './SearchFilters';
import { Button } from './ui/button';
import { Users, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type BrowseViewProps = {
  currentUser: User;
};

export type FilterState = {
  searchQuery: string;
  selectedTags: string[];
  category: string;
  timeWindow: string;
  location: string;
};

type BrowseCategory = 'students' | 'activities';

export function BrowseView({ currentUser }: BrowseViewProps) {
  const [browseCategory, setBrowseCategory] = useState<BrowseCategory>('students');
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    category: 'all',
    timeWindow: 'all',
    location: '',
  });

  // Filter users based on current filters
  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      if (user.id === currentUser.id) return false;

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${user.name} ${user.bio} ${user.activityTags.join(' ')} ${user.skills.join(' ')}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Selected tags
      if (filters.selectedTags.length > 0) {
        const hasMatchingTag = filters.selectedTags.some(tag => 
          user.activityTags.some(userTag => userTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Category
      if (filters.category !== 'all') {
        const categoryTags = getCategoryTags(filters.category);
        const hasCategory = user.activityTags.some(tag => 
          categoryTags.some(catTag => tag.toLowerCase().includes(catTag.toLowerCase()))
        );
        if (!hasCategory) return false;
      }

      // Time window
      if (filters.timeWindow !== 'all') {
        const hasTime = user.preferredTimes.some(time => 
          time.toLowerCase().includes(filters.timeWindow.toLowerCase())
        );
        if (!hasTime) return false;
      }

      // Location
      if (filters.location) {
        if (!user.campusLocation?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [currentUser.id, filters]);

  // Filter activity intents based on current filters
  const filteredIntents = useMemo(() => {
    return mockActivityIntents.filter((intent) => {
      if (intent.userId === currentUser.id) return false;

      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${intent.title} ${intent.description} ${intent.tags.join(' ')} ${intent.userName}`.toLowerCase();
        if (!searchableText.includes(query)) return false;
      }

      // Selected tags
      if (filters.selectedTags.length > 0) {
        const hasMatchingTag = filters.selectedTags.some(tag => 
          intent.tags.some(intentTag => intentTag.toLowerCase().includes(tag.toLowerCase()))
        );
        if (!hasMatchingTag) return false;
      }

      // Category
      if (filters.category !== 'all') {
        const categoryTags = getCategoryTags(filters.category);
        const hasCategory = intent.tags.some(tag => 
          categoryTags.some(catTag => tag.toLowerCase().includes(catTag.toLowerCase()))
        );
        if (!hasCategory) return false;
      }

      // Time window
      if (filters.timeWindow !== 'all') {
        const hasTime = intent.scheduledTimes.some(time => 
          time.toLowerCase().includes(filters.timeWindow.toLowerCase())
        );
        if (!hasTime) return false;
      }

      // Location
      if (filters.location) {
        if (!intent.campusLocation?.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [currentUser.id, filters]);

  const handleJoinActivity = (intentId: string) => {
    toast.success('Join request sent! The organizer will be notified.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Browse</h2>
        <p className="text-gray-600 mt-2">
          {browseCategory === 'students' 
            ? 'Find your next study buddy or activity partner'
            : 'Discover activities to join'
          }
        </p>
      </div>

      {/* Category Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 w-fit">
        <Button
          variant={browseCategory === 'students' ? 'default' : 'ghost'}
          onClick={() => setBrowseCategory('students')}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Students
        </Button>
        <Button
          variant={browseCategory === 'activities' ? 'default' : 'ghost'}
          onClick={() => setBrowseCategory('activities')}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Activities
        </Button>
      </div>

      <SearchFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        {browseCategory === 'students' ? (
          // Students view
          filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No students found matching your filters.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'student' : 'students'} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} currentUser={currentUser} />
                ))}
              </div>
            </>
          )
        ) : (
          // Activities view
          filteredIntents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No activities found matching your filters.</p>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600">
                {filteredIntents.length} {filteredIntents.length === 1 ? 'activity' : 'activities'} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredIntents.map((intent) => (
                  <ActivityIntentCard 
                    key={intent.id} 
                    intent={intent} 
                    onJoin={handleJoinActivity}
                  />
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

function getCategoryTags(category: string): string[] {
  const categoryMap: Record<string, string[]> = {
    sports: ['gym', 'soccer', 'basketball', 'tennis', 'running', 'volleyball', 'swimming', 'sports'],
    study: ['study', 'cse', 'bio', 'math', 'chem', 'phys', 'econ', 'psych', 'chemistry', 'computer science'],
    creative: ['music', 'art', 'photography', 'design', 'film', 'theater', 'dance', 'creative', 'guitar'],
    social: ['coffee', 'lunch', 'dinner', 'gaming', 'hiking', 'exploring', 'food'],
  };
  return categoryMap[category] || [];
}