import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useWalletStore } from '../../store/walletStore';
import freighterApi from '@stellar/freighter-api';

interface WalletConnectProps {
  isMobile?: boolean;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ isMobile = false }) => {
  const { isConnected, connect, disconnect, address } = useWalletStore();
  const [isLoading, setIsLoading] = useState(false);
  const [freighterAvailable, setFreighterAvailable] = useState<boolean | null>(null);
  
  // Freighter cüzdanının mevcut olup olmadığını kontrol et
  useEffect(() => {
    async function checkFreighterWallet() {
      try {
        const available = await freighterApi.isConnected();
        setFreighterAvailable(available.isConnected);
      } catch (error) {
        console.error("Freighter kontrolü hatası:", error);
        setFreighterAvailable(false);
      }
    }
    
    checkFreighterWallet();
  }, []);
  
  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }
    
    setIsLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getButtonText = () => {
    if (isLoading) return 'Bağlanıyor...';
    
    if (isConnected) {
      return `${address?.slice(0, 6)}...${address?.slice(-4)}`;
    }
    
    if (freighterAvailable === false) {
      return 'Freighter Yükle';
    }
    
    return 'Cüzdan Bağla';
  };
  
  const handleButtonClick = () => {
    if (freighterAvailable === false && !isConnected) {
      // Freighter yüklü değilse ve bağlı değilse, Freighter'ı indirme sayfasına yönlendir
      window.open('https://www.freighter.app/', '_blank');
      return;
    }
    
    handleConnect();
  };
  
  return (
    <button
      onClick={handleButtonClick}
      disabled={isLoading}
      className={`flex items-center justify-center rounded-lg transition-all duration-300 ${
        isConnected
          ? 'bg-[#19C37D]/10 text-[#19C37D] hover:bg-[#19C37D]/20'
          : freighterAvailable === false 
            ? 'bg-[#5B3DF4]/70 text-white hover:bg-[#5B3DF4]/90'
            : 'bg-[#5B3DF4] text-white hover:bg-[#5B3DF4]/90'
      } ${
        isLoading ? 'opacity-70 cursor-not-allowed' : ''
      } ${
        isMobile ? 'w-full py-3' : 'px-4 py-2'
      }`}
    >
      <Wallet size={18} className="mr-2" />
      <span>{getButtonText()}</span>
    </button>
  );
};

export default WalletConnect;