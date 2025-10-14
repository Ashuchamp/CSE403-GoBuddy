import { useState } from 'react';
import { User, ActivityIntent } from '../App';
import { mockUserActivities, isActivityActive } from '../data/mockUserActivities';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { X, Plus, ArrowLeft, Users, Clock, MapPin, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type CreateActivityViewProps = {
  currentUser: User;
};

type ViewMode = 'manage' | 'create';

export function CreateActivityView({ currentUser }: CreateActivityViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('manage');
  
  // Create form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [maxPeople, setMaxPeople] = useState(4);
  const [scheduledTimes, setScheduledTimes] = useState<string[]>([]);
  const [newTime, setNewTime] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [campusLocation, setCampusLocation] = useState('');

  // Get user's activities and separate active/inactive
  const userActivities = mockUserActivities.filter(activity => activity.userId === currentUser.id);
  const activeActivities = userActivities.filter(isActivityActive);
  const inactiveActivities = userActivities.filter(activity => !isActivityActive(activity));

  const addTime = () => {
    if (newTime.trim() && !scheduledTimes.includes(newTime.trim())) {
      setScheduledTimes([...scheduledTimes, newTime.trim()]);
      setNewTime('');
    }
  };

  const removeTime = (timeToRemove: string) => {
    setScheduledTimes(scheduledTimes.filter(time => time !== timeToRemove));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || scheduledTimes.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newIntent: ActivityIntent = {
      id: `intent-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      title: title.trim(),
      description: description.trim(),
      maxPeople,
      currentPeople: 1,
      scheduledTimes,
      tags,
      createdAt: new Date().toISOString().split('T')[0],
      campusLocation: campusLocation.trim() || undefined
    };

    console.log('Created new activity intent:', newIntent);
    toast.success('Activity posted successfully!');
    
    // Reset form and go back to manage view
    setTitle('');
    setDescription('');
    setMaxPeople(4);
    setScheduledTimes([]);
    setTags([]);
    setCampusLocation('');
    setViewMode('manage');
  };

  const handleDeleteActivity = (activityId: string) => {
    toast.success('Activity deleted successfully');
    // In a real app, this would delete from backend
  };

  const handleEditActivity = (activity: ActivityIntent) => {
    // Pre-fill form with activity data
    setTitle(activity.title);
    setDescription(activity.description);
    setMaxPeople(activity.maxPeople);
    setScheduledTimes(activity.scheduledTimes);
    setTags(activity.tags);
    setCampusLocation(activity.campusLocation || '');
    setViewMode('create');
  };

  const suggestedTags = [
    'Study', 'Sports', 'Creative', 'Music', 'Gaming', 'Food', 'Outdoor',
    'Computer Science', 'Biology', 'Math', 'Chemistry', 'Physics',
    'Basketball', 'Soccer', 'Tennis', 'Running', 'Gym',
    'Beginner Friendly', 'Advanced', 'Weekly', 'One-time'
  ];

  if (viewMode === 'create') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setViewMode('manage')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Activities
          </Button>
        </div>

        <div className="mb-6">
          <h1>Create New Activity</h1>
          <p className="text-gray-600 mt-2">
            Post an activity intent to find people who want to join you!
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Study Group for CSE 143"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you want to do, any requirements, and what to expect..."
                className="mt-1 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxPeople">Max People</Label>
                <Input
                  id="maxPeople"
                  type="number"
                  min="2"
                  max="50"
                  value={maxPeople}
                  onChange={(e) => setMaxPeople(parseInt(e.target.value) || 4)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Campus Location</Label>
                <Input
                  id="location"
                  value={campusLocation}
                  onChange={(e) => setCampusLocation(e.target.value)}
                  placeholder="e.g., Odegaard Library"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Scheduled Times *</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g., Mon 3-5pm, Wed evening, etc."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTime())}
                  />
                  <Button type="button" onClick={addTime} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {scheduledTimes.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {scheduledTimes.map((time, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {time}
                        <button
                          type="button"
                          onClick={() => removeTime(time)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add relevant tags..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-gray-300 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestedTags
                      .filter(tag => !tags.includes(tag))
                      .slice(0, 15)
                      .map((tag) => (
                        <Button
                          key={tag}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTags([...tags, tag])}
                          className="h-7 px-2 text-xs"
                        >
                          + {tag}
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Post Activity
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setMaxPeople(4);
                  setScheduledTimes([]);
                  setTags([]);
                  setCampusLocation('');
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>My Activities</h1>
          <p className="text-gray-600 mt-2">
            Manage your posted activities and create new ones
          </p>
        </div>
        <Button onClick={() => setViewMode('create')} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Activity
        </Button>
      </div>

      {/* Active Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2>Active Activities</h2>
          <Badge variant="secondary">{activeActivities.length}</Badge>
        </div>
        
        {activeActivities.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No active activities yet</p>
            <p className="text-gray-400 mt-1">Create your first activity to get started!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeActivities.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.currentPeople}/{activity.maxPeople}
                        </div>
                        {activity.campusLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {activity.campusLocation}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Active
                    </Badge>
                  </div>

                  <p className="text-gray-700 text-sm line-clamp-2">
                    {activity.description}
                  </p>

                  {activity.scheduledTimes.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <div className="flex flex-wrap gap-1">
                        {activity.scheduledTimes.slice(0, 2).map((time, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                        {activity.scheduledTimes.length > 2 && (
                          <span className="text-xs">+{activity.scheduledTimes.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {activity.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {activity.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{activity.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditActivity(activity)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Inactive Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2>Inactive Activities</h2>
          <Badge variant="secondary">{inactiveActivities.length}</Badge>
        </div>
        
        {inactiveActivities.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500">No inactive activities</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inactiveActivities.map((activity) => (
              <Card key={activity.id} className="p-4 opacity-75">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{activity.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {activity.currentPeople}/{activity.maxPeople}
                        </div>
                        {activity.campusLocation && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {activity.campusLocation}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                      Inactive
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {activity.description}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}