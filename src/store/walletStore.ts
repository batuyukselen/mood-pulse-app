import { create } from 'zustand';
import freighterApi from "@stellar/freighter-api";
import { StellarService } from '../utils/stellarService';

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
  isLoading: boolean;
  networkInfo: {
    network: string;
    networkUrl: string;
    networkPassphrase: string;
    sorobanRpcUrl: string | undefined;
  } | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  getNetworkInfo: () => Promise<void>;
}

// Freighter cüzdan için test ağı ayarları
const configureFreighterNetwork = async () => {
  try {
    // Freighter ayarlarının yapılandırılması
    // Freighter'ın kendi ağ ayarları kullanılacak, kullanıcının Freighter'da Test ağı seçili olmalı
    console.log("Freighter test ağı ayarları Freighter uygulamasından kontrol edilecek.");
  } catch (error) {
    console.error("Freighter ağ yapılandırması hatası:", error);
  }
};

// Uygulama başladığında Freighter ağ ayarlarını yap
configureFreighterNetwork();

export const useWalletStore = create<WalletState>((set, get) => ({
  isConnected: false,
  address: null,
  balance: '0',
  isLoading: false,
  networkInfo: null,
  
  connect: async () => {
    set({ isLoading: true });
    
    try {
      // Önce Freighter cüzdan kontrolü yap
      const freighterConnected = await freighterApi.isConnected();
      
      if (freighterConnected.isConnected) {
        try {
          // Kullanıcının izin verip vermediğini kontrol et
          const hasPermission = await freighterApi.isAllowed();
          
          if (!hasPermission.isAllowed) {
            console.log("Kullanıcı Freighter'a erişim izni vermedi, izin isteniyor...");
            
            // İzin iste
            const permission = await freighterApi.setAllowed();
            if (!permission.isAllowed) {
              console.log("Kullanıcı izin vermedi");
              set({ isLoading: false });
              return;
            }
          }
          
          // Freighter'dan public key'i al
          const publicKey = await StellarService.getPublicKey();
          
          if (publicKey) {
            console.log("Freighter cüzdanına bağlandı:", publicKey);
            
            // Cüzdan bilgilerini ayarla
            set({ 
              isConnected: true,
              address: publicKey
            });
            
            // Bakiye ve ağ bilgilerini al
            await get().refreshBalance();
            await get().getNetworkInfo();
            
            set({ isLoading: false });
            return;
          }
        } catch (error) {
          console.error("Freighter bağlantı hatası:", error);
          set({ isLoading: false });
        }
      }
      
      // Freighter bağlantısı başarısız olursa MetaMask kontrolü yap
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ 
            method: 'eth_requestAccounts' 
          });
          
          if (accounts.length > 0) {
            set({ 
              isConnected: true,
              address: accounts[0],
              isLoading: false
            });
            return;
          }
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      }
      
      // Hiçbir cüzdan bağlantısı başarısız olursa, kullanıcıya bildir
      console.warn('Gerçek cüzdan bulunamadı veya bağlantı hatası oluştu.');
      set({ isLoading: false });
    } catch (error) {
      console.error('Wallet connection error:', error);
      set({ isLoading: false });
    }
  },
  
  disconnect: () => {
    set({ 
      isConnected: false,
      address: null,
      balance: '0',
      networkInfo: null
    });
  },
  
  refreshBalance: async () => {
    const { address } = get();
    
    if (!address) return;
    
    try {
      const balance = await StellarService.getAccountBalance(address);
      set({ balance });
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  },
  
  getNetworkInfo: async () => {
    try {
      const networkInfo = await StellarService.getNetworkInfo();
      set({ networkInfo });
    } catch (error) {
      console.error('Error getting network info:', error);
    }
  }
}));