import React from 'react';
import Header from './components/layout/Header';
import HeroSection from './components/sections/HeroSection';
import LiveChartSection from './components/sections/LiveChartSection';
import HowItWorksSection from './components/sections/HowItWorksSection';
import FeaturesSection from './components/sections/FeaturesSection';
import FAQSection from './components/sections/FAQSection';
import RoadmapSection from './components/sections/RoadmapSection';
import CallToActionRibbon from './components/sections/CallToActionRibbon';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#0E0F1A] font-body">
      <Header />
      <main>
        <HeroSection />
        <LiveChartSection />
        <HowItWorksSection />
        <FeaturesSection />
        <FAQSection />
        <RoadmapSection />
        <CallToActionRibbon />
      </main>
      <Footer />
    </div>
  );
}

export default App;