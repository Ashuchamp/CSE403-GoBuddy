import { ActivityIntent } from '../App';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Clock, Users, MapPin, Calendar } from 'lucide-react';

type ActivityIntentCardProps = {
  intent: ActivityIntent;
  onJoin?: (intentId: string) => void;
};

export function ActivityIntentCard({ intent, onJoin }: ActivityIntentCardProps) {
  const isAlmostFull = intent.currentPeople >= intent.maxPeople * 0.8;
  const isFull = intent.currentPeople >= intent.maxPeople;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium">{intent.title}</h3>
            <p className="text-sm text-gray-600 mt-1">by {intent.userName}</p>
          </div>
          <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
            isFull 
              ? 'bg-red-100 text-red-700' 
              : isAlmostFull 
                ? 'bg-orange-100 text-orange-700'
                : 'bg-green-100 text-green-700'
          }`}>
            <Users className="w-3 h-3" />
            {intent.currentPeople}/{intent.maxPeople}
          </div>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">
          {intent.description}
        </p>

        <div className="space-y-2">
          {intent.scheduledTimes.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <div className="flex flex-wrap gap-1">
                {intent.scheduledTimes.slice(0, 2).map((time, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {time}
                  </Badge>
                ))}
                {intent.scheduledTimes.length > 2 && (
                  <span className="text-xs">+{intent.scheduledTimes.length - 2} more</span>
                )}
              </div>
            </div>
          )}

          {intent.campusLocation && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{intent.campusLocation}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Posted {new Date(intent.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {intent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {intent.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {intent.tags.length > 4 && (
              <Badge variant="secondary" className="text-xs">
                +{intent.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={() => onJoin?.(intent.id)}
            disabled={isFull}
            className="w-full"
            variant={isFull ? "secondary" : "default"}
          >
            {isFull ? 'Full' : 'Join Activity'}
          </Button>
        </div>
      </div>
    </Card>
  );
}