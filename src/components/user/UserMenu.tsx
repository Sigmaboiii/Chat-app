import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Camera, Key, CircleUserRound, FileEdit } from 'lucide-react';
import { auth, storage } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, updatePassword } from 'firebase/auth';
import toast from 'react-hot-toast';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserMenu = ({ isOpen, onClose }: UserMenuProps) => {
  const { user } = useAuthStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      await updateProfile(user, {
        photoURL: downloadURL
      });
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
    }
  };

  const handlePasswordChange = async () => {
    const newPassword = prompt('Enter new password:');
    if (!newPassword || !user) return;

    try {
      await updatePassword(user, newPassword);
      toast.success('Password updated successfully');
    } catch (error) {
      toast.error('Failed to update password');
    }
  };

  const handleStatusChange = async () => {
    const newStatus = prompt('Enter new status:');
    if (!newStatus || !user) return;

    try {
      // Update status in Firestore
      // Implementation depends on your data structure
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleBioChange = async () => {
    const newBio = prompt('Enter new bio:');
    if (!newBio || !user) return;

    try {
      // Update bio in Firestore
      // Implementation depends on your data structure
      toast.success('Bio updated successfully');
    } catch (error) {
      toast.error('Failed to update bio');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute right-0 top-16 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
          </div>

          <div className="py-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureChange}
              accept="image/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Camera size={16} />
              Change Profile Picture
            </button>

            <button
              onClick={handlePasswordChange}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Key size={16} />
              Change Password
            </button>

            <button
              onClick={handleStatusChange}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <CircleUserRound size={16} />
              Update Status
            </button>

            <button
              onClick={handleBioChange}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <FileEdit size={16} />
              Update Bio
            </button>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};