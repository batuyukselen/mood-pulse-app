import React, { useState, useEffect } from 'react';
import { useWalletStore } from '../../store/walletStore';
import { useStellar } from '../../hooks/useStellar';
import WalletConnect from './WalletConnect';
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';

const WalletStatus: React.FC = () => {
  const { isConnected, address, balance, error, clearError } = useWalletStore();
  const stellar = useStellar();
  
  const [showCopied, setShowCopied] = useState(false);
  
  // Copy address to clipboard
  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setShowCopied(true);
    }
  };
  
  // Hide the copied message after 2 seconds
  useEffect(() => {
    if (showCopied) {
      const timer = setTimeout(() => {
        setShowCopied(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [showCopied]);
  
  // Clear error on unmount
  useEffect(() => {
    return () => {
      if (error) clearError();
    };
  }, [error, clearError]);

  // Generate Friendbot URL for account activation
  const getFriendbotUrl = () => {
    if (!address) return '';
    return `https://friendbot.stellar.org?addr=${address}`;
  };
  
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Cüzdan Durumu</h3>
          
          {isConnected ? (
            <div>
              <div className="flex items-center mb-1">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span className="text-green-700 font-medium">Bağlı</span>
              </div>
              
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm text-gray-500">Adres: </p>
                <p className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded cursor-pointer hover:bg-gray-200" onClick={copyAddressToClipboard}>
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
                {showCopied && (
                  <span className="text-xs text-green-600 flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Kopyalandı
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-500">
                Bakiye: <span className="font-medium">{parseFloat(balance).toFixed(2)} XLM</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-600 mb-2">
              Freighter cüzdanınızı bağlayarak Stellar Testnet üzerinde emoji oylaması yapabilirsiniz.
            </p>
          )}
          
          {(error || stellar.error) && (
            <div className="bg-red-50 border border-red-200 rounded p-2 mt-2">
              <div className="flex items-start">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 mr-1 flex-shrink-0" />
                <div className="text-xs text-red-600">
                  <p>{error || stellar.error}</p>
                  
                  {/* Eğer hesap aktif değil hatası varsa Friendbot bağlantısı göster */}
                  {(error?.includes('aktif değil') || stellar.error?.includes('aktif değil')) && address && (
                    <div className="mt-1">
                      <a 
                        href={getFriendbotUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Hesabınızı Testnet'te aktifleştirmek için tıklayın
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <WalletConnect isMobile={false} />
      </div>
    </div>
  );
};

export default WalletStatus;