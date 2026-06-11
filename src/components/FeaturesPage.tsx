import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  PieChart,
  MessageSquare,
  Image as ImageIcon,
  FileBarChart,
  Brain,
  Rocket,
  Shield,
  Clock,
  DollarSign,
  Users,
  ArrowRight,
  LineChart,
  Video
} from 'lucide-react';

interface FeaturesPageProps {
  onShowPage: (page: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({
  onShowPage,
}) => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'Yapay Zeka Destekli Analiz',
      description: 'İleri seviye AI algoritmaları ile pazarlama stratejilerinizi optimize edin',
      color: 'from-primary/20 to-secondary/20',
      iconColor: 'text-primary',
      badge: 'AI'
    },
    {
      icon: MessageSquare,
      title: 'Akıllı Reklam Metni Oluşturucu',
      description: 'Platformlara özel, dönüşüm odaklı reklam metinleri anında oluşturun',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-600',
      badge: 'POPÜLER'
    },
    {
      icon: ImageIcon,
      title: 'Görsel Oluşturucu & Analiz',
      description: 'AI ile profesyonel reklam görselleri oluşturun ve mevcut görsellerinizi analiz edin',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-600',
      badge: 'YENİ'
    },
    {
      icon: FileBarChart,
      title: 'CSV Kampanya Analizi',
      description: 'Kampanya verilerinizi yükleyin, detaylı raporlar ve öneriler alın',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-600',
      badge: 'PRO'
    },
    {
      icon: Target,
      title: 'Hedef Kitle Segmentasyonu',
      description: 'Doğru kişilere ulaşmak için gelişmiş hedefleme stratejileri',
      color: 'from-orange-500/20 to-amber-500/20',
      iconColor: 'text-orange-600',
      badge: 'GÜÇLÜ'
    },
    {
      icon: PieChart,
      title: 'Detaylı Performans Raporu',
      description: 'Tüm kampanyalarınızı tek panelden takip edin ve optimize edin',
      color: 'from-indigo-500/20 to-blue-500/20',
      iconColor: 'text-indigo-600',
      badge: 'KAPSAMLI'
    },
    {
      icon: LineChart,
      title: 'Reklam Yönetimi',
      description: 'Tüm reklam kampanyalarınızı tek yerden yönetin, performansları takip edin',
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-600',
      badge: 'YAKINDA'
    },
    {
      icon: Video,
      title: 'Reklam Videosu Oluşturucu',
      description: 'AI destekli video oluşturma aracı ile profesyonel reklam videoları üretin',
      color: 'from-red-500/20 to-pink-500/20',
      iconColor: 'text-red-600',
      badge: 'YAKINDA'
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: '10x Daha Hızlı',
      description: 'Günlerce süren araştırma ve analiz işlemlerini dakikalara indirin'
    },
    {
      icon: DollarSign,
      title: '%40 Daha Az Maliyet',
      description: 'Optimizasyon önerileri ile reklam harcamalarınızı azaltın'
    },
    {
      icon: TrendingUp,
      title: '%60 Daha Yüksek ROI',
      description: 'Data-driven stratejilerle yatırım getirinizi maksimize edin'
    },
    {
      icon: Shield,
      title: 'Güvenli & Gizli',
      description: 'Verileriniz şifrelenir ve asla üçüncü taraflarla paylaşılmaz'
    }
  ];

  const platforms = [
    { emoji: '📘', name: 'Meta (Facebook/Instagram)', desc: 'Geniş kitle erişimi ve detaylı hedefleme' },
    { emoji: '🔍', name: 'Google Ads', desc: 'Arama ve görüntülü reklamlarla yüksek görünürlük' },
    { emoji: '💼', name: 'LinkedIn', desc: 'B2B pazarlama ve profesyonel hedefleme' },
    { emoji: '🎵', name: 'TikTok', desc: 'Yaratıcı içeriklerle genç kitlelere ulaşın' },
    { emoji: '📺', name: 'YouTube', desc: 'Video reklamları ile etkileyici hikayeler' },
    { emoji: '🌐', name: 'Diğer Platformlar', desc: 'Twitter, Snapchat ve daha fazlası' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary/5 to-secondary/10 text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-6 py-2 mb-6 animate-pulse">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-dark">Tüm Özellikler</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-dark mb-6 leading-tight">
              Pazarlama Başarınızı
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                10 Kat Artırın
              </span>
            </h1>
            <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
              AdGusto'nun güçlü AI özellikleri ile kampanyalarınızı optimize edin,
              bütçenizi verimli kullanın ve hedeflerinize daha hızlı ulaşın
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-primary hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-dark text-primary text-xs font-bold px-3 py-1 rounded-full">
                  {feature.badge}
                </div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-dark mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-2">
                    <span className="text-sm font-bold mr-2">Keşfet</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Section */}
          <div className="bg-gradient-to-br from-dark to-dark/90 rounded-3xl p-12 mb-20 relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 text-center">
                Kanıtlanmış Sonuçlar
              </h2>
              <p className="text-secondary text-center mb-12 text-lg">
                Binlerce şirket AdGusto ile başarılarını katladı
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="text-center group cursor-pointer"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.15}s backwards`
                    }}
                  >
                    <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/30 group-hover:scale-110 transition-all duration-300">
                      <benefit.icon className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-2 group-hover:scale-110 transition-transform">
                      {benefit.title}
                    </h3>
                    <p className="text-secondary leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Desteklenen Platformlar
              </h2>
              <p className="text-gray text-lg">
                Tüm büyük reklam platformları için optimize edilmiş stratejiler
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platforms.map((platform, index) => (
                <div
                  key={index}
                  className="group bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-primary hover:shadow-xl transition-all duration-300 cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                  }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {platform.emoji}
                  </div>
                  <h3 className="font-bold text-dark text-lg mb-2 group-hover:text-primary transition-colors">
                    {platform.name}
                  </h3>
                  <p className="text-gray text-sm leading-relaxed">
                    {platform.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

            <div className="relative z-10">
              <Rocket className="w-16 h-16 text-dark mx-auto mb-6 animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
                Hemen Başlayın!
              </h2>
              <p className="text-dark/80 text-lg mb-8 max-w-2xl mx-auto">
                Ücretsiz hesap oluşturun ve tüm özellikleri keşfedin. Kredi kartı gerekmez.
              </p>
              <button
                onClick={() => onShowPage('auth')}
                className="inline-flex items-center gap-3 bg-dark text-primary px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <Users className="w-6 h-6" />
                Ücretsiz Hesap Oluştur
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
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
      `}</style>
    </div>
  );
};
