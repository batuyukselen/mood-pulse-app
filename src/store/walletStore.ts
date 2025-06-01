import { create } from 'zustand';
import freighterApi from "@stellar/freighter-api";

interface WalletState {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
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

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  address: null,
  
  connect: async () => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
            return;
          }
        }
        
        // Freighter'dan public key'i al
        const addressData = await freighterApi.getAddress();
        
        if (addressData.address) {
          console.log("Freighter cüzdanına bağlandı:", addressData.address);
          set({ 
            isConnected: true,
            address: addressData.address
          });
          return;
        }
      } catch (error) {
        console.error("Freighter bağlantı hatası:", error);
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
            address: accounts[0]
          });
          return;
        }
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }
    
    // Hiçbir cüzdan bağlantısı başarısız olursa, simüle edilmiş adres kullanma
    // Bu kısım geliştirme aşamasında test için kullanılabilir
    const mockAddress = '0x' + Array(40).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    console.warn('Gerçek cüzdan bulunamadı, test adresi kullanılıyor:', mockAddress);
    set({ 
      isConnected: true,
      address: mockAddress
    });
  },
  
  disconnect: () => {
    set({ 
      isConnected: false,
      address: null
    });
  }
}));