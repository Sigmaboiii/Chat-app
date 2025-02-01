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
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  animation?: string;
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
  type: 'message' | 'avatar';
  preview: string; // URL to the preview
  price: number;
  description: string;
  modelUrl?: string; // For 3D models
}