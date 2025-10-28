import { useState } from 'react';
import { useGoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from './ui/button';
import { User } from '../App';

type AuthFlowProps = {
  onAuthenticated: (user: User) => void;
};

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserInfo = async (accessToken: string): Promise<GoogleUserInfo> => {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }
    
    return response.json();
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    setLoading(true);
    setError('');

    try {
      const userInfo = await fetchUserInfo(tokenResponse.access_token);
      
      // Validate UW email domain
      if (!userInfo.email.endsWith('@uw.edu')) {
        setError('Please use a valid UW email address (@uw.edu)');
        setLoading(false);
        return;
      }

      // Create user object from Google data
      const user: User = {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        bio: '',
        skills: [],
        preferredTimes: [],
        activityTags: [],
        phone: '',
        instagram: '',
        campusLocation: '',
      };

      onAuthenticated(user);
    } catch (err) {
      console.error('Error processing authentication:', err);
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or failed. Please try again.');
    setLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    scope: 'openid email profile',
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-purple-600 mb-2">GoBuddy</h1>
          <p className="text-gray-600">Find your activity partners at UW</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="w-12 h-12 mx-auto mb-4">
              <svg viewBox="0 0 24 24" className="w-full h-full">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <h2 className="text-center mb-2">Sign in with Google</h2>
            <p className="text-center text-gray-600">Use your UW Google account to continue</p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => {
                setLoading(true);
                login();
              }}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </Button>

            {error && (
              <p className="text-red-600 text-center text-sm">{error}</p>
            )}
          </div>

          <p className="text-gray-500 text-center mt-6 text-sm">
            Only @uw.edu email addresses are allowed
          </p>
        </div>
      </div>
    </div>
  );
}
