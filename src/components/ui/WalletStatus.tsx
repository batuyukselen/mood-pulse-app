import React from 'react';
import { useWalletStore } from '../../store/walletStore';

const WalletStatus: React.FC = () => {
  const { isConnected, address } = useWalletStore();
  
  return (
    <div className={`inline-flex items-center rounded-full py-2 px-4 ${
      isConnected 
        ? 'bg-[#19C37D]/10 text-[#19C37D]' 
        : 'bg-gray-100 text-gray-500'
    }`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${
        isConnected ? 'bg-[#19C37D]' : 'bg-gray-400'
      }`}></span>
      {isConnected 
        ? <span>{`Cüzdan Bağlı: ${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
        : <span>Cüzdan Bağlı Değil</span>
      }
    </div>
  );
};

export default WalletStatus;