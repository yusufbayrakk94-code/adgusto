import React, { useState } from 'react';
import { ArrowLeft, Check, X, Zap, Sparkles, TrendingUp, Users, Building2, ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { PublicHeader } from './PublicHeader';

interface PricingPageProps {
  onGoHome: () => void;
  onShowPage?: (page: string) => void;
  onLogout?: () => void;
  userEmail?: string;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  onGoHome,
  onShowPage,
  onLogout,
  userEmail
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: 'Free',
      tagline: '14 gün boyunca ücretsiz dene',
      price: 0,
      yearlyPrice: 0,
      icon: Sparkles,
      features: [
        { text: '10 Pazarlama analizi / ay', included: true },
        { text: '20 AI reklam metni / ay', included: true },
        { text: 'Temel reklam görselleri', included: true },
        { text: 'CSV kampanya analizi', included: true },
        { text: 'Topluluk desteği', included: true },
        { text: 'Öncelikli destek', included: false },
        { text: 'Video içerik üretimi', included: false },
        { text: 'API erişimi', included: false },
      ],
      cta: 'Ücretsiz Başla',
      highlighted: false,
    },
    {
      name: 'Premium',
      tagline: 'Küçük işletmeler için',
      price: 5000,
      yearlyPrice: 50000,
      icon: TrendingUp,
      features: [
        { text: 'Sınırsız pazarlama analizi', included: true },
        { text: 'Sınırsız AI reklam metni', included: true },
        { text: 'Gelişmiş reklam görselleri', included: true },
        { text: 'Gelişmiş kampanya analizi', included: true },
        { text: 'Öncelikli e-posta desteği', included: true },
        { text: 'Video içerik üretimi (Beta)', included: true },
        { text: 'Rekabet analizi', included: true },
        { text: 'API erişimi', included: false },
      ],
      cta: 'Hemen Yükselt',
      highlighted: false,
    },
    {
      name: 'Pro',
      tagline: 'KOBİ çözümü',
      price: 12500,
      yearlyPrice: 125000,
      icon: Building2,
      features: [
        { text: 'Sınırsız pazarlama analizi', included: true },
        { text: 'Sınırsız AI reklam metni', included: true },
        { text: 'Premium görsel & video üretimi', included: true },
        { text: 'Sınırsız kampanya analizi', included: true },
        { text: '7/24 öncelikli destek', included: true },
        { text: 'Video içerik üretimi', included: true },
        { text: 'API erişimi & Entegrasyonlar', included: true },
        { text: 'Özel raporlama & Analytics', included: true },
        { text: 'Beyaz etiket çözümü', included: true },
        { text: 'Özel eğitim', included: true },
      ],
      cta: 'Satış ile İletişime Geç',
      highlighted: true,
      badge: 'En Popüler',
    },
  ];

  const faqs = [
    {
      q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      a: 'Kredi kartı, banka kartı ve havale ile ödeme kabul ediyoruz. Tüm ödemeler güvenli SSL şifrelemesi ile korunmaktadır.'
    },
    {
      q: 'Plan değiştirebilir miyim?',
      a: 'Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Plan yükseltmelerinde kalan süreniz yeni plana aktarılır.'
    },
    {
      q: 'İptal politikanız nedir?',
      a: 'Planınızı istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar tüm özellikleri kullanmaya devam edebilirsiniz. Para iadesi ilk 14 gün içinde geçerlidir.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header */}
      {onShowPage && <PublicHeader onShowPage={onShowPage} />}

      <main>
        {/* Hero Section */}
        <section className="px-6 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-6 py-3 mb-8">
                <Zap className="w-5 h-5 text-dark" />
                <span className="text-dark font-medium">Fiyatlandırma</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-light text-dark mb-6 leading-tight tracking-tight">
                Yapay Zeka ile Reklamlarınızı <span className="text-primary font-medium">Güçlendirin</span>
              </h1>
              <p className="text-xl text-gray leading-relaxed">
                İşletmeniz için en uygun planı seçin ve AI destekli pazarlama ile performansınızı artırın
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-16">
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-dark' : 'text-gray'}`}>
                Aylık
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-16 h-8 bg-gray-200 rounded-full transition-colors hover:bg-gray-300"
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-primary rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              <span className={`text-sm font-medium transition-colors ${billingCycle === 'yearly' ? 'text-dark' : 'text-gray'}`}>
                Yıllık
              </span>
              <span className="inline-flex items-center bg-primary/20 text-dark text-xs font-bold px-3 py-1 rounded-full">
                2 AY ÜCRETSİZ
              </span>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative bg-white rounded-3xl p-8 transition-all duration-300 ${
                    plan.highlighted
                      ? 'border-2 border-primary shadow-2xl scale-105 hover:scale-110'
                      : 'border border-gray-200 shadow-lg hover:shadow-xl hover:scale-105'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="inline-flex items-center bg-primary text-dark px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                      plan.highlighted ? 'bg-primary/20' : 'bg-gray-100'
                    }`}>
                      <plan.icon className={`w-8 h-8 ${plan.highlighted ? 'text-primary' : 'text-gray'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-dark mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray mb-6">{plan.tagline}</p>

                    <div className="mb-2">
                      <span className="text-5xl font-bold text-dark">
                        {billingCycle === 'monthly' ? plan.price : Math.floor(plan.yearlyPrice / 12)} ₺
                      </span>
                      <span className="text-xl text-gray ml-2">/ay</span>
                    </div>
                    {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                      <p className="text-sm text-gray">
                        Yıllık {plan.yearlyPrice} ₺ faturalandırılır
                      </p>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray/30 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-dark' : 'text-gray/50'}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      if (plan.name === 'Premium' || plan.name === 'Pro') {
                        onShowPage?.('iletisim');
                      } else {
                        onShowPage?.('giris');
                      }
                    }}
                    className={`w-full py-4 rounded-xl font-semibold transition-all ${
                      plan.highlighted
                        ? 'bg-primary text-dark hover:bg-primary/90 shadow-lg hover:shadow-xl'
                        : 'bg-dark text-primary hover:bg-dark/90'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-20 text-center">
              <p className="text-gray mb-8">Tüm planlarda dahil:</p>
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray">
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>SSL Güvenliği</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>KVKK Uyumlu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>Veri Şifrelemesi</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5 text-primary" />
                  <span>14 Gün Para İadesi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <HelpCircle className="w-8 h-8 text-dark" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-dark mb-4">
                Sıkça Sorulan Sorular
              </h2>
              <p className="text-xl text-gray max-w-2xl mx-auto">
                Fiyatlandırma ve planlar hakkında merak ettikleriniz
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg font-medium text-dark pr-8">{faq.q}</span>
                    <ChevronDown
                      className={`w-6 h-6 text-gray flex-shrink-0 transition-transform duration-300 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-5 text-gray leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray mb-4">Başka sorularınız mı var?</p>
              <button
                onClick={() => onShowPage?.('iletisim')}
                className="text-primary font-medium hover:underline inline-flex items-center space-x-2"
              >
                <span>İletişime Geçin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-24 bg-gradient-to-br from-dark to-dark/90">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-light text-white mb-8">
              Bugün <span className="text-primary font-medium">başlayın</span>
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              14 gün boyunca tüm özellikleri ücretsiz deneyin. Kredi kartı gerektirmez.
            </p>

            <button
              onClick={onGoHome}
              className="group px-12 py-6 bg-primary text-dark text-xl font-medium rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 inline-flex items-center space-x-3"
            >
              <span>Hemen Başla</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={onGoHome}>
                <span className="text-2xl font-light text-dark hover:text-primary transition-colors">AdGusto</span>
              </div>
              <p className="text-gray leading-relaxed">
                Yapay Zeka destekli pazarlama analizi ile işletmenizi büyütün
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Ürün</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage?.('ozellikler')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Özellikler</button></li>
                <li><button onClick={() => onShowPage?.('fiyatlandirma')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Fiyatlandırma</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Şirket</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage?.('hakkimizda')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Hakkımızda</button></li>
                <li><button onClick={() => onShowPage?.('iletisim')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">İletişim</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Kaynaklar</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage?.('dokumantasyon')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Dokümantasyon</button></li>
                <li><button onClick={() => onShowPage?.('gizlilik-politikasi')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Gizlilik Politikası</button></li>
                <li><button onClick={() => onShowPage?.('kullanim-kosullari')} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Kullanım Koşulları</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray text-sm">
              © 2025 AdGusto. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button onClick={() => onShowPage?.('kullanim-kosullari')} className="text-gray hover:text-dark text-sm transition-colors">Kullanım Koşulları</button>
              <button onClick={() => onShowPage?.('gizlilik-politikasi')} className="text-gray hover:text-dark text-sm transition-colors">Gizlilik Politikası</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};