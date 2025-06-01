import React, { useEffect, useState } from 'react';
import PieChart from '../ui/PieChart';
import StatBlock from '../ui/StatBlock';
import EmojiSelector from '../ui/EmojiSelector';
import { useWalletStore } from '../../store/walletStore';
import { useEmojiStore } from '../../store/emojiStore';
import { EMOJI_DATA } from '../../utils/constants';

const LiveChartSection: React.FC = () => {
  const { isConnected } = useWalletStore();
  const { emojiVotes, selectedEmoji, setSelectedEmoji, castVote } = useEmojiStore();
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  // Update last update time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdate(now.toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Find most popular emoji
  const getMostPopularEmoji = () => {
    if (emojiVotes.length === 0) return "😐";
    
    const counts = emojiVotes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };
  
  return (
    <section id="chart" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Anlık Emoji Dağılımı
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Topluluğun duygusal nabzını gerçek zamanlı olarak görselleştiriyoruz. Seçiminiz anında grafiğe yansır.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <StatBlock 
            label="Toplam Oy"
            value={emojiVotes.length.toString()}
            icon="📊"
          />
          <StatBlock 
            label="En Popüler Emoji"
            value={getMostPopularEmoji()}
            icon="🏆"
          />
          <StatBlock 
            label="Son Güncelleme"
            value={lastUpdate}
            icon="🕒"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <PieChart 
              data={EMOJI_DATA.map(emoji => ({
                emoji: emoji.icon,
                count: emojiVotes.filter(vote => vote === emoji.icon).length || 1,
                color: emoji.color
              }))}
            />
          </div>
          
          <div>
            <h3 className="text-2xl font-heading font-bold mb-6">
              Duygu Durumunuzu Seçin
            </h3>
            <p className="text-gray-600 mb-8">
              Şu anki ruh halinizi en iyi yansıtan emojiyi seçin. Seçiminiz anında grafiğe yansıyacak ve topluluğun duygu durumunu şekillendirecek.
            </p>
            
            <EmojiSelector 
              selected={selectedEmoji}
              onSelect={setSelectedEmoji}
              isDisabled={!isConnected}
            />
            
            <div className="mt-8">
              <button
                onClick={castVote}
                disabled={!isConnected || !selectedEmoji}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isConnected && selectedEmoji
                    ? 'bg-[#5B3DF4] text-white hover:bg-[#5B3DF4]/90 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isConnected ? 'Oyunuzu Gönderin' : 'Oy vermek için cüzdanınızı bağlayın'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveChartSection;