# Mood Pulse App

Mood Pulse App, kullanıcıların duygusal durumlarını emojiler aracılığıyla ifade edebilecekleri ve topluluk içindeki duygu durumlarını gerçek zamanlı olarak görüntüleyebilecekleri bir web uygulamasıdır. Stellar Blockchain ağı üzerinde çalışan bu uygulama, Freighter cüzdan entegrasyonu ile birlikte güvenli bir kullanıcı deneyimi sunmaktadır.

![Mood Pulse App Banner](https://i.imgur.com/XBpGXjL.png)

## İçindekiler

- [Özellikler](#özellikler)
- [Demo](#demo)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Freighter Cüzdan Entegrasyonu](#freighter-cüzdan-entegrasyonu)
- [Kullanım](#kullanım)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Özellikler

- **Freighter Cüzdan Bağlantısı**: Kullanıcılar Stellar Blockchain üzerinde çalışan Freighter cüzdanlarını uygulamaya bağlayabilir.
- **Test Ağı Desteği**: Stellar Testnet ile uyumlu yapılandırma.
- **Duygu Durumu Emojileri**: Kullanıcılar beş farklı emoji arasından seçim yaparak duygusal durumlarını belirtebilir.
- **Canlı Grafik**: Topluluk içindeki duygu durumlarını gerçek zamanlı olarak gösteren grafikler.
- **Responsive Tasarım**: Mobil cihazlar dahil tüm ekran boyutlarına uyumlu tasarım.

## Demo

Uygulamanın canlı demo sürümüne [buradan](https://github.com/batuyukselen/mood-pulse-app) erişebilirsiniz.

## Teknolojiler

Bu projede kullanılan başlıca teknolojiler:

- **Frontend**: React, TypeScript, TailwindCSS
- **Blockchain**: Stellar Network, Soroban Smart Contracts
- **Cüzdan Entegrasyonu**: Freighter API
- **Build Araçları**: Vite, PostCSS
- **State Yönetimi**: Zustand

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için şu adımları izleyin:

1. Projeyi klonlayın:
```bash
git clone https://github.com/batuyukselen/mood-pulse-app.git
cd mood-pulse-app
```

2. Gerekli paketleri yükleyin:
```bash
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyin.

## Freighter Cüzdan Entegrasyonu

Mood Pulse App, Stellar Blockchain üzerinde çalışan [Freighter Cüzdan](https://www.freighter.app/) entegrasyonu ile kullanıcıların blockchain üzerinde işlem yapabilmelerini sağlar. Bu entegrasyon sayesinde:

- Kullanıcılar uygulamaya güvenli bir şekilde bağlanabilir
- Stellar Testnet ağı üzerinde işlemler gerçekleştirebilir
- Cüzdan adresini görüntüleyebilir

### Freighter Kurulumu

1. [Freighter Cüzdanı](https://www.freighter.app/) tarayıcı eklentisi olarak yükleyin
2. Yeni bir cüzdan oluşturun veya mevcut bir cüzdanı import edin
3. Stellar Testnet'i seçin: `Settings > Network > Testnet`
4. Testnet faucet'ten test tokenları alın: [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)

## Kullanım

1. **Cüzdan Bağlantısı**: Sayfanın üst kısmındaki "Cüzdan Bağla" butonuna tıklayarak Freighter cüzdanınızı bağlayın.
2. **Duygu Seçimi**: Sunulan beş emoji seçeneğinden (😀 Mutlu, 😢 Üzgün, 😍 Aşık, 😠 Sinirli, 🤔 Düşünceli) mevcut duygu durumunuzu en iyi yansıtanı seçin.
3. **Canlı Grafiği Görüntüleme**: Topluluğun duygu durumunu gösteren canlı grafikleri sayfanın orta kısmında görüntüleyebilirsiniz.
4. **Katkıda Bulunma**: "Your Voice Matters" bölümünden kendi duygu durumunuzu ekleyebilirsiniz.

## Geliştirme

### Proje Yapısı

```
mood-pulse-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

### Zustand Store'ları

Uygulama iki ana store kullanır:
- `walletStore.ts`: Freighter cüzdan bağlantısı ve kullanıcı adresini yönetir
- `emojiStore.ts`: Emoji seçimlerini ve istatistiklerini yönetir

## Katkıda Bulunma

Bu projeye katkıda bulunmak istiyorsanız:

1. Projeyi forklayın
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inize push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

Geliştirici: [Batuhan Yükselen](https://github.com/batuyukselen) 