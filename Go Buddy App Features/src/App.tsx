import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthFlow } from './components/AuthFlow';
import { MainApp } from './components/MainApp';

// Mock user type
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

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gray-50">
        {!currentUser ? (
          <AuthFlow onAuthenticated={setCurrentUser} />
        ) : (
          <MainApp currentUser={currentUser} onLogout={() => setCurrentUser(null)} />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
