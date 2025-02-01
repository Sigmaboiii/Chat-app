import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useAuthStore } from './store/authStore';
import { AuthForm } from './components/auth/AuthForm';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { ChevronRight, ChevronLeft, Search, Bell, Settings, ShoppingBag, X } from 'lucide-react';
import { useThemeStore } from './store/themeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './components/ThemeToggle';
import { UserMenu } from './components/user/UserMenu';
import { FriendRequestsModal } from './components/friends/FriendRequestsModal';
import { AnimationShop } from './components/shop/AnimationShop';
import { SpaceScene } from './components/three/SpaceScene';
import { Earth } from './components/three/Earth';
import { useFriendStore } from './store/friendStore';
import { AddFriendModal } from './components/friends/AddFriendModal';

function App() {
  const { setUser, setLoading, user, loading } = useAuthStore();
  const { isDark } = useThemeStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState(false);
  const { friends } = useFriendStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
        <Toaster position="top-right" />
        <div className="w-full flex items-center justify-center p-4">
          <div className="w-full max-w-6xl flex items-center">
            <div className="w-1/2">
              <AuthForm />
            </div>
            <div className="w-1/2 h-[600px]">
              <Canvas>
                <OrbitControls enableZoom={false} />
                <Earth />
                <Stars />
              </Canvas>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
        {/* Sidebar Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 shadow-lg relative"
            >
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold">Online Friends</h3>
                    <button
                      onClick={() => setIsAddFriendModalOpen(true)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <UserPlus size={20} className="text-blue-500" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {friends.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          U currently don't have friends, wanna add some? 😉
                        </p>
                      </div>
                    ) : (
                      friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                            {friend.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{friend.email}</p>
                            <p className="text-sm text-gray-500">{friend.status}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-6">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsShopOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ShoppingBag size={20} />
              </button>
              <button
                onClick={() => setIsRequestsModalOpen(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative"
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <ThemeToggle />
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white cursor-pointer">
                  {user.email?.[0].toUpperCase()}
                </div>
                <UserMenu isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <h2 className="text-3xl font-semibold mb-2">Select a conversation 💭</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  Choose a friend from the sidebar to start chatting ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddFriendModal
        isOpen={isAddFriendModalOpen}
        onClose={() => setIsAddFriendModalOpen(false)}
      />

      <FriendRequestsModal
        isOpen={isRequestsModalOpen}
        onClose={() => setIsRequestsModalOpen(false)}
      />

      <AnimatePresence>
        {isShopOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl"
            >
              <AnimationShop />
              <button
                onClick={() => setIsShopOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}

export default App;