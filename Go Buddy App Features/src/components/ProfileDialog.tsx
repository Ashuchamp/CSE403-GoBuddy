import { User } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, MapPin, Mail, UserPlus } from 'lucide-react';

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  currentUser: User;
  onRequestConnect: () => void;
};

export function ProfileDialog({
  open,
  onOpenChange,
  user,
  currentUser,
  onRequestConnect,
}: ProfileDialogProps) {
  const isCurrentUser = user.id === currentUser.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{user.name}</span>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Bio */}
          <div>
            <h4 className="text-gray-700 mb-2">About</h4>
            <p className="text-gray-600">{user.bio}</p>
          </div>

          {/* Activity Tags */}
          <div>
            <h4 className="text-gray-700 mb-3">Activities & Interests</h4>
            <div className="flex flex-wrap gap-2">
              {user.activityTags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div>
              <h4 className="text-gray-700 mb-3">Skills & Experience</h4>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Times */}
          <div>
            <h4 className="text-gray-700 mb-3">Preferred Times</h4>
            <div className="space-y-2">
              {user.preferredTimes.map((time, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Location */}
          {user.campusLocation && (
            <div>
              <h4 className="text-gray-700 mb-3">Campus Location</h4>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{user.campusLocation}</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isCurrentUser && (
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={onRequestConnect}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Request to Connect
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
