# Mood Pulse App

Mood Pulse App, kullanıcıların duygusal durumlarını emojiler aracılığıyla ifade edebilecekleri ve topluluk içindeki duygu durumlarını gerçek zamanlı olarak görüntüleyebilecekleri bir web uygulamasıdır. Stellar Blockchain ağı üzerinde çalışan bu uygulama, Freighter cüzdan entegrasyonu ile birlikte güvenli bir kullanıcı deneyimi sunmaktadır.


## İçindekiler

- [Özellikler](#özellikler)
- [Demo](#demo)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Freighter Cüzdan Entegrasyonu](#freighter-cüzdan-entegrasyonu)
- [Stellar Kontrat Bilgileri](#stellar-kontrat-bilgileri)
- [Kendi Stellar Kontrat ID'nizi Kullanma](#kendi-stellar-kontrat-idnizi-kullanma)
- [Kullanım](#kullanım)
- [Geliştirme](#geliştirme)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

## Özellikler

- **Freighter Cüzdan Bağlantısı**: Kullanıcılar Stellar Blockchain üzerinde çalışan Freighter cüzdanlarını uygulamaya bağlayabilir.
- **Test Ağı Desteği**: Stellar Testnet ile uyumlu yapılandırma.
- **Duygu Durumu Emojileri**: Kullanıcılar beş farklı emoji arasından seçim yaparak duygusal durumlarını belirtebilir.
- **Canlı Grafik**: Topluluk içindeki duygu durumlarını gerçek zamanlı olarak gösteren grafikler.
- **Blockchain Kayıtları**: Emoji seçimleri Stellar Testnet üzerinde işlem olarak kaydedilir.
- **Responsive Tasarım**: Mobil cihazlar dahil tüm ekran boyutlarına uyumlu tasarım.
- **Modern Hooks API**: React Hooks kullanılarak geliştirilen modern API yapısı.
- **Gelişmiş Hata Yönetimi**: Kullanıcı dostu hata mesajları ve izleme.

## Demo

Uygulamanın canlı demo sürümüne [buradan](https://mood-pulse-app.netlify.app) erişebilirsiniz.

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

4. Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı görüntüleyin.

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

## Stellar Kontrat Bilgileri

Mood Pulse App, emoji seçimlerini ve topluluk verilerini Stellar Testnet üzerinde kaydeder. Bu işlemler şu yöntemlerle gerçekleştirilir:

### İşlem Kayıt Adresi

Uygulamanın kullandığı Stellar adresi:

```
GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA
```

### Stellar Explorer Bağlantıları

- [İşlem kaydı adresini Stellar Explorer'da görüntüle](https://stellar.expert/explorer/testnet/account/GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA)
- [Testnet'teki tüm işlemleri görüntüle](https://testnet.stellar.expert/explorer/public)

### İşlem Detayları

Emoji seçimleri, Stellar işlemleri içinde aşağıdaki şekilde kaydedilir:

1. Kullanıcı bir emoji seçtiğinde, Stellar Testnet üzerinde bir işlem oluşturulur
2. Emoji ve duygu adı, işlem memo'sunda "MoodPulse: [emoji] - [duygu adı]" formatında saklanır
3. Bu işlemler daha sonra topluluk istatistikleri için sorgulanır

## Kendi Stellar Kontrat ID'nizi Kullanma

Uygulamayı kendi Stellar Testnet adresinizle kullanmak için aşağıdaki adımları izleyin:

### Ön Gereksinimler

- [Freighter Wallet](https://www.freighter.app/) tarayıcı uzantısı
- Stellar Testnet'te bir hesap (Testnet XLM bakiyesi olmalı)
- Node.js ve npm kurulu olmalı

### Kurulum Adımları

1. Kolay kurulum için sağlanan yardımcı komut dosyasını kullanın:

```bash
npm run deploy-contract
```

Bu komut, aşağıdaki işlemleri otomatik olarak gerçekleştirecektir:
- Var olan bir Stellar adresini kullanabilir veya yeni bir adres oluşturabilirsiniz
- Kontrat ID'sini güncelleme
- Testnet XLM bakiyenizi kontrol etme
- Hesap oluşturma ve fonlama (gerekirse)
- Uygulamayı başlatma

2. Manuel Güncelleme (Alternatif):

Yardımcı komut çalışmazsa, aşağıdaki dosyayı manuel olarak düzenleyebilirsiniz:

```bash
src/utils/stellarConstants.ts
```

`MOODPULSE_CONTRACT_ID` değişkenini kendi Stellar adresinizle güncelleyin:

```typescript
export const MOODPULSE_CONTRACT_ID = 'KENDI_STELLAR_ADRESINIZ';
```

### Testnet XLM Alma

Hesabınıza Testnet XLM almak için Stellar Testnet Friendbot'u kullanabilirsiniz:

```
https://friendbot.stellar.org/?addr=KENDI_STELLAR_ADRESINIZ
```

## Kullanım

1. **Cüzdan Bağlantısı**: Sayfanın üst kısmındaki "Cüzdan Bağla" butonuna tıklayarak Freighter cüzdanınızı bağlayın.
2. **Duygu Seçimi**: "How are you feeling today?" başlığı altında sunulan emoji seçeneklerinden (😀 Mutlu, 😢 Üzgün, 😍 Aşık, 😠 Sinirli, 🤔 Düşünceli) mevcut duygu durumunuzu en iyi yansıtanı seçin.
3. **Canlı Grafiği Görüntüleme**: Topluluğun duygu durumunu gösteren canlı grafikleri ve istatistikleri sayfada görüntüleyebilirsiniz.
4. **İşlemleri Görüntüleme**: Emoji seçiminizden sonra, işleminiz Stellar Testnet'e kaydedilecek ve işleminize ait bağlantı görüntülenecektir.

## Stellar Testnet Sürümü

Mood Pulse App'in şu anki sürümü, Stellar Testnet ağı üzerinde aktif olarak çalışmaktadır. Uygulama, aşağıdaki Stellar Testnet adresini kullanır:

```
GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA
```

Bu adres, uygulama için özel olarak oluşturulmuş ve Testnet XLM ile fonlanmıştır. Bu adresi [Stellar Expert Explorer](https://stellar.expert/explorer/testnet/account/GAO3FFNMP7VYDBYPOUMMU7URGUM2QGLK5AXYZVEZVATAHPO72SRIKVMA)'da görüntüleyebilirsiniz.

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
│   ├── hooks/         # React hooks
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

### React Hooks

Uygulama, modern bir yapı için özel hooks kullanır:
- `useStellar.ts`: Stellar blockchain entegrasyonu için özel hook

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
