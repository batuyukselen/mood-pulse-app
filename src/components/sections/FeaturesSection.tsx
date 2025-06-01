import React from 'react';

const features = [
  {
    icon: "🙂",
    title: "Anonim & Güvenli",
    description: "Sadece public adres kaydedilir; kazanç, ödül, spam yok."
  },
  {
    icon: "⚡",
    title: "Gerçek Zamanlı",
    description: "WebSocket + Event indeksleyici ile 2 sn'den kısa gecikme."
  },
  {
    icon: "📊",
    title: "Canlı İstatistikler",
    description: "Toplam oy, en popüler emoji ve zaman akışı grafikleri."
  },
  {
    icon: "🔄",
    title: "Kolay Entegrasyon",
    description: "Her türlü etkinlik veya topluluk için embed edilebilir widget'lar."
  },
  {
    icon: "🌐",
    title: "Çoklu Blockchain Desteği",
    description: "Stellar, Polygon veya diğer EVM uyumlu zincirlerde çalışabilir."
  },
  {
    icon: "🎨",
    title: "Özelleştirilebilir",
    description: "Kendi emoji setinizi ve tema renklerinizi kullanabilirsiniz."
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Özellikler
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mood Pulse Board'un sağladığı temel özellikler ve avantajlar
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:border-[#5B3DF4]/20 hover:shadow-md transition-all"
            >
              <div className="text-4xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;