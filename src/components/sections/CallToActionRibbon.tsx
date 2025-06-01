import React from 'react';
import Button from '../ui/Button';

const CallToActionRibbon: React.FC = () => {
  return (
    <section className="bg-[#5B3DF4] py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl text-white font-heading font-bold mb-6">
          Hemen dene, duygunu paylaş!
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto mb-8">
          Mood Pulse Board ile topluluğunun duygusal nabzını gerçek zamanlı olarak görselleştir. Tamamen ücretsiz ve kolay kullanım.
        </p>
        <Button 
          href="https://app.moodpulseboard.xyz"
          variant="white"
          className="px-8 py-3 text-lg"
        >
          Demo Uygulamayı Aç
        </Button>
      </div>
    </section>
  );
};

export default CallToActionRibbon;