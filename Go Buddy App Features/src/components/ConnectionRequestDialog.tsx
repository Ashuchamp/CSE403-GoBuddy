import { useState } from 'react';
import { User } from '../App';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

type ConnectionRequestDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onRequestSent: () => void;
};

export function ConnectionRequestDialog({
  open,
  onOpenChange,
  user,
  onRequestSent,
}: ConnectionRequestDialogProps) {
  const [message, setMessage] = useState('');
  const [sharePhone, setSharePhone] = useState(false);
  const [shareInstagram, setShareInstagram] = useState(true);

  const handleSend = () => {
    // In real app, this would send the request to the backend
    onRequestSent();
    setMessage('');
    setSharePhone(false);
    setShareInstagram(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request to Connect</DialogTitle>
          <DialogDescription>
            Send a connection request to {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="message" className="mb-2 block">
              Add a personal note (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Hey! I'd love to connect for..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={300}
            />
            <p className="text-gray-500 mt-1">
              {message.length}/300 characters
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-gray-700">Contact info to share:</p>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="instagram"
                checked={shareInstagram}
                onCheckedChange={(checked) => setShareInstagram(checked as boolean)}
              />
              <Label htmlFor="instagram" className="cursor-pointer">
                Instagram (@demouser)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="phone"
                checked={sharePhone}
                onCheckedChange={(checked) => setSharePhone(checked as boolean)}
              />
              <Label htmlFor="phone" className="cursor-pointer">
                Phone Number (206-555-0123)
              </Label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-800">
              {user.name} will be able to see your profile and respond to your request.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            Send Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
