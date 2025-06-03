import React, { useEffect } from 'react';
import { useWalletStore } from '../../store/walletStore';

const WalletStatus: React.FC = () => {
  const { isConnected, address, balance, networkInfo, refreshBalance } = useWalletStore();
  
  // Cüzdan bağlandığında ve her 30 saniyede bir bakiyeyi güncelle
  useEffect(() => {
    if (isConnected && address) {
      // İlk yükleme
      refreshBalance();
      
      // Her 30 saniyede bir bakiyeyi güncelle
      const intervalId = setInterval(() => {
        refreshBalance();
      }, 30000);
      
      return () => clearInterval(intervalId);
    }
  }, [isConnected, address, refreshBalance]);
  
  if (!isConnected || !address) {
    return (
      <div className="inline-flex items-center rounded-full py-2 px-4 bg-gray-100 text-gray-500">
        <span className="w-2 h-2 rounded-full mr-2 bg-gray-400"></span>
        <span>Cüzdan Bağlı Değil</span>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="inline-flex items-center rounded-full py-2 px-4 bg-[#19C37D]/10 text-[#19C37D]">
        <span className="w-2 h-2 rounded-full mr-2 bg-[#19C37D]"></span>
        <span>{`Cüzdan Bağlı: ${address.slice(0, 6)}...${address.slice(-4)}`}</span>
      </div>
      
      <div className="inline-flex items-center rounded-full py-2 px-4 bg-[#FFB400]/10 text-[#FFB400]">
        <span className="font-medium mr-2">Bakiye:</span>
        <span>{parseFloat(balance).toFixed(2)} XLM</span>
      </div>
      
      {networkInfo && (
        <div className="inline-flex items-center rounded-full py-2 px-4 bg-[#5B3DF4]/10 text-[#5B3DF4]">
          <span className="font-medium mr-2">Ağ:</span>
          <span>{networkInfo.network}</span>
        </div>
      )}
    </div>
  );
};

export default WalletStatus;