import React, { useEffect, useRef } from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import { Sparkles, Target, Users, Zap, TrendingUp, Shield, Heart } from 'lucide-react';
import GradualBlur from './GradualBlur';

interface AboutPageProps {
  onShowPage: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onShowPage }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main>
        {/* Hero Section */}
        <section
          ref={heroRef}
          style={{ position: 'relative', minHeight: '60vh', overflow: 'hidden' }}
          className="flex items-center justify-center px-6 py-24 lg:py-32 bg-gradient-to-br from-white to-primary/10"
        >
          <div className="relative z-10 max-w-5xl mx-auto text-center opacity-0 translate-y-8 transition-all duration-1000" style={{ animation: 'fadeInUp 1s ease-out forwards' }}>
            <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-5 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-dark" />
              <span className="text-dark font-bold text-xs">YAPay Zeka Destekli Pazarlama</span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-light text-dark mb-8 tracking-tight leading-tight">
              Dijital Pazarlamanın<br />Geleceğini Şekillendiriyoruz
            </h1>

            <p className="text-xl lg:text-2xl text-gray max-w-3xl mx-auto mb-12 leading-relaxed">
              AdGusto, işletmelerin dijital pazarlama süreçlerini <span className="font-semibold text-dark">Yapay Zeka</span> ile dönüştüren yenilikçi bir platformdur. Veriyi aksiyona, içgörüyü başarıya dönüştürüyoruz.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>50+ İşletme</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>10.000+ Analiz</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>%95 Memnuniyet</span>
              </div>
            </div>
          </div>

          <GradualBlur
            target="parent"
            position="bottom"
            height="8rem"
            strength={3}
            divCount={6}
            curve="bezier"
            exponential={true}
            opacity={1}
          />
        </section>

        {/* Mission Section */}
        <section className="px-6 py-20 max-w-6xl mx-auto">
          <div className="bg-white border border-primary/20 rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center shadow-xl transform hover:rotate-6 transition-transform duration-300">
                  <Target className="w-10 h-10 text-dark" />
                </div>
              </div>

              <div className="text-center mb-6">
                <span className="inline-block bg-dark text-primary text-xs font-bold rounded-full px-4 py-2 mb-4 shadow-md">
                  MİSYON
                </span>
                <h2 className="text-4xl lg:text-5xl font-light text-dark">
                  Misyonumuz
                </h2>
              </div>

              <p className="text-gray text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto text-center">
                Her büyüklükteki işletmenin, karmaşık dijital pazarlama dünyasında başarılı olabilmesi için <span className="font-semibold text-dark">Yapay Zeka destekli</span>, kullanımı kolay ve etkili araçlar sunmak. Pazarlama süreçlerini basitleştirerek, işletmelerin büyüme hedeflerine odaklanmalarını sağlıyoruz.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="px-6 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-light text-dark mb-4">
              Değerlerimiz
            </h2>
            <p className="text-gray text-lg max-w-2xl mx-auto">
              Bizi farklı kılan ve her gün ilerlememizi sağlayan temel prensipler
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'İnovasyon',
                badge: 'İNOVASYON',
                description: 'En son teknolojileri kullanarak pazarlama dünyasında yenilik yaratıyoruz.'
              },
              {
                icon: Users,
                title: 'Müşteri Odaklılık',
                badge: 'MÜŞTERİ',
                description: 'Müşterilerimizin başarısı bizim başarımızdır. Her çözümümüzü onların ihtiyaçları doğrultusunda geliştiriyoruz.'
              },
              {
                icon: Heart,
                title: 'Sadelik',
                badge: 'SADELİK',
                description: 'Karmaşık süreçleri basit ve anlaşılır hale getirerek, herkesin kolayca kullanabileceği çözümler sunuyoruz.'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary/20"
              >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-dark" />
                </div>

                <span className="inline-block bg-primary text-dark text-xs font-bold rounded-full px-3 py-1.5 mb-3 shadow-md">
                  {value.badge}
                </span>

                <h3 className="text-xl font-medium text-dark mb-3">
                  {value.title}
                </h3>

                <p className="text-gray leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="px-6 py-20 bg-dark text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQyYzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Users, value: '50+', label: 'Aktif İşletme' },
                { icon: TrendingUp, value: '10K+', label: 'Yapılan Analiz' },
                { icon: Shield, value: '%95', label: 'Memnuniyet Oranı' },
                { icon: Sparkles, value: '7/24', label: 'Destek Hizmeti' }
              ].map((stat, index) => (
                <div key={index} className="opacity-0" style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.1}s forwards` }}>
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 backdrop-blur-sm rounded-2xl mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-5xl font-light mb-2">{stat.value}</div>
                  <div className="text-white/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section style={{ position: 'relative', overflow: 'hidden' }} className="px-6 py-24 bg-white">
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div className="max-w-5xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-3xl p-12 lg:p-16 shadow-2xl">
                <div className="text-center mb-12">
                  <h2 className="text-4xl lg:text-5xl font-light text-dark mb-4">
                    Hikayemiz
                  </h2>
                  <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
                </div>

                <div className="space-y-8 text-gray text-lg leading-relaxed">
                  <p className="text-xl">
                    AdGusto, dijital pazarlama dünyasındaki karmaşıklığı fark ettiğimiz andan itibaren doğdu.
                    Küçük ve orta ölçekli işletmelerin, büyük şirketlerin sahip olduğu pazarlama kaynaklarına
                    erişememesi bizi harekete geçirdi.
                  </p>

                  <p>
                    <span className="font-semibold text-dark">2024 yılında kurulan AdGusto</span>, teknolojinin gücünü kullanarak, her işletmenin
                    profesyonel düzeyde pazarlama stratejileri geliştirebilmesini hedefliyor. Amacımız,
                    pazarlama uzmanlığını demokratikleştirmek ve başarıyı herkese ulaşılabilir kılmak.
                  </p>

                  <p>
                    Bugün, <span className="font-semibold text-dark">50'den fazla farklı sektörden</span> işletmeye hizmet veriyor, onların dijital pazarlama
                    süreçlerini optimize ediyor ve büyüme hedeflerine ulaşmalarına yardımcı oluyoruz.
                  </p>

                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-10 h-10 rounded-full bg-primary border-2 border-white"></div>
                        ))}
                      </div>
                      <p className="text-gray font-medium">
                        50+ mutlu müşterimize katılın
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GradualBlur
            target="parent"
            position="bottom"
            height="6rem"
            strength={2}
            divCount={5}
            curve="bezier"
            exponential={true}
            opacity={1}
          />
        </section>
      </main>

      <Footer onShowPage={onShowPage} />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-in {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
