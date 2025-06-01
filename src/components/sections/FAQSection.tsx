import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Bu uygulama ücretli mi?",
    answer: "Hayır, tamamen ücretsiz ve açık kaynak. Kaynak kodu GitHub'da mevcuttur ve kendi projenizde kullanabilirsiniz."
  },
  {
    question: "Hangi blokzinciri kullanıyorsunuz?",
    answer: "Testnet'te Soroban; mainnet'te Stellar veya Polygon seçeneği sunuyoruz. Uygulamanın yapısı farklı blokzincirlere kolayca adapte edilebilir."
  },
  {
    question: "Verilerim güvende mi?",
    answer: "Evet, yalnızca işlem hash'i ve seçtiğiniz emoji saklanır. Kişisel bilgiler veya özel anahtarlar asla depolanmaz veya paylaşılmaz."
  },
  {
    question: "Oy kullanmak için gas ücreti ödemem gerekiyor mu?",
    answer: "Hayır, uygulama gas ücretlerini minimize edecek şekilde tasarlanmıştır. Bazı zincirlerde hiç gas ücreti ödemeniz gerekmeyebilir."
  },
  {
    question: "Uygulamayı kendi etkinliğimde kullanabilir miyim?",
    answer: "Evet, Mood Pulse Board herhangi bir etkinlik veya topluluk için özelleştirilebilir. Embedding kodu ve API erişimi sağlıyoruz."
  },
  {
    question: "Mobil cihazlarda çalışıyor mu?",
    answer: "Evet, uygulama tamamen responsive olarak tasarlanmıştır. Mobil cihazlarda Web3 cüzdanınızı bağlayıp oy kullanabilirsiniz."
  }
];

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section id="faq" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Mood Pulse Board hakkında en çok sorulan sorular ve cevaplar
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="mb-4 bg-white rounded-lg overflow-hidden shadow-sm"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg font-medium">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#5B3DF4]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;