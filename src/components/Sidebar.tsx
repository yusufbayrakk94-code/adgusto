import React from 'react';
import { ChartBar as BarChart3, MessageSquare, User, LogOut, Hop as Home, TrendingUp, Sparkles, ChartLine as LineChart, Video, Link2, Search, Bookmark, ChevronLeft, ChevronRight, Languages, Facebook } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userEmail?: string;
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onLogout,
  userEmail,
  open = true,
  onClose,
  collapsed = false,
  onToggleCollapse
}) => {
  const { language, setLanguage, t } = useLanguage();
  const routes = translations[language].routes;

  const menuItems = [
    { id: routes.dashboard, label: t('nav.dashboard'), icon: Home },
    { id: routes.googleAds, label: t('nav.googleAds'), icon: Link2 },
    { id: routes.metaAds, label: t('nav.metaAds'), icon: Search },
    { id: 'meta-ads-manager', label: 'Meta Reklam Yönetimi', icon: Facebook },
    { id: routes.marketingAnalysis, label: t('nav.marketingAnalysis'), icon: BarChart3 },
    { id: routes.imageGenerator, label: t('nav.imageGenerator'), icon: TrendingUp },
    { id: routes.imageAnalyzer, label: t('nav.imageAnalyzer'), icon: Sparkles },
    { id: routes.adCopy, label: t('nav.adCopy'), icon: MessageSquare },
    { id: routes.campaignAnalyzer, label: t('nav.campaignAnalyzer'), icon: TrendingUp },
    { id: routes.videoGenerator, label: t('nav.videoGenerator'), icon: Video },
    { id: routes.profile, label: t('nav.profile'), icon: User },
  ];

  const comingSoonItems = [
    { id: 'ad-management', label: t('dashboard.adManagement.title'), icon: LineChart },
  ];

  // Mobilde sidebar kapalıysa hiç render etme
  // md ve üstü için her zaman açık, mobilde open true ise göster
  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <div
        className={`fixed top-0 left-0 z-50 bg-dark text-white h-screen flex flex-col transform transition-all duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:static md:translate-x-0 md:flex`}
        style={{ width: collapsed ? '80px' : '256px', minWidth: collapsed ? '80px' : '256px' }}
      >
        {/* Logo ve Kapat */}
        <div className="p-6 border-b border-primary/20 flex items-center justify-between">
          {!collapsed ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-2xl font-light text-primary hover:text-secondary transition-colors"
              >
                AdGusto
              </button>
              {/* Mobilde kapat butonu */}
              <button
                className="md:hidden text-white hover:text-primary p-1 ml-2"
                onClick={onClose}
                aria-label="Menüyü Kapat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('dashboard')}
              className="text-xl font-bold text-primary hover:text-secondary transition-colors mx-auto"
            >
              AG
            </button>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center py-3 text-white/60 hover:text-white hover:bg-white/10 transition-all border-b border-primary/20"
            aria-label={collapsed ? 'Menüyü Genişlet' : 'Menüyü Daralt'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-dark shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Coming Soon Section */}
          {!collapsed && (
            <div className="mt-8 pt-6 border-t border-primary/20">
              <div className="px-4 mb-3">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('dashboard.comingSoon')}</span>
              </div>
              <div className="space-y-2">
                {comingSoonItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all opacity-60 hover:opacity-80"
                    >
                      <Icon className="w-5 h-5 text-white/60" />
                      <span className="font-medium text-white/60">{item.label}</span>
                      <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">Demo</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-primary/20">
          {!collapsed && (
            <>
              <div className="mb-4">
                <p className="text-sm text-white/60">{language === 'tr' ? 'Giriş yapan:' : 'Logged in as:'}</p>
                <p className="text-sm text-white font-medium truncate">{userEmail}</p>
              </div>
              <div className="mb-4 flex gap-2">
                <button
                  onClick={() => setLanguage('tr')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    language === 'tr'
                      ? 'bg-primary text-dark shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="Türkçe"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm font-medium">TR</span>
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    language === 'en'
                      ? 'bg-primary text-dark shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title="English"
                >
                  <Languages className="w-4 h-4" />
                  <span className="text-sm font-medium">EN</span>
                </button>
              </div>
            </>
          )}
          {collapsed && (
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="w-full flex items-center justify-center px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all mb-2"
              title={language === 'tr' ? 'Switch to English' : 'Türkçeye geç'}
            >
              <Languages className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all`}
            title={collapsed ? t('nav.logout') : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{t('nav.logout')}</span>}
          </button>
        </div>
      </div>
    </>
  );
};