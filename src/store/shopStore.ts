import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Animation } from '../types';
import { auth } from '../lib/firebase';
import { format } from 'date-fns';

interface ShopState {
  chatGems: number;
  ownedAnimations: string[];
  animations: Animation[];
  lastDailyReward: string | null;
  purchaseAnimation: (animationId: string) => boolean;
  addChatGems: (amount: number) => void;
  previewAnimation: (animationId: string) => void;
  claimDailyReward: () => boolean;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      chatGems: 0,
      ownedAnimations: [],
      lastDailyReward: null,
      animations: [
        {
          id: 'sparkle-message',
          name: 'Sparkle Message',
          type: 'message',
          preview: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzM5OWQ0YjQ4ZTQ4YzM4YjY4NjQ4ZjI5ZjE5YzM4ZDM4ZDM4M2NiYyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKzEQfYQ7iD60Co/giphy.gif',
          price: 50,
          description: 'Add sparkles to your messages'
        },
        {
          id: 'rainbow-trail',
          name: 'Rainbow Trail',
          type: 'message',
          preview: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzE4MzM1ZjY4ZWM4ZjM4M2M4ZjM4M2M4ZjM4M2M4ZjM4M2M4ZiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKzEQfYQ7iD60Co/giphy.gif',
          price: 75,
          description: 'Messages leave a rainbow trail'
        },
        {
          id: 'online-3d',
          name: 'Online 3D Avatar',
          type: 'avatar',
          preview: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzM5OWQ0YjQ4ZTQ4YzM4YjY4NjQ4ZjI5ZjE5YzM4ZDM4ZDM4M2NiYyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKzEQfYQ7iD60Co/giphy.gif',
          price: 100,
          description: 'A spinning 3D avatar that shows when you\'re online',
          modelUrl: '/models/online-avatar.glb'
        },
        {
          id: 'idle-3d',
          name: 'Idle 3D Avatar',
          type: 'avatar',
          preview: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzE4MzM1ZjY4ZWM4ZjM4M2M4ZjM4M2M4ZjM4M2M4ZjM4M2M4ZiZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKzEQfYQ7iD60Co/giphy.gif',
          price: 100,
          description: 'A floating 3D avatar for idle status',
          modelUrl: '/models/idle-avatar.glb'
        },
        {
          id: 'confetti-burst',
          name: 'Confetti Burst',
          type: 'message',
          preview: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzM5OWQ0YjQ4ZTQ4YzM4YjY4NjQ4ZjI5ZjE5YzM4ZDM4ZDM4M2NiYyZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/3o7TKzEQfYQ7iD60Co/giphy.gif',
          price: 60,
          description: 'Burst of confetti when sending messages'
        }
      ],
      purchaseAnimation: (animationId: string) => {
        const state = get();
        const animation = state.animations.find(a => a.id === animationId);
        
        if (!animation || state.ownedAnimations.includes(animationId)) {
          return false;
        }
        
        if (state.chatGems >= animation.price) {
          set(state => ({
            chatGems: state.chatGems - animation.price,
            ownedAnimations: [...state.ownedAnimations, animationId]
          }));
          return true;
        }
        
        return false;
      },
      addChatGems: (amount: number) => {
        set(state => ({ chatGems: state.chatGems + amount }));
      },
      previewAnimation: (animationId: string) => {
        const animation = get().animations.find(a => a.id === animationId);
        if (animation) {
          // Preview logic will be handled by the UI component
        }
      },
      claimDailyReward: () => {
        const state = get();
        const today = format(new Date(), 'yyyy-MM-dd');
        
        if (state.lastDailyReward === today) {
          return false;
        }
        
        set(state => ({
          chatGems: state.chatGems + 10,
          lastDailyReward: today
        }));
        
        return true;
      }
    }),
    {
      name: 'shop-storage'
    }
  )
);