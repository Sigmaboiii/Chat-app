import { create } from 'zustand';
import { SpotifyApi } from '@spotify/web-api-ts-sdk';

interface SpotifyState {
  currentTrack: {
    name: string;
    artist: string;
    albumArt: string;
    uri: string;
  } | null;
  isPlaying: boolean;
  startListeningTogether: (trackUri: string) => Promise<void>;
  updateCurrentTrack: (track: SpotifyState['currentTrack']) => void;
}

export const useSpotifyStore = create<SpotifyState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  startListeningTogether: async (trackUri) => {
    try {
      // Initialize Spotify SDK and start playback
      const sdk = SpotifyApi.withClientCredentials(
        import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
      );
      
      // Start playback logic here
      set({ isPlaying: true });
    } catch (error) {
      console.error('Failed to start listening together:', error);
    }
  },
  updateCurrentTrack: (track) => set({ currentTrack: track }),
}));
