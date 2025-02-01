import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, UserMinus } from 'lucide-react';
import { useFriendStore } from '../../store/friendStore';
import toast from 'react-hot-toast';

interface FriendRequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FriendRequestsModal = ({ isOpen, onClose }: FriendRequestsModalProps) => {
  const { pendingRequests, acceptRequest, rejectRequest } = useFriendStore();

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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Friend Requests</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto">
              {pendingRequests.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No pending friend requests</p>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <span className="text-gray-900 dark:text-white">{request.from}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            acceptRequest(request.id);
                            toast.success('Friend request accepted!');
                          }}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                        >
                          <UserPlus size={18} />
                        </button>
                        <button
                          onClick={() => {
                            rejectRequest(request.id);
                            toast.success('Friend request rejected');
                          }}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};