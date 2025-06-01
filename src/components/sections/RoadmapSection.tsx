import React from 'react';

const milestones = [
  {
    version: "v0.1",
    title: "Hackathon MVP",
    description: "Temel oylama ve grafik özellikleri ile minimum uygulanabilir ürün.",
    isCompleted: true
  },
  {
    version: "v0.2",
    title: "Özel emoji seti & karanlık tema",
    description: "Kullanıcı deneyimini artırmak için daha fazla özelleştirme seçeneği.",
    isCompleted: false,
    isCurrent: true
  },
  {
    version: "v0.5",
    title: "Çoklu zincir desteği",
    description: "Stellar, Polygon ve diğer EVM uyumlu zincirler için destek.",
    isCompleted: false
  },
  {
    version: "v1.0",
    title: "DAO entegrasyonu & mobil PWA",
    description: "Topluluk yönetimi ve daha iyi mobil deneyim.",
    isCompleted: false
  }
];

const RoadmapSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Yol Haritası
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mood Pulse Board'un gelecek planları ve geliştirme aşamaları
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 transform md:translate-x-px"></div>
            
            {/* Timeline Items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative ${
                  index % 2 === 0 ? 'md:pr-12 md:text-right md:ml-auto md:mr-0' : 'md:pl-12'
                } md:w-1/2`}>
                  {/* Timeline dot */}
                  <div className={`absolute left-0 md:left-auto md:right-0 top-0 w-4 h-4 rounded-full transform md:translate-x-2 ${
                    milestone.isCompleted 
                      ? 'bg-[#19C37D]' 
                      : milestone.isCurrent 
                        ? 'bg-[#FFB400]' 
                        : 'bg-gray-300'
                  } ${index % 2 === 0 ? 'md:-translate-x-2' : 'md:translate-x-2'}`}></div>
                  
                  {/* Content */}
                  <div className={`pl-8 md:pl-0 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium bg-[#5B3DF4]/10 text-[#5B3DF4] py-1 px-2 rounded">
                          {milestone.version}
                        </span>
                        {milestone.isCompleted && (
                          <span className="text-xs font-medium bg-[#19C37D]/10 text-[#19C37D] py-1 px-2 rounded">
                            Tamamlandı
                          </span>
                        )}
                        {milestone.isCurrent && (
                          <span className="text-xs font-medium bg-[#FFB400]/10 text-[#FFB400] py-1 px-2 rounded">
                            Geliştiriliyor
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-heading font-bold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;