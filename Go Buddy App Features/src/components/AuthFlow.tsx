import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User } from '../App';

type AuthFlowProps = {
  onAuthenticated: (user: User) => void;
};

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [error, setError] = useState('');

  const handleSendMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate UW email
    if (!email.endsWith('@uw.edu')) {
      setError('Please use a valid UW email address (@uw.edu)');
      return;
    }

    // Simulate sending magic link
    setLinkSent(true);
  };

  const handleSimulateLogin = () => {
    // Mock user data for demo
    const mockUser: User = {
      id: '1',
      email: email,
      name: 'Demo User',
      bio: 'Hey! I\'m a junior studying Computer Science. Looking for gym buddies and study partners!',
      skills: ['Python', 'React', 'Data Structures'],
      preferredTimes: ['Weekday Evenings', 'Weekend Mornings'],
      activityTags: ['Gym', 'Study Groups', 'Soccer', 'CSE 373'],
      phone: '206-555-0123',
      instagram: '@demouser',
      campusLocation: 'North Campus',
    };
    onAuthenticated(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-purple-600 mb-2">GoBuddy</h1>
          <p className="text-gray-600">Find your activity partners at UW</p>
        </div>

        {!linkSent ? (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="mb-6">
              <Mail className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h2 className="text-center mb-2">Sign in with your UW email</h2>
              <p className="text-center text-gray-600">We'll send you a magic link to sign in</p>
            </div>

            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="yourname@uw.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
                {error && <p className="text-red-600 mt-2">{error}</p>}
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Send Magic Link
              </Button>
            </form>

            <p className="text-gray-500 text-center mt-4">
              Only @uw.edu email addresses are allowed
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="mb-2">Check your email!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a magic link to <span className="text-purple-600">{email}</span>
            </p>
            <p className="text-gray-500 mb-6">
              Click the link in the email to complete your sign in.
            </p>

            {/* Demo button - remove in production */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-gray-500 mb-3">Demo Mode</p>
              <Button
                onClick={handleSimulateLogin}
                variant="outline"
                className="w-full"
              >
                Simulate Login (Demo)
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
