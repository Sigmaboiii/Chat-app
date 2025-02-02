import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

interface Presence {
  status: 'online' | 'offline' | 'idle';
  activity?: {
    type: 'spotify' | 'game' | 'app';
    name: string;
    details?: string;
  };
  lastSeen?: number;
}

interface PresenceState {
  presence: Presence;
  updatePresence: (presence: Partial<Presence>) => Promise<void>;
  startTracking: () => void;
  stopTracking: () => void;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  presence: {
    status: 'offline',
  },
  
  updatePresence: async (newPresence) => {
    if (!auth.currentUser) return;
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        presence: {
          ...get().presence,
          ...newPresence,
          lastSeen: Date.now(),
        },
      });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  },
  
  startTracking: () => {
    if (!auth.currentUser) return;
    
    // Update presence when window gains/loses focus
    window.addEventListener('focus', () => {
      get().updatePresence({ status: 'online' });
    });
    
    window.addEventListener('blur', () => {
      get().updatePresence({ status: 'idle' });
    });
    
    // Update presence before user leaves
    window.addEventListener('beforeunload', () => {
      get().updatePresence({ status: 'offline' });
    });
    
    // Start listening to presence changes
    const unsubscribe = onSnapshot(
      doc(db, 'users', auth.currentUser.uid),
      (doc) => {
        const data = doc.data();
        if (data?.presence) {
          set({ presence: data.presence });
        }
      }
    );
    
    return () => {
      window.removeEventListener('focus', () => {});
      window.removeEventListener('blur', () => {});
      window.removeEventListener('beforeunload', () => {});
      unsubscribe();
    };
  },
  
  stopTracking: () => {
    // Cleanup listeners
  },
}));
