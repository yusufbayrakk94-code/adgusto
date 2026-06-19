import React from 'react';
import { Menu, X } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button onClick={() => onShowPage('landing')} className="text-xl font-extrabold tracking-tight text-slate-950 hover:text-primary transition">
          AdGusto
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          <button onClick={() => onShowPage(routes.features)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            {t('header.features')}
          </button>
          <button onClick={() => onShowPage(routes.about)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            {t('header.about')}
          </button>
          <button onClick={() => onShowPage(routes.pricing)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            {t('header.pricing')}
          </button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {language === 'tr' ? 'EN' : 'TR'}
          </button>
          <button onClick={() => onShowPage('login')} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
            {t('header.signIn')}
          </button>
          <button
            onClick={() => onShowPage('register')}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark"
          >
            {t('header.tryFree')}
          </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100">
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
          <div className="space-y-3">
            <button onClick={() => onShowPage(routes.features)} className="w-full text-left text-sm font-medium text-slate-700 hover:text-slate-950">
              {t('header.features')}
            </button>
            <button onClick={() => onShowPage(routes.about)} className="w-full text-left text-sm font-medium text-slate-700 hover:text-slate-950">
              {t('header.about')}
            </button>
            <button onClick={() => onShowPage(routes.pricing)} className="w-full text-left text-sm font-medium text-slate-700 hover:text-slate-950">
              {t('header.pricing')}
            </button>
            <div className="flex flex-col gap-3 pt-4 border-t border-slate-200">
              <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {language === 'tr' ? 'EN' : 'TR'}
              </button>
              <button onClick={() => onShowPage('login')} className="text-left text-sm font-medium text-slate-700 hover:text-slate-950">
                {t('header.signIn')}
              </button>
              <button onClick={() => onShowPage('register')} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white text-left">
                {t('header.tryFree')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
