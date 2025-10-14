import { useState } from 'react';
import { User } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, MapPin, UserPlus } from 'lucide-react';
import { ConnectionRequestDialog } from './ConnectionRequestDialog';
import { ProfileDialog } from './ProfileDialog';

type UserCardProps = {
  user: User;
  currentUser: User;
};

export function UserCard({ user, currentUser }: UserCardProps) {
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleRequestSent = () => {
    setRequestSent(true);
    setShowRequestDialog(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <button
                onClick={() => setShowProfileDialog(true)}
                className="hover:text-purple-600 transition-colors text-left"
              >
                <h3 className="mb-1">{user.name}</h3>
              </button>
              <p className="text-gray-600 line-clamp-2">{user.bio}</p>
            </div>
          </div>

          {/* Activity Tags */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {user.activityTags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {user.activityTags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{user.activityTags.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Preferred Times */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{user.preferredTimes[0]}</span>
            </div>
            {user.campusLocation && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.campusLocation}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div className="mb-4 pt-4 border-t border-gray-200">
              <p className="text-gray-500 mb-2">Skills & Experience</p>
              <div className="flex flex-wrap gap-1">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            onClick={() => setShowRequestDialog(true)}
            disabled={requestSent}
            className={`w-full ${
              requestSent
                ? 'bg-green-600 hover:bg-green-600'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            {requestSent ? 'Request Sent' : 'Request to Connect'}
          </Button>
        </div>
      </div>

      <ConnectionRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        user={user}
        onRequestSent={handleRequestSent}
      />

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        user={user}
        currentUser={currentUser}
        onRequestConnect={() => {
          setShowProfileDialog(false);
          setShowRequestDialog(true);
        }}
      />
    </>
  );
}
