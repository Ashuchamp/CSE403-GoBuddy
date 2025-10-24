// User type
export type User = {
  id: string;
  email: string;
  name: string;
  bio: string;
  skills: string[];
  preferredTimes: string[];
  activityTags: string[];
  phone?: string;
  instagram?: string;
  campusLocation?: string;
};

// Activity intent type
export type ActivityIntent = {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  maxPeople: number;
  currentPeople: number;
  scheduledTimes: string[];
  createdAt: string;
  campusLocation?: string;
  status?: 'active' | 'completed' | 'cancelled';
};

// Join request status
export type RequestStatus = 'pending' | 'approved' | 'declined';

// Activity join request type
export type ActivityRequest = {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  userBio: string;
  userSkills: string[];
  status: RequestStatus;
  createdAt: string;
};

// Filter state type
export type FilterState = {
  searchQuery: string;
  selectedTags: string[];
  category: string;
  timeWindow: string;
  location: string;
};

