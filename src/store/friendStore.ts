import { create } from 'zustand';
import { db, auth } from '../lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDocs
} from 'firebase/firestore';
import type { FriendRequest, Friend } from '../types';
import toast from 'react-hot-toast';

interface FriendState {
  friends: Friend[];
  pendingRequests: FriendRequest[];
  sendFriendRequest: (email: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  startChat: (friendId: string) => Promise<void>;
  loadFriends: () => Promise<void>;
  loadPendingRequests: () => Promise<void>;
}

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  pendingRequests: [],
  
  loadFriends: async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'friends'),
      where('users', 'array-contains', auth.currentUser.email)
    );

    onSnapshot(q, (snapshot) => {
      const friends: Friend[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        friends.push({
          id: doc.id,
          email: data.users.find((email: string) => email !== auth.currentUser?.email),
          status: data.status || 'offline',
          avatarAnimation: data.avatarAnimation,
          chatGems: data.chatGems || 0
        });
      });
      set({ friends });
    });
  },

  loadPendingRequests: async () => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'friendRequests'),
      where('to', '==', auth.currentUser.email),
      where('status', '==', 'pending')
    );

    onSnapshot(q, (snapshot) => {
      const requests: FriendRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          from: data.from,
          to: data.to,
          status: data.status,
          timestamp: data.timestamp?.toMillis() || Date.now()
        });
      });
      set({ pendingRequests: requests });
    });
  },
  
  sendFriendRequest: async (email: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    if (email === auth.currentUser.email) throw new Error('Cannot add yourself');

    // Check if request already exists
    const existingRequestsQuery = query(
      collection(db, 'friendRequests'),
      where('from', '==', auth.currentUser.email),
      where('to', '==', email)
    );
    
    const existingRequests = await getDocs(existingRequestsQuery);
    if (!existingRequests.empty) {
      throw new Error('Friend request already sent');
    }

    // Check if they're already friends
    const existingFriendsQuery = query(
      collection(db, 'friends'),
      where('users', 'array-contains', auth.currentUser.email)
    );
    
    const existingFriends = await getDocs(existingFriendsQuery);
    let alreadyFriends = false;
    existingFriends.forEach(doc => {
      const data = doc.data();
      if (data.users.includes(email)) {
        alreadyFriends = true;
      }
    });

    if (alreadyFriends) {
      throw new Error('Already friends with this user');
    }

    const requestsRef = collection(db, 'friendRequests');
    await addDoc(requestsRef, {
      from: auth.currentUser.email,
      to: email,
      status: 'pending',
      timestamp: serverTimestamp(),
    });

    toast.success('Friend request sent!');
  },

  acceptRequest: async (requestId: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    const requestRef = doc(db, 'friendRequests', requestId);
    const request = get().pendingRequests.find(r => r.id === requestId);
    
    if (!request) return;

    // Create friendship
    const friendsRef = collection(db, 'friends');
    await addDoc(friendsRef, {
      users: [request.from, request.to],
      status: 'online',
      createdAt: serverTimestamp()
    });

    // Update request status
    await updateDoc(requestRef, { status: 'accepted' });

    // Create a chat room
    const chatRef = collection(db, 'chats');
    await addDoc(chatRef, {
      participants: [request.from, request.to],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    toast.success('Friend request accepted!');
  },

  rejectRequest: async (requestId: string) => {
    const requestRef = doc(db, 'friendRequests', requestId);
    await deleteDoc(requestRef);
    toast.success('Friend request rejected');
  },

  startChat: async (friendId: string) => {
    const friend = get().friends.find(f => f.id === friendId);
    if (!friend) return;
    
    // Chat logic will be handled by the ChatInterface component
  },
}));