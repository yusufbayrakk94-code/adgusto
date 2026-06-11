import React from 'react';

interface FooterProps {
  onShowPage?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onShowPage }) => (
  <footer className="px-6 py-20 bg-white border-t border-gray-200">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() => onShowPage && onShowPage('landing')}>
            <span className="text-2xl font-light text-dark hover:text-primary transition-colors">AdGusto</span>
          </div>
          <p className="text-gray leading-relaxed mb-6">
            Yapay Zeka destekli pazarlama analizi ile işletmenizi büyütün
          </p>
        </div>
        <div>
          <h4 className="font-bold text-dark mb-6">Ürün</h4>
          <ul className="space-y-3">
            <li><button onClick={() => onShowPage && onShowPage('features')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">Özellikler</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-dark mb-6">Şirket</h4>
          <ul className="space-y-3">
            <li><button onClick={() => onShowPage && onShowPage('about')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">Hakkımızda</button></li>
            <li><button onClick={() => onShowPage && onShowPage('contact')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">İletişim</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-dark mb-6">Kaynaklar</h4>
          <ul className="space-y-3">
            <li><button onClick={() => onShowPage && onShowPage('documentation')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">Dokümantasyon</button></li>
            <li><button onClick={() => onShowPage && onShowPage('privacy-policy')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">Gizlilik Politikası</button></li>
            <li><button onClick={() => onShowPage && onShowPage('terms')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block font-medium">Kullanım Koşulları</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-8 text-center">
        <p className="text-gray text-sm">
          © 2025 AdGusto. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  </footer>
);
