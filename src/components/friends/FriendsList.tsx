import React from 'react';
import { useFriendStore } from '../../store/friendStore';
import { MessageSquare, UserPlus } from 'lucide-react';
import { AddFriend } from './AddFriend';

export const FriendsList = () => {
  const { friends, startChat } = useFriendStore();

  return (
    <div className="space-y-6">
      <AddFriend />
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Friends</h3>
        {friends.length === 0 ? (
          <div className="text-center py-8 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
              <UserPlus size={48} className="text-gray-400" />
              <div className="space-y-2">
                <p className="text-gray-300">You currently don't have any friends</p>
                <p className="text-gray-400 text-sm">Use the form above to add some!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center justify-between p-4 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      friend.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  />
                  <span className="text-white">{friend.email}</span>
                </div>
                <button
                  onClick={() => startChat(friend.id)}
                  className="p-2 bg-blue-600/80 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};