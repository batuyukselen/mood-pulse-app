import React from 'react';
import Button from '../ui/Button';
import WalletStatus from '../ui/WalletStatus';
import { useWalletStore } from '../../store/walletStore';
import HeroIllustration from '../ui/HeroIllustration';
import EmojiSelector from '../ui/EmojiSelector';

const HeroSection: React.FC = () => {
  const { isConnected } = useWalletStore();

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-4 inline-block bg-[#5B3DF4]/10 text-[#5B3DF4] font-medium py-1 px-3 rounded-full text-sm">
              Web3 • Real-Time • Community
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 leading-tight">
              Mood Pulse Board
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              Topluluğun duygu nabzını anında görün. Cüzdanını bağla, emojini seç, akışa katıl.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                href="https://app.moodpulseboard.xyz" 
                variant="primary"
                className="px-6 py-3"
              >
                Demo Uygulamayı Aç
              </Button>
              <Button 
                href="https://github.com/moodpulseboard" 
                variant="ghost"
                className="px-6 py-3"
              >
                GitHub
              </Button>
            </div>
            
            <WalletStatus />
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
              <EmojiSelector />
            </div>
          </div>
          
          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>
      </div>
      
      {/* Background gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5B3DF4]/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#FFB400]/10 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default HeroSection;