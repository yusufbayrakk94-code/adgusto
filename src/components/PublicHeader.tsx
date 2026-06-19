import React from 'react';
import { Menu, X, Languages } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface PublicHeaderProps {
  onShowPage: (page: string) => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onShowPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();
  const routes = translations[language].routes;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onShowPage('landing')}>
            <span className="text-2xl font-light text-dark hover:text-primary transition-colors">AdGusto</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => onShowPage(routes.features)} className="text-gray hover:text-dark transition-colors font-medium">{t('header.features')}</button>
            <button onClick={() => onShowPage(routes.about)} className="text-gray hover:text-dark transition-colors font-medium">{t('header.about')}</button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex gap-2 mr-2">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'tr'
                    ? 'bg-primary text-dark shadow-sm'
                    : 'text-gray hover:text-dark hover:bg-gray-100'
                }`}
                title="Türkçe"
              >
                <span className="text-sm font-medium">TR</span>
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-primary text-dark shadow-sm'
                    : 'text-gray hover:text-dark hover:bg-gray-100'
                }`}
                title="English"
              >
                <span className="text-sm font-medium">EN</span>
              </button>
            </div>
            <button
              onClick={() => onShowPage('login')}
              className="px-4 py-2 text-gray hover:text-dark transition-colors font-medium"
            >
              {t('header.signIn')}
            </button>
            <button
              onClick={() => onShowPage('register')}
              className="px-6 py-3 bg-primary text-dark rounded-xl hover:bg-secondary transition-all duration-200 font-medium shadow-sm hover:shadow-lg hover:-translate-y-1"
            >
              {t('header.tryFree')}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray hover:text-dark transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <nav className="flex flex-col space-y-3">
              <button onClick={() => onShowPage(routes.features)} className="w-full text-left text-gray hover:text-dark transition-colors font-medium py-3 px-2 rounded-lg">{t('header.features')}</button>
              <button onClick={() => onShowPage(routes.about)} className="w-full text-left text-gray hover:text-dark transition-colors font-medium py-3 px-2 rounded-lg">{t('header.about')}</button>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                <div className="flex gap-2 px-2">
                  <button
                    onClick={() => setLanguage('tr')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                      language === 'tr'
                        ? 'bg-primary text-dark shadow-sm'
                        : 'text-gray hover:text-dark hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium">TR</span>
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all ${
                      language === 'en'
                        ? 'bg-primary text-dark shadow-sm'
                        : 'text-gray hover:text-dark hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-sm font-medium">EN</span>
                  </button>
                </div>
                <button
                  onClick={() => onShowPage('login')}
                  className="w-full text-left text-gray hover:text-dark transition-colors font-medium py-3 px-2 rounded-lg"
                >
                  {t('header.signIn')}
                </button>
                <button
                  onClick={() => onShowPage('register')}
                  className="w-full px-6 py-3 bg-primary text-dark rounded-xl hover:bg-secondary transition-all duration-200 font-medium text-center"
                >
                  {t('header.tryFree')}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
