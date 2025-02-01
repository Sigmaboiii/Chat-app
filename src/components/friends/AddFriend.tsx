import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';
import toast from 'react-hot-toast';

export const AddFriend = () => {
  const [email, setEmail] = useState('');
  const { sendFriendRequest } = useFriendStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendFriendRequest(email);
      setEmail('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 text-white">
        <UserPlus size={20} className="text-blue-400" />
        <h3 className="text-lg font-semibold">Add Friend</h3>
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter friend's email"
          className="flex-1 px-4 py-2 bg-gray-900/50 text-white rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus size={18} />
              Add
            </>
          )}
        </button>
      </div>
    </form>
  );
};