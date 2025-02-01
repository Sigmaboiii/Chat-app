import React from 'react';
import { useFriendStore } from '../../store/friendStore';
import { UserPlus, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';

export const FriendRequests = () => {
  const { pendingRequests, acceptRequest, rejectRequest } = useFriendStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Friend Requests</h3>
      {pendingRequests.length === 0 ? (
        <p className="text-gray-500">No pending friend requests</p>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div
              key={request.id}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
            >
              <span className="text-gray-200">{request.from}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    acceptRequest(request.id);
                    toast.success('Friend request accepted!');
                  }}
                  className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors"
                >
                  <UserPlus size={18} />
                </button>
                <button
                  onClick={() => {
                    rejectRequest(request.id);
                    toast.success('Friend request rejected');
                  }}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                >
                  <UserMinus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};