import { create } from 'zustand';
import { db, auth, checkUserExists } from '../lib/firebase';
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
    if (!auth.currentUser) {
      throw new Error('You must be logged in to send friend requests');
    }
    
    if (email === auth.currentUser.email) {
      throw new Error('You cannot send a friend request to yourself');
    }

    // Check if the user exists
    const userExists = await checkUserExists(email);
    if (!userExists) {
      throw new Error('User not found');
    }

    // Check for existing requests
    const existingRequestsQuery = query(
      collection(db, 'friendRequests'),
      where('from', '==', auth.currentUser.email),
      where('to', '==', email),
      where('status', '==', 'pending')
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
      throw new Error('You are already friends with this user');
    }

    try {
      const requestsRef = collection(db, 'friendRequests');
      await addDoc(requestsRef, {
        from: auth.currentUser.email,
        to: email,
        status: 'pending',
        timestamp: serverTimestamp(),
      });

      toast.success('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw new Error('Failed to send friend request. Please try again.');
    }
  },

  acceptRequest: async (requestId: string) => {
    if (!auth.currentUser) throw new Error('Not authenticated');

    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      const request = get().pendingRequests.find(r => r.id === requestId);
      
      if (!request) return;

      // Create friendship document
      const friendsRef = collection(db, 'friends');
      await addDoc(friendsRef, {
        users: [request.from, request.to],
        status: 'online',
        createdAt: serverTimestamp()
      });

      // Update request status
      await updateDoc(requestRef, { status: 'accepted' });

      // Create chat room
      const chatRef = collection(db, 'chats');
      await addDoc(chatRef, {
        participants: [request.from, request.to],
        createdAt: serverTimestamp(),
        lastMessage: null,
        updatedAt: serverTimestamp(),
      });

      toast.success('Friend request accepted!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast.error('Failed to accept friend request. Please try again.');
    }
  },

  rejectRequest: async (requestId: string) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await deleteDoc(requestRef);
      toast.success('Friend request rejected');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast.error('Failed to reject friend request. Please try again.');
    }
  },

  startChat: async (friendId: string) => {
    const friend = get().friends.find(f => f.id === friendId);
    if (!friend) return;
    
    // Chat logic will be handled by the ChatInterface component
  },
}));
