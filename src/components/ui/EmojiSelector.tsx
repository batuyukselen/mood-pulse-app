import React from 'react';
import { useEmojiStore } from '../../store/emojiStore';
import { EMOJI_DATA } from '../../utils/constants';
import { useWalletStore } from '../../store/walletStore';
import { Loader2 } from 'lucide-react';

const EmojiSelector: React.FC = () => {
  const { selectEmoji, selectedEmoji, isSubmitting, lastTransactionHash } = useEmojiStore();
  const { isConnected } = useWalletStore();
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-medium text-gray-800">How are you feeling today?</h3>
      
      <div className="flex flex-wrap justify-center gap-4">
        {EMOJI_DATA.map((emoji) => (
          <button
            key={emoji.name}
            onClick={() => selectEmoji(emoji.icon, emoji.name)}
            disabled={isSubmitting}
            className={`p-4 text-4xl rounded-full transition-all duration-300 ${
              selectedEmoji === emoji.icon 
                ? `ring-4 ring-${emoji.color.replace('#', '')} shadow-lg` 
                : 'hover:bg-gray-100'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={emoji.name}
            aria-label={`Select ${emoji.name} emoji`}
          >
            {emoji.icon}
          </button>
        ))}
      </div>
      
      {isSubmitting && (
        <div className="flex items-center justify-center text-[#5B3DF4]">
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          <span>Emoji seçiminiz Stellar ağına kaydediliyor...</span>
        </div>
      )}
      
      {!isConnected && selectedEmoji && (
        <div className="text-amber-600 text-sm mt-2">
          Not: Cüzdanınız bağlı değil. Emoji seçiminiz sadece yerel olarak kaydedildi. 
          Stellar ağına kaydetmek için cüzdanınızı bağlayın.
        </div>
      )}
      
      {lastTransactionHash && (
        <div className="mt-2 text-sm">
          <a 
            href={`https://testnet.stellar.expert/tx/${lastTransactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5B3DF4] hover:underline"
          >
            Son işleminizi Stellar Explorer'da görüntüleyin
          </a>
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;