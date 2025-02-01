import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, AlertCircle, Sun, Moon } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import toast from 'react-hot-toast';
import { useThemeStore } from '../../store/themeStore';

interface FormError {
  field: string;
  message: string;
}

export const AuthForm = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState<FormError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateForm = () => {
    const newErrors: FormError[] = [];
    
    if (!isOnline) {
      toast.error('No internet connection. Please check your network.');
      return false;
    }

    if (!email) {
      newErrors.push({ field: 'email', message: 'Email is required' });
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!password) {
      newErrors.push({ field: 'password', message: 'Password is required' });
    } else if (password.length < 6) {
      newErrors.push({ field: 'password', message: 'Password must be at least 6 characters' });
    }

    if (!isLogin && !username) {
      newErrors.push({ field: 'username', message: 'Username is required' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleAuthError = (error: AuthError) => {
    console.error('Authentication error:', error);
    
    if (!isOnline) {
      toast.error('Network connection lost. Please check your internet connection.');
      return;
    }
    
    switch (error.code) {
      case 'auth/network-request-failed':
        toast.error('Network error. Please check your connection and try again.');
        break;
      case 'auth/email-already-in-use':
        setErrors([{ field: 'email', message: 'Email is already registered' }]);
        break;
      case 'auth/invalid-email':
        setErrors([{ field: 'email', message: 'Invalid email format' }]);
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        setErrors([{ field: 'password', message: 'Invalid email or password' }]);
        break;
      default:
        toast.error('Authentication failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Welcome back!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Account created successfully!');
      }
      setErrors([]);
    } catch (error) {
      handleAuthError(error as AuthError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  const inputClasses = (field: string) => `
    w-full pl-12 pr-4 py-3 border rounded-lg
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${getFieldError(field) ? 'border-red-500' : 'border-gray-300'}
    ${isDark ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}
    transition-all duration-200
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-md p-8 rounded-lg shadow-xl ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } transition-colors duration-200`}
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {isLogin ? 'Welcome Back! 👋' : 'Create Account! 🚀'}
        </h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${
            isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'
          } transition-colors duration-200`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="relative">
            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} size={20} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClasses('username')}
              disabled={isSubmitting}
            />
            {getFieldError('username') && (
              <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
                <AlertCircle size={16} />
                {getFieldError('username')}
              </div>
            )}
          </div>
        )}
        <div className="relative">
          <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClasses('email')}
            disabled={isSubmitting}
          />
          {getFieldError('email') && (
            <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {getFieldError('email')}
            </div>
          )}
        </div>
        <div className="relative">
          <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses('password')}
            disabled={isSubmitting}
          />
          {getFieldError('password') && (
            <div className="mt-1 text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={16} />
              {getFieldError('password')}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !isOnline}
          className={`
            w-full py-3 rounded-lg
            ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
            text-white
            transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          `}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            isLogin ? 'Sign In' : 'Sign Up'
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-gray-900 dark:text-gray-400">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors([]);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          disabled={isSubmitting}
        >
          {isLogin ? 'Sign Up' : 'Sign In'}
        </button>
      </p>
    </motion.div>
  );
};