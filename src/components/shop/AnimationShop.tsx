import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopStore } from '../../store/shopStore';
import toast from 'react-hot-toast';
import { Coins, Play, ShoppingCart, X, Volume2 } from 'lucide-react';

export const AnimationShop = ({ onClose }: { onClose: () => void }) => {
  const { animations, chatGems, purchaseAnimation, ownedAnimations, previewAnimation } = useShopStore();
  const [previewingAnimation, setPreviewingAnimation] = React.useState<string | null>(null);

  const handlePurchase = (animationId: string) => {
    const animation = animations.find(a => a.id === animationId);
    if (!animation) return;

    if (ownedAnimations.includes(animationId)) {
      toast.error('You already own this animation!');
      return;
    }

    if (purchaseAnimation(animationId)) {
      toast.success(`Successfully purchased ${animation.name}!`);
    } else {
      toast.error('Not enough ChatGems!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-6 bg-black/50 backdrop-blur-sm"
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden relative"
        layoutId="shop-modal"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Animation Shop</h2>
            <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-4 py-2 rounded-full">
              <Coins className="text-yellow-600 dark:text-yellow-400" size={20} />
              <span className="font-semibold text-yellow-600 dark:text-yellow-400">{chatGems} ChatGems</span>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {animations.map((animation) => (
            <motion.div
              key={animation.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md"
            >
              <div className="aspect-video relative overflow-hidden bg-gray-200 dark:bg-gray-600">
                <img
                  src={animation.preview}
                  alt={animation.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 flex gap-2">
                  {animation.type === 'sound' && (
                    <button
                      onClick={() => {/* Play sound preview */}}
                      className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                    >
                      <Volume2 size={20} />
                    </button>
                  )}
                  <button
                    onClick={() => setPreviewingAnimation(animation.id)}
                    className="p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                  >
                    <Play size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {animation.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {animation.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <Coins size={16} />
                    <span className="font-semibold">{animation.price}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePurchase(animation.id)}
                    disabled={ownedAnimations.includes(animation.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                      ownedAnimations.includes(animation.id)
                        ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    } transition-colors`}
                  >
                    {ownedAnimations.includes(animation.id) ? (
                      'Owned'
                    ) : (
                      <>
                        <ShoppingCart size={16} />
                        Buy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {previewingAnimation && (
            <AnimationPreview
              animationId={previewingAnimation}
              onClose={() => setPreviewingAnimation(null)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const AnimationPreview = ({ animationId, onClose }: { animationId: string; onClose: () => void }) => {
  const { animations } = useShopStore();
  const animation = animations.find(a => a.id === animationId);

  if (!animation) return null;

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
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Preview: {animation.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          {/* Preview content based on animation type */}
          {animation.type === 'message' && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white rounded-lg p-3 max-w-[70%]">
                  <p>Hey! How are you? ✨</p>
                </div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-3 max-w-[70%]">
                  <p>I'm doing great! How about you? 🌟</p>
                </div>
              </div>
            </div>
          )}
          {animation.type === 'sound' && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {/* Play sound */}}
                className="p-4 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
              >
                <Volume2 size={24} />
              </button>
              <p className="text-gray-600 dark:text-gray-300">
                Click to preview sound effect
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
