import React from 'react';
import { Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0E0F1A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1: Logo & Tagline */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-white mb-4">
              Mood Pulse Board
            </h2>
            <p className="text-gray-300 mb-6 max-w-xs">
              Topluluğun duygu nabzını anında görün. Web3 teknolojisiyle desteklenen emoji temelli geri bildirim sistemi.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/moodpulseboard" className="text-gray-300 hover:text-[#FFB400] transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://discord.gg/moodpulseboard" className="text-gray-300 hover:text-[#FFB400] transition-colors" aria-label="Discord">
                <MessageSquare size={20} />
              </a>
              <a href="https://linkedin.com/company/moodpulseboard" className="text-gray-300 hover:text-[#FFB400] transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/moodpulseboard" className="text-gray-300 hover:text-[#FFB400] transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://app.moodpulseboard.xyz" className="text-gray-300 hover:text-white transition-colors">
                  Demo Uygulama
                </a>
              </li>
              <li>
                <a href="https://github.com/moodpulseboard" className="text-gray-300 hover:text-white transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="/docs" className="text-gray-300 hover:text-white transition-colors">
                  Belgeler
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  İletişim
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="text-lg font-heading font-bold mb-4">Haberdar Ol</h3>
            <p className="text-gray-300 mb-4">
              Güncellemeler ve yeni özellikler hakkında bilgi almak için abone olun.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#5B3DF4] w-full"
                required
              />
              <button
                type="submit"
                className="bg-[#5B3DF4] px-4 py-2 rounded-r-md hover:bg-opacity-90 transition-colors"
              >
                Abone Ol
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Mood Pulse Board. Tüm hakları saklıdır.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 text-sm hover:text-white transition-colors">
              Gizlilik Politikası
            </a>
            <a href="/terms" className="text-gray-400 text-sm hover:text-white transition-colors">
              Kullanım Koşulları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;