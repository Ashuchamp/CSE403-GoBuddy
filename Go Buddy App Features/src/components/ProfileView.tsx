import { User } from '../App';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, MapPin, Mail, Phone, Instagram, Edit } from 'lucide-react';

type ProfileViewProps = {
  user: User;
  isCurrentUser: boolean;
};

export function ProfileView({ user, isCurrentUser }: ProfileViewProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="mb-2">{user.name}</h2>
              <div className="flex items-center gap-2 opacity-90">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            {isCurrentUser && (
              <Button variant="secondary" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Bio */}
          <div>
            <h3 className="text-gray-700 mb-3">About Me</h3>
            <p className="text-gray-600">{user.bio}</p>
          </div>

          {/* Activity Tags */}
          <div>
            <h3 className="text-gray-700 mb-3">Activities & Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.activityTags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills */}
          {user.skills.length > 0 && (
            <div>
              <h3 className="text-gray-700 mb-3">Skills & Experience</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preferred Times */}
          <div>
            <h3 className="text-gray-700 mb-3">Preferred Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {user.preferredTimes.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-md"
                >
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Location */}
          {user.campusLocation && (
            <div>
              <h3 className="text-gray-700 mb-3">Campus Location</h3>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md w-fit">
                <MapPin className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">{user.campusLocation}</span>
              </div>
            </div>
          )}

          {/* Contact Info */}
          {isCurrentUser && (
            <div>
              <h3 className="text-gray-700 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {user.phone && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Phone className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">{user.phone}</span>
                  </div>
                )}
                {user.instagram && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md">
                    <Instagram className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700">{user.instagram}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 mt-3">
                This contact info will be shared when you accept connection requests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
