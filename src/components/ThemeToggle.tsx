import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon size={12} className="text-gray-800" />
        ) : (
          <Sun size={12} className="text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
};