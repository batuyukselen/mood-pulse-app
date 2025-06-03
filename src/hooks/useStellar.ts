import { useState, useEffect, useCallback } from 'react';
import { StellarService } from '../utils/stellarService';
import { useWalletStore } from '../store/walletStore';

interface UseStellarOptions {
  autoConnect?: boolean;
}

export function useStellar(options: UseStellarOptions = {}) {
  const { autoConnect = false } = options;
  
  const [isWalletAvailable, setIsWalletAvailable] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { connect, disconnect, isConnected, address } = useWalletStore();

  // Check if wallet is available
  useEffect(() => {
    const checkWalletAvailability = async () => {
      const available = await StellarService.isWalletAvailable();
      setIsWalletAvailable(available);
      
      // Auto connect if enabled and wallet is available
      if (autoConnect && available && !isConnected) {
        handleConnect();
      }
    };
    
    checkWalletAvailability();
  }, [autoConnect, isConnected]);

  // Connect to wallet
  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      await connect();
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to connect to wallet';
      setError(errorMessage);
    } finally {
      setIsConnecting(false);
    }
  }, [connect]);

  // Disconnect from wallet
  const handleDisconnect = useCallback(() => {
    disconnect();
    setError(null);
  }, [disconnect]);

  // Get account balance
  const getBalance = useCallback(async () => {
    if (!address) return '0';
    
    try {
      return await StellarService.getAccountBalance(address);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to get balance';
      setError(errorMessage);
      return '0';
    }
  }, [address]);

  // Send emoji vote
  const sendEmojiVote = useCallback(async (emoji: string, name: string) => {
    if (!isConnected || !address) {
      setError('Wallet not connected');
      return null;
    }
    
    try {
      setIsConnecting(true);
      const result = await StellarService.recordEmojiSelection(emoji, name);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to send emoji vote';
      setError(errorMessage);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnected, address]);

  // Get community emoji data
  const getCommunityEmojis = useCallback(async (limit = 100) => {
    try {
      return await StellarService.getCommunityEmojis(limit);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to get community emojis';
      setError(errorMessage);
      return [];
    }
  }, []);

  return {
    isWalletAvailable,
    isConnected,
    isConnecting,
    address,
    error,
    connect: handleConnect,
    disconnect: handleDisconnect,
    getBalance,
    sendEmojiVote,
    getCommunityEmojis
  };
} 