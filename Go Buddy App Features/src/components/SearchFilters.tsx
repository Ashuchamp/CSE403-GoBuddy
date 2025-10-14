import { Search, X } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { FilterState } from './BrowseView';

type SearchFiltersProps = {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
};

const popularTags = [
  'Gym', 'Soccer', 'Study Groups', 'CSE 373', 'BIO 180',
  'Basketball', 'Coffee', 'Running', 'Photography', 'Music'
];

export function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const toggleTag = (tag: string) => {
    const newTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter(t => t !== tag)
      : [...filters.selectedTags, tag];
    onFiltersChange({ ...filters, selectedTags: newTags });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      selectedTags: [],
      category: 'all',
      timeWindow: 'all',
      location: '',
    });
  };

  const hasActiveFilters = 
    filters.searchQuery || 
    filters.selectedTags.length > 0 || 
    filters.category !== 'all' || 
    filters.timeWindow !== 'all' || 
    filters.location;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Search by name, bio, skills, or activities..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-gray-700 mb-2">Category</label>
          <Select
            value={filters.category}
            onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sports">Sports & Fitness</SelectItem>
              <SelectItem value="study">Study Groups</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="social">Social</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Time Window</label>
          <Select
            value={filters.timeWindow}
            onValueChange={(value) => onFiltersChange({ ...filters, timeWindow: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Time</SelectItem>
              <SelectItem value="weekday morning">Weekday Mornings</SelectItem>
              <SelectItem value="weekday afternoon">Weekday Afternoons</SelectItem>
              <SelectItem value="weekday evening">Weekday Evenings</SelectItem>
              <SelectItem value="weekend morning">Weekend Mornings</SelectItem>
              <SelectItem value="weekend afternoon">Weekend Afternoons</SelectItem>
              <SelectItem value="weekend evening">Weekend Evenings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Campus Location</label>
          <Input
            type="text"
            placeholder="e.g., North Campus, IMA"
            value={filters.location}
            onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          />
        </div>
      </div>

      {/* Popular Tags */}
      <div>
        <label className="block text-gray-700 mb-2">Activity Tags</label>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={filters.selectedTags.includes(tag) ? 'default' : 'outline'}
              className={`cursor-pointer ${
                filters.selectedTags.includes(tag)
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <X className="w-4 h-4" />
          Clear all filters
        </button>
      )}
    </div>
  );
}
