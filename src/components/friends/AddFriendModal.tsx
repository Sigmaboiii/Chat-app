import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';
import toast from 'react-hot-toast';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFriendModal = ({ isOpen, onClose }: AddFriendModalProps) => {
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
      toast.success('Friend request sent!');
      setEmail('');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send friend request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
          >
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <UserPlus size={24} className="text-blue-500" />
                Add Friend
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Friend's Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your friend's email"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={20} />
                    Send Friend Request
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};