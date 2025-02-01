import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { Smile, Paperclip, Send, Image, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useShopStore } from '../../store/shopStore';
import toast from 'react-hot-toast';

const gf = new GiphyFetch('your-giphy-api-key');

interface ChatInterfaceProps {
  friendId: string;
  friendEmail: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ friendId, friendEmail }) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();
  const { ownedAnimations } = useShopStore();

  const [messages, setMessages] = useState([
    // Dummy messages for demonstration
    { id: '1', senderId: user?.uid, content: 'Hey there!', timestamp: Date.now() - 1000000 },
    { id: '2', senderId: friendId, content: 'Hi! How are you?', timestamp: Date.now() - 500000 },
  ]);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Add message to the list
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: user?.uid,
      content: message,
      timestamp: Date.now()
    }]);

    setMessage('');
    setShowEmojiPicker(false);
    setShowGifPicker(false);
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
  };

  const handleGifSelect = (gif: any) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      senderId: user?.uid,
      content: gif.images.original.url,
      type: 'gif',
      timestamp: Date.now()
    }]);
    setShowGifPicker(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic
      toast.success('File upload coming soon!');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b dark:border-gray-700 flex items-center">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
          {friendEmail[0].toUpperCase()}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">{friendEmail}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.senderId === user?.uid
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              {msg.type === 'gif' ? (
                <img src={msg.content} alt="GIF" className="rounded-lg" />
              ) : (
                <p>{msg.content}</p>
              )}
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </motion.div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Smile size={20} />
          </button>
          <button
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Paperclip size={20} />
          </button>
          <button
            onClick={() => setShowGifPicker(!showGifPicker)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <Image size={20} />
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={handleSendMessage}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4">
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full"
              >
                <X size={16} />
              </button>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
              />
            </div>
          </div>
        )}

        {/* GIF Picker */}
        {showGifPicker && (
          <div className="absolute bottom-20 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl">
            <div className="relative">
              <button
                onClick={() => setShowGifPicker(false)}
                className="absolute -top-2 -right-2 p-1 bg-gray-800 text-white rounded-full"
              >
                <X size={16} />
              </button>
              <Grid
                width={300}
                columns={3}
                fetchGifs={(offset: number) => gf.trending({ offset, limit: 10 })}
                onGifClick={(gif, e) => {
                  e.preventDefault();
                  handleGifSelect(gif);
                }}
              />
            </div>
          </div>
        )}

        {/* Attachment Menu */}
        {showAttachMenu && (
          <div className="absolute bottom-20 left-16 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-full"
            >
              <Paperclip size={20} />
              <span>Upload File</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};