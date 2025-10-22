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
  tags: string[];
  createdAt: string;
  campusLocation?: string;
};

// Filter state type
export type FilterState = {
  searchQuery: string;
  selectedTags: string[];
  category: string;
  timeWindow: string;
  location: string;
};

