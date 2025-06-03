import React, { useState, useEffect } from 'react';
import { useEmojiStore } from '../../store/emojiStore';
import { EMOJI_DATA } from '../../utils/constants';
import { useWalletStore } from '../../store/walletStore';
import { Loader2, ExternalLink } from 'lucide-react';
import { useStellar } from '../../hooks/useStellar';

const EmojiSelector: React.FC = () => {
  const { selectEmoji, selectedEmoji, isSubmitting, lastTransactionHash } = useEmojiStore();
  const { isConnected } = useWalletStore();
  const stellar = useStellar();
  
  const [transactionUrl, setTransactionUrl] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  // Set transaction URL when hash changes
  useEffect(() => {
    if (lastTransactionHash) {
      setTransactionUrl(`https://testnet.stellar.expert/tx/${lastTransactionHash}`);
      setShowSuccess(true);
      
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [lastTransactionHash]);
  
  // Handle emoji selection with improved error handling
  const handleEmojiSelect = async (emoji: string, name: string) => {
    try {
      await selectEmoji(emoji, name);
    } catch (error) {
      console.error('Error selecting emoji:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-xl font-medium text-gray-800">How are you feeling today?</h3>
      
      <div className="flex flex-wrap justify-center gap-4">
        {EMOJI_DATA.map((emoji) => (
          <button
            key={emoji.name}
            onClick={() => handleEmojiSelect(emoji.icon, emoji.name)}
            disabled={isSubmitting}
            className={`p-4 text-4xl rounded-full transition-all duration-300 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
            style={{
              boxShadow: selectedEmoji === emoji.icon ? '0 0 0 3px white, 0 0 0 6px ' + emoji.color : 'none',
              transform: selectedEmoji === emoji.icon ? 'scale(1.1)' : 'scale(1)'
            }}
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
      
      {showSuccess && lastTransactionHash && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md text-center">
          <p className="text-green-700 text-sm font-medium mb-1">
            Emoji seçiminiz başarıyla Stellar Testnet'e kaydedildi!
          </p>
          <a 
            href={transactionUrl || `https://testnet.stellar.expert/tx/${lastTransactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5B3DF4] hover:underline text-sm inline-flex items-center"
          >
            İşlemi Stellar Explorer'da görüntüleyin
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      )}
      
      {!isConnected && selectedEmoji && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-md text-sm text-amber-700">
          <p className="font-medium mb-1">Cüzdanınız bağlı değil</p>
          <p>Emoji seçiminiz sadece yerel olarak kaydedildi. Stellar ağına kaydetmek için cüzdanınızı bağlayın.</p>
        </div>
      )}
      
      {stellar.error && !isSubmitting && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md text-sm text-red-700">
          <p className="font-medium mb-1">Hata Oluştu</p>
          <p>{stellar.error}</p>
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;