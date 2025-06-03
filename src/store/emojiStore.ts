import { create } from 'zustand';
import { EMOJI_DATA } from '../utils/constants';
import { StellarService } from '../utils/stellarService';
import { useWalletStore } from './walletStore';

interface EmojiCount {
  emoji: string;
  name: string;
  count: number;
  color: string;
  percentage: number;
}

interface EmojiState {
  emojiCounts: EmojiCount[];
  selectedEmoji: string | null;
  isSubmitting: boolean;
  lastTransactionHash: string | null;
  stellarEmojis: EmojiCount[];
  isLoadingStellarData: boolean;
  selectEmoji: (emoji: string, name: string) => Promise<void>;
  resetSelection: () => void;
  fetchCommunityEmojis: () => Promise<void>;
}

// Initialize with all emojis from constants
const initialEmojiCounts = EMOJI_DATA.map(emoji => ({
  emoji: emoji.icon,
  name: emoji.name,
  count: Math.floor(Math.random() * 20) + 5, // Random count between 5 and 25 for initial data
  color: emoji.color,
  percentage: 0
}));

// Calculate initial percentages
const totalInitialCount = initialEmojiCounts.reduce((sum, item) => sum + item.count, 0);
initialEmojiCounts.forEach(item => {
  item.percentage = (item.count / totalInitialCount) * 100;
});

export const useEmojiStore = create<EmojiState>((set, get) => ({
  emojiCounts: initialEmojiCounts,
  selectedEmoji: null,
  isSubmitting: false,
  lastTransactionHash: null,
  stellarEmojis: [],
  isLoadingStellarData: false,
  
  selectEmoji: async (emoji, name) => {
    // Get current wallet connection status
    const { isConnected } = useWalletStore.getState();
    
    // If wallet is not connected, just update UI without blockchain interaction
    if (!isConnected) {
      set((state) => {
        // Find the emoji in the current counts
        const updatedCounts = state.emojiCounts.map(item => {
          if (item.emoji === emoji) {
            return { ...item, count: item.count + 1 };
          }
          return item;
        });
        
        // Recalculate percentages
        const totalCount = updatedCounts.reduce((sum, item) => sum + item.count, 0);
        updatedCounts.forEach(item => {
          item.percentage = (item.count / totalCount) * 100;
        });
        
        return { 
          emojiCounts: updatedCounts, 
          selectedEmoji: emoji
        };
      });
      
      return;
    }
    
    // Wallet is connected, record the selection on Stellar blockchain
    set({ isSubmitting: true });
    
    try {
      // Record emoji selection on Stellar
      const emojiData = EMOJI_DATA.find(e => e.icon === emoji);
      if (!emojiData) {
        throw new Error('Invalid emoji selected');
      }
      
      const result = await StellarService.recordEmojiSelection(emoji, emojiData.name);
      
      // Update state with transaction result
      set((state) => {
        // Find the emoji in the current counts
        const updatedCounts = state.emojiCounts.map(item => {
          if (item.emoji === emoji) {
            return { ...item, count: item.count + 1 };
          }
          return item;
        });
        
        // Recalculate percentages
        const totalCount = updatedCounts.reduce((sum, item) => sum + item.count, 0);
        updatedCounts.forEach(item => {
          item.percentage = (item.count / totalCount) * 100;
        });
        
        return { 
          emojiCounts: updatedCounts, 
          selectedEmoji: emoji,
          isSubmitting: false,
          lastTransactionHash: result.transactionHash
        };
      });
      
      // After recording the emoji, fetch updated community data
      get().fetchCommunityEmojis();
      
      // Show success notification
      alert(`Emoji seçiminiz Stellar Testnet ağına başarıyla kaydedildi!\nİşlem Hash: ${result.transactionHash}\nStellar Explorer'da görüntüleyebilirsiniz: https://testnet.stellar.expert/tx/${result.transactionHash}`);
      
    } catch (error) {
      console.error('Error recording emoji on Stellar:', error);
      set({ isSubmitting: false });
      
      // Show error notification
      alert('Emoji seçimi kaydedilemedi. Lütfen Freighter cüzdanınızın bağlı olduğundan ve Testnet seçili olduğundan emin olun.');
      
      // Still update local UI
      set((state) => {
        const updatedCounts = state.emojiCounts.map(item => {
          if (item.emoji === emoji) {
            return { ...item, count: item.count + 1 };
          }
          return item;
        });
        
        const totalCount = updatedCounts.reduce((sum, item) => sum + item.count, 0);
        updatedCounts.forEach(item => {
          item.percentage = (item.count / totalCount) * 100;
        });
        
        return { 
          emojiCounts: updatedCounts, 
          selectedEmoji: emoji
        };
      });
    }
  },
  
  resetSelection: () => {
    set({ selectedEmoji: null });
  },
  
  fetchCommunityEmojis: async () => {
    set({ isLoadingStellarData: true });
    
    try {
      // Fetch emoji data from Stellar network
      const stellarData = await StellarService.getCommunityEmojis(100);
      
      // If no data returned, fallback to local emoji counts
      if (stellarData.length === 0) {
        set((state) => ({ 
          stellarEmojis: state.emojiCounts,
          isLoadingStellarData: false 
        }));
        return;
      }
      
      // Add any missing emojis from the constant list
      const existingEmojis = stellarData.map(item => item.emoji);
      const missingEmojis = EMOJI_DATA.filter(emoji => !existingEmojis.includes(emoji.icon));
      
      const completeEmojiData = [
        ...stellarData,
        ...missingEmojis.map(emoji => ({
          emoji: emoji.icon,
          name: emoji.name,
          count: 0,
          color: emoji.color,
          percentage: 0
        }))
      ];
      
      // Update state with fetched data
      set({ 
        stellarEmojis: completeEmojiData,
        isLoadingStellarData: false 
      });
      
      console.log('Community emojis updated from Stellar network:', completeEmojiData);
    } catch (error) {
      console.error('Error fetching community emojis:', error);
      
      // Fallback to local emoji counts on error
      set((state) => ({ 
        stellarEmojis: state.emojiCounts,
        isLoadingStellarData: false 
      }));
    }
  }
}));