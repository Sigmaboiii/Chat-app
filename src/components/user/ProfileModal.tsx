import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Music, GamepadIcon } from 'lucide-react';
import { useSpotifyStore } from '../../store/spotifyStore';
import { usePresenceStore } from '../../store/presenceStore';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    email: string;
    bio?: string;
    status?: string;
    currentActivity?: {
      type: 'spotify' | 'game' | 'app';
      name: string;
      details?: string;
    };
  };
  isFriend?: boolean;
}

export const ProfileModal = ({ isOpen, onClose, user, isFriend = false }: ProfileModalProps) => {
  const [bio, setBio] = useState(user.bio || '');
  const [status, setStatus] = useState(user.status || '');
  const { currentTrack, startListeningTogether } = useSpotifyStore();
  const { presence } = usePresenceStore();

  const handleSave = () => {
    // Save bio and status
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md"
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      >
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={4}
              maxLength={500}
              disabled={isFriend}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {bio.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <input
              type="text"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
              disabled={isFriend}
            />
          </div>

          {user.currentActivity && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Current Activity
              </h3>

              {user.currentActivity.type === 'spotify' && (
                <div className="flex items-center gap-4">
                  <Music className="text-green-500" size={24} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Listening to Spotify
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.currentActivity.name}
                    </p>
                    {isFriend && (
                      <button
                        onClick={() => startListeningTogether(user.currentActivity?.details || '')}
                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        Listen Together
                      </button>
                    )}
                  </div>
                </div>
              )}

              {user.currentActivity.type === 'game' && (
                <div className="flex items-center gap-4">
                  <GamepadIcon className="text-purple-500" size={24} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Playing {user.currentActivity.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.currentActivity.details}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isFriend && (
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
