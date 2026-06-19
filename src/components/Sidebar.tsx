import React from 'react';
import { ChartBar as BarChart3, MessageSquare, User, LogOut, Home, TrendingUp, Sparkles, Eye, Video, Link2, Search, ChevronLeft } from 'lucide-react';
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
    { id: routes.marketingAnalysis, label: t('nav.marketingAnalysis'), icon: BarChart3 },
    { id: routes.imageGenerator, label: t('nav.imageGenerator'), icon: TrendingUp },
    { id: routes.imageAnalyzer, label: t('nav.imageAnalyzer'), icon: Eye },
    { id: routes.adCopy, label: t('nav.adCopy'), icon: MessageSquare },
    { id: routes.campaignAnalyzer, label: t('nav.campaignAnalyzer'), icon: TrendingUp },
    { id: routes.videoGenerator, label: t('nav.videoGenerator'), icon: Video },
    { id: routes.profile, label: t('nav.profile'), icon: User },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 transition-opacity duration-300 md:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-80 transform overflow-hidden bg-slate-950 text-white transition-all duration-300 shadow-soft md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: collapsed ? '88px' : '320px' }}
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
          <button onClick={() => onNavigate(routes.dashboard)} className="text-lg font-semibold text-white">
            {collapsed ? 'AG' : 'AdGusto'}
          </button>
          <button onClick={onClose} className="md:hidden text-slate-300 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`flex items-center gap-4 rounded-3xl px-4 py-3 text-left transition ${isActive ? 'bg-primary text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Icon className="h-5 w-5" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="mt-auto border-t border-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            {!collapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Hesap</p>
                <p className="truncate text-sm font-medium text-white">{userEmail || 'Anonim'}</p>
              </div>
            )}
            <button onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')} className="rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition">
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
          <button onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-3xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Çıkış Yap'}
          </button>
        </div>
      </aside>
    </>
  );
};
