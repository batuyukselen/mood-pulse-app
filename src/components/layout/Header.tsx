import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import WalletConnect from '../ui/WalletConnect';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-heading font-bold text-[#5B3DF4]">
            Mood Pulse Board
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#chart" className="font-medium hover:text-[#5B3DF4] transition-colors">
            Live Chart
          </a>
          <a href="#how-it-works" className="font-medium hover:text-[#5B3DF4] transition-colors">
            How It Works
          </a>
          <a href="#features" className="font-medium hover:text-[#5B3DF4] transition-colors">
            Features
          </a>
          <a href="#faq" className="font-medium hover:text-[#5B3DF4] transition-colors">
            FAQ
          </a>
          <WalletConnect />
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#0E0F1A]"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a 
              href="#chart" 
              className="font-medium py-2 hover:text-[#5B3DF4] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Live Chart
            </a>
            <a 
              href="#how-it-works" 
              className="font-medium py-2 hover:text-[#5B3DF4] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#features" 
              className="font-medium py-2 hover:text-[#5B3DF4] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#faq" 
              className="font-medium py-2 hover:text-[#5B3DF4] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <div className="pt-2">
              <WalletConnect isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;