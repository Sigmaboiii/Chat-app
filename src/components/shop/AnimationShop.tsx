import React from 'react';
import { motion } from 'framer-motion';
import { useShopStore } from '../../store/shopStore';
import toast from 'react-hot-toast';
import { Coins, Play, ShoppingCart } from 'lucide-react';

export const AnimationShop = () => {
  const { animations, chatGems, purchaseAnimation, ownedAnimations, previewAnimation } = useShopStore();

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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Animation Shop</h2>
        <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900 px-3 py-1 rounded-full">
          <Coins className="text-yellow-600 dark:text-yellow-400" size={20} />
          <span className="font-semibold text-yellow-600 dark:text-yellow-400">{chatGems} ChatGems</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <button
                onClick={() => previewAnimation(animation.id)}
                className="absolute bottom-2 right-2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
              >
                <Play size={20} />
              </button>
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
    </div>
  );
};