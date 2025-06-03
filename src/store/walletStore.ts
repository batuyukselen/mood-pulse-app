import { create } from 'zustand';
import freighterApi from "@stellar/freighter-api";
import { StellarService } from '../utils/stellarService';
import { persist } from 'zustand/middleware';

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
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  getNetworkInfo: () => Promise<void>;
  clearError: () => void;
}

// Freighter cüzdan için test ağı ayarları
const configureFreighterNetwork = async () => {
  try {
    // Freighter ayarlarının yapılandırılması
    // Freighter'ın kendi ağ ayarları kullanılacak, kullanıcının Freighter'da Test ağı seçili olmalı
  } catch (error) {
    // Network configuration error
  }
};

// Uygulama başladığında Freighter ağ ayarlarını yap
configureFreighterNetwork();

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      address: null,
      balance: '0',
      isLoading: false,
      networkInfo: null,
      error: null,
      
      connect: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Önce Freighter cüzdan kontrolü yap
          const freighterConnected = await freighterApi.isConnected();
          
          if (freighterConnected.isConnected) {
            try {
              // Kullanıcının izin verip vermediğini kontrol et
              const hasPermission = await freighterApi.isAllowed();
              
              if (!hasPermission.isAllowed) {
                // İzin iste
                const permission = await freighterApi.setAllowed();
                if (!permission.isAllowed) {
                  set({ 
                    isLoading: false,
                    error: "Freighter cüzdanına erişim izni verilmedi."
                  });
                  return;
                }
              }
              
              // Freighter'dan public key'i al
              const publicKey = await StellarService.getPublicKey();
              
              if (publicKey) {
                // Hesabın Stellar üzerinde mevcut olup olmadığını kontrol et
                const accountExists = await StellarService.accountExists(publicKey);
                
                if (!accountExists) {
                  set({ 
                    isLoading: false,
                    error: "Bu cüzdan adresi Stellar Testnet üzerinde aktif değil. Lütfen Testnet faucet'ten XLM alın."
                  });
                  return;
                }
                
                // Cüzdan bilgilerini ayarla
                set({ 
                  isConnected: true,
                  address: publicKey,
                  error: null
                });
                
                // Bakiye ve ağ bilgilerini al
                await get().refreshBalance();
                await get().getNetworkInfo();
                
                set({ isLoading: false });
                return;
              }
            } catch (error) {
              set({ 
                isLoading: false, 
                error: error instanceof Error ? error.message : "Freighter bağlantısında beklenmeyen bir hata oluştu."
              });
            }
          } else {
            set({ 
              isLoading: false,
              error: "Freighter cüzdanı bulunamadı. Lütfen Freighter tarayıcı eklentisini yükleyin."
            });
            return;
          }
          
          // Hiçbir cüzdan bağlantısı başarısız olursa, kullanıcıya bildir
          set({ 
            isLoading: false,
            error: "Cüzdan bağlantısı başarısız. Lütfen Freighter'ın yüklü olduğundan ve tarayıcıda etkin olduğundan emin olun."
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Beklenmeyen bir hata oluştu."
          });
        }
      },
      
      disconnect: () => {
        set({ 
          isConnected: false,
          address: null,
          balance: '0',
          networkInfo: null,
          error: null
        });
      },
      
      refreshBalance: async () => {
        const { address } = get();
        
        if (!address) return;
        
        try {
          const balance = await StellarService.getAccountBalance(address);
          set({ balance });
        } catch (error) {
          set({ 
            error: error instanceof Error ? `Bakiye güncelleme hatası: ${error.message}` : "Bakiye güncellenirken bir hata oluştu."
          });
        }
      },
      
      getNetworkInfo: async () => {
        try {
          const networkInfo = await StellarService.getNetworkInfo();
          set({ networkInfo });
        } catch (error) {
          set({ 
            error: error instanceof Error ? `Ağ bilgisi alma hatası: ${error.message}` : "Ağ bilgisi alınırken bir hata oluştu."
          });
        }
      },
      
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'mood-pulse-wallet-storage',
      partialize: (state) => ({ 
        isConnected: state.isConnected,
        address: state.address
      })
    }
  )
);