import { useState } from 'react';
import { User } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, MessageCircle, Phone, Instagram } from 'lucide-react';
import { mockConnectionRequests } from '../data/mockConnectionRequests';

type ConnectionsViewProps = {
  currentUser: User;
};

type TabType = 'pending' | 'accepted';

export function ConnectionsView({ currentUser }: ConnectionsViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pending');
  const [requests, setRequests] = useState(mockConnectionRequests);

  const handleAccept = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleDecline = (requestId: string) => {
    setRequests(requests.filter(req => req.id !== requestId));
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="mb-2">Connections</h2>
        <p className="text-gray-600">Manage your connection requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`pb-3 px-2 transition-colors ${
            activeTab === 'accepted'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Connections ({acceptedRequests.length})
        </button>
      </div>

      {/* Pending Requests */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No pending requests</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-1">{request.from.name}</h3>
                    <p className="text-gray-600 mb-3">{request.from.bio}</p>
                    
                    {request.message && (
                      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                        <p className="text-gray-600 italic">"{request.message}"</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.from.activityTags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {request.sharedContact && (
                      <div className="space-y-2">
                        <p className="text-gray-700">Contact info shared:</p>
                        {request.sharedContact.instagram && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Instagram className="w-4 h-4" />
                            <span>{request.sharedContact.instagram}</span>
                          </div>
                        )}
                        {request.sharedContact.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{request.sharedContact.phone}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAccept(request.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleDecline(request.id)}
                    variant="outline"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Accepted Connections */}
      {activeTab === 'accepted' && (
        <div className="space-y-4">
          {acceptedRequests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No connections yet</p>
              <p className="text-gray-400 mt-2">Accept requests to start connecting!</p>
            </div>
          ) : (
            acceptedRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="mb-1">{request.from.name}</h3>
                    <p className="text-gray-600 mb-3">{request.from.bio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {request.from.activityTags.slice(0, 5).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {request.sharedContact && (
                      <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">Contact Info:</p>
                        {request.sharedContact.instagram && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Instagram className="w-4 h-4" />
                            <a
                              href={`https://instagram.com/${request.sharedContact.instagram.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-purple-600"
                            >
                              {request.sharedContact.instagram}
                            </a>
                          </div>
                        )}
                        {request.sharedContact.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${request.sharedContact.phone}`} className="hover:text-purple-600">
                              {request.sharedContact.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
