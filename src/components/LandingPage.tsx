import React from 'react';
import {
  ArrowRight,
  Zap,
  Target,
  Menu,
  X,
  CheckCircle,
  Star,
  Wand2,
  ImagePlus,
  Sparkles,
  ChevronDown,
  HelpCircle,
  LineChart,
  Video
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const { language } = useLanguage();
  const routes = translations[language].routes;

  return (
    <div className="min-h-screen bg-white text-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-6 py-4 font-inter">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onShowPage('landing')}>
              <span className="text-2xl font-light text-dark hover:text-primary transition-colors">AdGusto</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => onShowPage(routes.features)} className="text-gray hover:text-dark transition-colors font-medium">Özellikler</button>
              <button onClick={() => onShowPage(routes.pricing)} className="text-gray hover:text-dark transition-colors font-medium">Fiyatlandırma</button>
              <button onClick={() => onShowPage(routes.about)} className="text-gray hover:text-dark transition-colors font-medium">Hakkımızda</button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="px-4 py-2 text-gray hover:text-dark transition-colors font-medium"
              >
                Giriş Yap
              </button>
              <button
                onClick={onSignup}
                className="px-6 py-3 bg-primary text-dark rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-lg hover:-translate-y-1"
              >
                Ücretsiz Dene
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
              <nav className="flex flex-col space-y-4">
                <button onClick={() => onShowPage(routes.features)} className="text-left text-gray hover:text-dark transition-colors font-medium">Özellikler</button>
                <button onClick={() => onShowPage(routes.pricing)} className="text-left text-gray hover:text-dark transition-colors font-medium">Fiyatlandırma</button>
                <button onClick={() => onShowPage(routes.about)} className="text-left text-gray hover:text-dark transition-colors font-medium">Hakkımızda</button>
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={onLogin}
                    className="text-left text-gray hover:text-dark transition-colors font-medium"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={onSignup}
                    className="px-6 py-3 bg-primary text-dark rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium text-center"
                  >
                    Ücretsiz Dene
                  </button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="px-6 py-24 lg:py-40 bg-gradient-to-br from-white to-primary/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-6 py-3 mb-12 hover:bg-primary/30 transition-all duration-300">
                <Zap className="w-5 h-5 text-dark" />
                <span className="text-dark font-medium">ROAS Arttıran Gusto</span>
              </div>
              
              <h1 className="text-6xl lg:text-8xl font-light text-dark mb-12 leading-tight tracking-tight">
                <TextType
                  text={["Sıfırdan Reklamlar", "Pazarlama Stratejisi"]}
                  typingSpeed={80}
                  deletingSpeed={50}
                  pauseDuration={2000}
                  className="block mb-4"
                  textColors={["#0b0b0b", "#0b0b0b", "#0b0b0b"]}
                />
                <span className="text-primary font-medium bg-dark px-4 py-2 rounded-2xl inline-block transform hover:scale-105 transition-transform duration-300">Oluşturun</span>
              </h1>
              
              <p className="text-2xl text-gray mb-16 max-w-3xl mx-auto leading-relaxed">
                Yapay Zeka destekli pazarlama analizi ile hizmetiniz için en uygun dijital stratejiyi 
                keşfedin ve etkili reklam metinleri oluşturun.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mb-20">
                <button
                  onClick={onSignup}
                  className="group w-full sm:w-auto px-10 py-5 bg-primary text-dark text-xl font-medium rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 flex items-center justify-center space-x-3"
                >
                  <span>Hemen Başla</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center space-x-2 text-gray">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium">Ücretsiz Dene</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-8 text-gray">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-dark rounded-full border-2 border-white"></div>
                    <div className="w-8 h-8 bg-primary rounded-full border-2 border-white"></div>
                  </div>
                  <span className="text-sm font-medium">500+ Mutlu Kullanıcı</span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                  <span className="text-sm font-medium ml-2">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Preview with SpotlightCard */}
        <section className="px-6 py-12 bg-dark relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">AI DESTEKLI ÖZELLİKLER</span>
              </div>
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">
                Görsel İçeriklerinizi
                <span className="block text-primary">Oluşturun</span>
              </h3>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
                Yapay zeka ile profesyonel pazarlama görselleri oluşturun,
                mevcut görsellerinizi optimize edin ve performansınızı artırın.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Wand2 className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Görsel Üretimi</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Yapay zeka ile anında profesyonel pazarlama görselleri oluşturun
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <ImagePlus className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Görsel Düzenleme</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Mevcut görsellerinizi AI ile optimize edin ve iyileştirin
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Akıllı Analiz</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Görsellerinizi analiz edin ve performans önerileri alın
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center relative">
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">Yakında</span>
                  </div>
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <LineChart className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Reklam Yönetimi</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Tüm kampanyalarınızı tek yerden yönetin ve optimize edin
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center relative">
                  <div className="absolute -top-2 -right-2">
                    <span className="bg-primary text-dark text-xs font-bold px-3 py-1 rounded-full">Yakında</span>
                  </div>
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Video Oluşturucu</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    AI ile saniyeler içinde profesyonel reklam videoları üretin
                  </p>
                </div>
              </SpotlightCard>

              <SpotlightCard spotlightColor="rgba(148, 250, 1, 0.2)">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-[#94fa01]/20 rounded-2xl flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-[#94fa01]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Hedef Belirleme</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Pazarlama hedeflerinizi belirleyin ve takip edin
                  </p>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-6 py-20 bg-dark">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-white mb-6">
                Neden <span className="text-primary font-medium">AdGusto'yu</span> seçmelisiniz?
              </h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Pazarlama sürecinizi dönüştüren kanıtlanmış faydalar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-5xl font-light text-primary mb-4 group-hover:scale-110 transition-transform">10x</div>
                <h3 className="font-semibold text-white mb-2">Daha Hızlı</h3>
                <p className="text-white/70 text-sm">Strateji geliştirme sürenizi 10 kata kadar azaltın</p>
              </div>

              <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-5xl font-light text-primary mb-4 group-hover:scale-110 transition-transform">95%</div>
                <h3 className="font-semibold text-white mb-2">Doğruluk</h3>
                <p className="text-white/70 text-sm">Yapay Zeka önerilerimizin başarı oranı %95'in üzerinde</p>
              </div>

              <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-5xl font-light text-primary mb-4 group-hover:scale-110 transition-transform">60%</div>
                <h3 className="font-semibold text-white mb-2">Daha Yüksek ROI</h3>
                <p className="text-white/70 text-sm">Pazarlama yatırımınızdan daha fazla geri dönüş alın</p>
              </div>

              <div className="text-center p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="text-5xl font-light text-primary mb-4 group-hover:scale-110 transition-transform">50+</div>
                <h3 className="font-semibold text-white mb-2">Sektör</h3>
                <p className="text-white/70 text-sm">Farklı sektörlerden deneyimli Yapay Zeka modeli</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-light text-dark mb-8">
                Müşterilerimiz <span className="text-primary bg-dark px-4 py-2 rounded-2xl font-medium">ne diyor?</span>
              </h2>
              <p className="text-2xl text-gray max-w-3xl mx-auto">
                Hedef kitlenize ulaşmak için hiç kimseye ihtiyacın yok
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-primary/10 to-white border border-primary/20 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-dark leading-relaxed mb-6 italic">
                    "AdGusto sayesinde pazarlama bütçemizi %40 daha verimli kullanıyoruz. 
                    AdGusto önerileri gerçekten işe yarıyor!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark font-bold">AK</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark">Armağan Güven</p>
                      <p className="text-gray text-sm">Girişimci</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark/10 to-white border border-dark/20 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-dark leading-relaxed mb-6 italic">
                    "Reklam metinleri oluşturmak artık çok kolay. Dönüşüm oranlarımız 
                    %25 arttı!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">SY</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark">Selin Yılmaz</p>
                      <p className="text-gray text-sm">Dijital Pazarlama Uzmanı</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-white border border-primary/20 rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="relative">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-dark leading-relaxed mb-6 italic">
                    "Kampanya analizleri sayesinde hangi kanalların işe yaradığını 
                    net olarak görüyorum."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-dark font-bold">MÖ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark">Murat Özkan</p>
                      <p className="text-gray text-sm">Restoran Sahibi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-24 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <HelpCircle className="w-8 h-8 text-dark" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-light text-dark mb-4">
                Sıkça Sorulan Sorular
              </h2>
              <p className="text-xl text-gray max-w-2xl mx-auto">
                AdGusto hakkında merak ettikleriniz
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'AdGusto neler yapabilir?',
                  a: 'AdGusto ile dijital pazarlama analizleri yapabilir, AI destekli reklam metinleri oluşturabilir, profesyonel reklam görselleri üretebilir, kampanya performanslarınızı CSV ile analiz edebilir ve sektörünüze özel pazarlama stratejileri alabilirsiniz. Ayrıca görsel düzenleme ve görsel yaratma özellikleriyle markanıza özel, dikkat çekici görseller oluşturabilirsiniz.'
                },
                {
                  q: 'Hangi reklam platformlarını destekliyorsunuz?',
                  a: 'Google Ads, Meta (Facebook & Instagram), LinkedIn, TikTok ve YouTube için özelleştirilmiş reklam metinleri ve stratejiler oluşturuyoruz. Her platform için optimize edilmiş içerikler üretebilirsiniz.'
                },
                {
                  q: 'Ücretsiz deneme süresi var mı?',
                  a: 'Evet! Kaydolduğunuzda tüm özellikleri deneyebilmeniz için ücretsiz erişim sunuyoruz. Kredi kartı bilgisi gerektirmeden hemen başlayabilirsiniz.'
                },
                {
                  q: 'Teknik bilgim olmadan kullanabilir miyim?',
                  a: 'Kesinlikle! AdGusto\'yu kullanmak için herhangi bir teknik bilgiye ihtiyaç yok. Sade ve kullanıcı dostu arayüzümüz sayesinde herkes kolayca kullanabilir.'
                },
                {
                  q: 'AI modelleri ne kadar doğru?',
                  a: '50+ farklı sektörden veri ile eğitilmiş AI modellerimiz %95 doğruluk oranına sahiptir. Sürekli öğrenen sistemimiz her gün daha da gelişmektedir.'
                },
                {
                  q: 'Verilerim güvende mi?',
                  a: 'Evet! Tüm verileriniz endüstri standardı SSL/TLS şifreleme ile korunur ve güvenli sunucularda saklanır. KVKK ve GDPR standartlarına tam uyumluyuz.'
                }
              ].map((faq, index) => (
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
                onClick={() => onShowPage(routes.contact)}
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
              Pazarlama stratejinizi <span className="text-primary font-medium">bugün</span> keşfedin
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
              Yapay Zeka destekli pazarlama analizi ile işletmenizi büyütün
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-6 sm:space-y-0 sm:space-x-8 mb-12">
              <button
                onClick={onSignup}
                className="group w-full sm:w-auto px-12 py-6 bg-primary text-dark text-xl font-medium rounded-2xl hover:bg-primary/90 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:-translate-y-2 flex items-center justify-center space-x-3"
              >
                <span>Hemen Başla</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-3 text-white/70">
                <CheckCircle className="w-6 h-6 text-primary" />
                <span className="font-medium">Kredi kartı gerektirmez</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-12 text-white/50">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Ücretsiz</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>Anında Kurulum</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>7/24 Destek</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={() => onShowPage('landing')}>
                <span className="text-2xl font-light text-dark hover:text-primary transition-colors">AdGusto</span>
              </div>
              <p className="text-gray leading-relaxed mb-6">
                Yapay Zeka destekli pazarlama analizi ile işletmenizi büyütün
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                  <span className="text-dark font-bold text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                  <span className="text-dark font-bold text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                  <span className="text-dark font-bold text-sm">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Ürün</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage(routes.features)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Özellikler</button></li>
                <li><button onClick={() => onShowPage(routes.pricing)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Fiyatlandırma</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Şirket</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage(routes.about)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Hakkımızda</button></li>
                <li><button onClick={() => onShowPage(routes.contact)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">İletişim</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-dark mb-6">Kaynaklar</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage(routes.documentation)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Dokümantasyon</button></li>
                <li><button onClick={() => onShowPage(routes.privacyPolicy)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Gizlilik Politikası</button></li>
                <li><button onClick={() => onShowPage(routes.terms)} className="text-gray hover:text-dark transition-colors hover:translate-x-1 inline-block">Kullanım Koşulları</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray text-sm">
              © 2025 AdGusto. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button onClick={() => onShowPage(routes.terms)} className="text-gray hover:text-dark text-sm transition-colors">Kullanım Koşulları</button>
              <button onClick={() => onShowPage(routes.privacyPolicy)} className="text-gray hover:text-dark text-sm transition-colors">Gizlilik Politikası</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Calendly Demo Button */}
      <a
        href="https://calendly.com/adgustoapp"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-dark text-primary px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-medium z-50 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        Demo Planla
      </a>
    </div>
  );
};