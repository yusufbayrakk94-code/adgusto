import React from 'react';
import { ArrowRight, Zap, CheckCircle, Sparkles, Wand2, ImagePlus, LineChart } from 'lucide-react';
import TextType from './TextType';
import SpotlightCard from './SpotlightCard';
import { useLanguage } from '../hooks/useLanguage';
import { translations } from '../i18n/translations';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  onShowPage: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, onShowPage }) => {
  const { language } = useLanguage();
  const routes = translations[language].routes;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button onClick={() => onShowPage('landing')} className="text-xl font-extrabold tracking-tight text-slate-950 hover:text-primary transition">
            AdGusto
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            <button onClick={() => onShowPage(routes.features)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
              Özellikler
            </button>
            <button onClick={() => onShowPage(routes.pricing)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
              Fiyatlandırma
            </button>
            <button onClick={() => onShowPage(routes.about)} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
              Hakkımızda
            </button>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <button onClick={onLogin} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition">
              Giriş Yap
            </button>
            <button onClick={onSignup} className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primaryDark">
              Ücretsiz Dene
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.12),_transparent_25%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.9fr_0.8fr] lg:items-center">
            <div className="max-w-2xl space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Zap className="h-4 w-4" /> ROAS artışı için AI destekli pazarlama
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
                <TextType
                  text={["Daha Hızlı Reklam", "Daha Akıllı Pazarlama", "Daha Net Sonuç"]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseDuration={1700}
                  className="block leading-tight"
                  textColors={["#0f172a", "#0f172a", "#0f172a"]}
                />
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                AdGusto ile yapay zeka destekli pazarlama analizi, reklam metni oluşturma ve görsel üretimi tek panelde yönetin.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={onSignup} className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-slate-900">
                  Hemen Başla <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={onLogin} className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-4 text-base font-semibold text-slate-950 transition hover:bg-slate-100">
                  Giriş Yap
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  500+ mutlu kullanıcı
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">A</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white">B</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">C</span>
                  </div>
                  4.9/5 müşteri puanı
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
              <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Akıllı araçlar</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">Tüm pazarlama ihtiyaçlarınız</h2>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-8 grid gap-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-semibold text-slate-950">Reklam metni oluşturma</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Yapay zeka destekli ilgi çekici metinler ile kampanyalarınızı güçlendirin.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-semibold text-slate-950">Görsel ve video üretimi</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Profesyonel reklam görselleri ve videoları tek tıkla hazırlayın.</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="font-semibold text-slate-950">Veri odaklı analiz</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">Pazarlama stratejinizi gerçek verilerle optimize edin.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">Öne çıkan özellikler</p>
            <h2 className="mt-5 text-4xl font-extrabold text-slate-950">Pazarlama için tek platform</h2>
            <p className="mt-4 text-base leading-7 text-slate-600">AdGusto'nun sunduğu güçlü araçlarla reklam ve analiz iş akışınızı sadeleştirin.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <SpotlightCard spotlightColor="rgba(34,197,94,0.12)">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Wand2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">Hızlı reklam üretimi</h3>
                <p className="text-sm leading-6 text-slate-600">Hızlı bir şekilde reklam metinleri ve içerik fikirleri alın.</p>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(34,197,94,0.12)">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <ImagePlus className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">AI görsel üretimi</h3>
                <p className="text-sm leading-6 text-slate-600">Profesyonel kampanya görselleri oluşturun ve optimize edin.</p>
              </div>
            </SpotlightCard>
            <SpotlightCard spotlightColor="rgba(34,197,94,0.12)">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-950">Performans optimizasyonu</h3>
                <p className="text-sm leading-6 text-slate-600">Kampanyalarınızı veri temelli önerilerle daha etkin yönetin.</p>
              </div>
            </SpotlightCard>
          </div>
        </section>
      </main>
    </div>
  );
};
