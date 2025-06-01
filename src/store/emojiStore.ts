import { create } from 'zustand';
import { EMOJI_DATA } from '../utils/constants';

interface EmojiState {
  emojiVotes: string[];
  selectedEmoji: string;
  setSelectedEmoji: (emoji: string) => void;
  castVote: () => void;
}

export const useEmojiStore = create<EmojiState>((set, get) => ({
  // Initialize with some random votes
  emojiVotes: EMOJI_DATA.flatMap(emoji => 
    Array(Math.floor(Math.random() * 10 + 5)).fill(emoji.icon)
  ),
  selectedEmoji: '',
  
  setSelectedEmoji: (emoji: string) => {
    set({ selectedEmoji: emoji });
  },
  
  castVote: () => {
    const { selectedEmoji, emojiVotes } = get();
    
    if (!selectedEmoji) return;
    
    // Add vote to the list
    set({ 
      emojiVotes: [...emojiVotes, selectedEmoji],
    });
    
    // Simulate WebSocket update with random votes
    setTimeout(() => {
      const randomEmoji = EMOJI_DATA[Math.floor(Math.random() * EMOJI_DATA.length)].icon;
      set(state => ({ 
        emojiVotes: [...state.emojiVotes, randomEmoji]
      }));
    }, 3000);
    
    // Trigger confetti effect
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('triggerConfetti');
      window.dispatchEvent(event);
    }
  }
}));