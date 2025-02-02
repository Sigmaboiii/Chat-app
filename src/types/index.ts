export interface FriendRequest {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: number;
}

export interface Friend {
  id: string;
  email: string;
  status: 'online' | 'offline' | 'idle';
  avatarAnimation?: string;
  chatGems: number;
  presence?: {
    status: 'online' | 'offline' | 'idle';
    activity?: {
      type: 'spotify' | 'game' | 'app';
      name: string;
      details?: string;
    };
    lastSeen?: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  animation?: string;
  sound?: {
    id: string;
    url: string;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: number;
}

export interface Animation {
  id: string;
  name: string;
  type: 'message' | 'avatar' | 'sound';
  preview: string;
  price: number;
  description: string;
  modelUrl?: string;
  soundUrl?: string;
}
