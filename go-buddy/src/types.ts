// User type
export type User = {
  id: string;
  email: string; // UW authentication email (private, visible only to self)
  name: string;
  bio: string;
  skills: string[];
  preferredTimes: string[];
  activityTags: string[];
  phone?: string;
  instagram?: string;
  contactEmail?: string; // Public contact email (visible to others)
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
  campusLocation?: string; // Legacy: text location (for backward compatibility)
  latitude?: number; // New: latitude coordinate
  longitude?: number; // New: longitude coordinate
  locationName?: string; // New: location name from map selection
  status?: 'active' | 'completed' | 'cancelled';
  recommendationScore?: number; // ML recommendation score (0-1)
  recommendationReasons?: string[]; // Reasons why this was recommended
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

// Notification type
export type Notification = {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};
