import React, { useEffect } from 'react';
import { useEmojiStore } from '../../store/emojiStore';
import StatBlock from '../ui/StatBlock';
import PieChart from '../ui/PieChart';

const LiveChartSection: React.FC = () => {
  const { emojiCounts, selectedEmoji, stellarEmojis, isLoadingStellarData, fetchCommunityEmojis } = useEmojiStore();

  // Fetch emoji data from Stellar network
  useEffect(() => {
    // Fetch immediately on component mount
    fetchCommunityEmojis();
    
    // Set up interval for periodic updates
    const interval = setInterval(() => {
      fetchCommunityEmojis();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchCommunityEmojis]);

  // Calculate stats from the emoji data
  const totalVotes = stellarEmojis.reduce((sum, item) => sum + item.count, 0) || 
                    emojiCounts.reduce((sum, item) => sum + item.count, 0);
  
  // Find most popular emoji
  const getMostPopular = () => {
    const emojis = stellarEmojis.length > 0 ? stellarEmojis : emojiCounts;
    if (emojis.length === 0) return '❓';
    
    return emojis.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    ).emoji;
  };
  
  const mostPopular = getMostPopular();
  
  // Get top three emojis
  const getTopThree = () => {
    const emojis = stellarEmojis.length > 0 ? stellarEmojis : emojiCounts;
    return [...emojis]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };
  
  const topThree = getTopThree();

  // Use Stellar data if available, otherwise fall back to local data
  const chartData = stellarEmojis.length > 0 
    ? stellarEmojis.map(item => ({
        emoji: item.emoji,
        count: item.count,
        color: item.color
      }))
    : emojiCounts.map(item => ({
        emoji: item.emoji,
        count: item.count,
        color: item.color
      }));

  return (
    <section id="chart" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Live Community Mood Chart
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how everyone is feeling right now on the Stellar Testnet. The chart updates in real-time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Stats */}
          <div className="space-y-4">
            <StatBlock 
              title="Total Votes" 
              value={totalVotes.toString()} 
              icon="Chart" 
            />
            <StatBlock 
              title="Most Popular" 
              value={mostPopular} 
              icon="Award" 
            />
            <StatBlock 
              title="Your Mood" 
              value={selectedEmoji || '❓'} 
              icon="Clock" 
            />
            
            {topThree.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-4 mt-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Top Moods</h3>
                <div className="space-y-2">
                  {topThree.map((item, index) => (
                    <div key={item.emoji} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">{item.emoji}</span>
                        <span className="text-gray-600">{`#${index + 1}`}</span>
                      </div>
                      <span className="font-medium">{item.count} votes</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Chart */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                Emoji Distribution
                {stellarEmojis.length > 0 && <span className="text-sm font-normal text-gray-500 ml-2">(Live from Stellar Network)</span>}
              </h3>
              <div className="h-80">
                {isLoadingStellarData ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">Loading mood data from Stellar network...</p>
                  </div>
                ) : chartData.length > 0 ? (
                  <PieChart data={chartData} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No emoji data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveChartSection;