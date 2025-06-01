import React from 'react';
import { Wallet, ThumbsUp, BarChart2 } from 'lucide-react';

const steps = [
  {
    icon: <Wallet className="w-10 h-10 text-[#5B3DF4]" />,
    title: "Cüzdanınızı Bağlayın",
    description: "Freighter veya MetaMask gibi bir Web3 cüzdanı ile bağlanın. Hiçbir token transferi yapılmaz."
  },
  {
    icon: <ThumbsUp className="w-10 h-10 text-[#FFB400]" />,
    title: "Emojinizi Seçin",
    description: "Beş emojiden ruh halinizi en iyi yansıtanı seçin ve oyunuzu kullanın."
  },
  {
    icon: <BarChart2 className="w-10 h-10 text-[#19C37D]" />,
    title: "Etkiyi Görün",
    description: "Seçiminiz blokzincire bir olay olarak yazılır ve canlı grafiğe yansır."
  }
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works\" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mood Pulse Board basit bir kullanıcı deneyimi ile blokzincir teknolojisinin gücünü birleştirir.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">
                {index + 1}. {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-2xl mx-auto">
            <strong>Not:</strong> Hiçbir kişisel veri veya token transferi yapılmaz. Sadece cüzdan adresiniz ve seçtiğiniz emoji kaydedilir.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;