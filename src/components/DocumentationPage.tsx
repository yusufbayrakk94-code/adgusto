import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import {
  BarChart3,
  BookOpen,
  Lightbulb,
  Rocket,
  Target,
  TrendingUp,
  MessageSquare,
  ImagePlus,
  FileText,
  HelpCircle
} from 'lucide-react';
import GradualBlur from './GradualBlur';

interface DocumentationPageProps {
  onShowPage: (page: string) => void;
}

export const DocumentationPage: React.FC<DocumentationPageProps> = ({
  onShowPage
}) => {
  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          style={{ position: 'relative', minHeight: '50vh', overflow: 'hidden' }}
          className="px-6 py-24 lg:py-32 bg-gradient-to-br from-white to-primary/10 text-center"
        >
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="inline-flex items-center space-x-2 bg-primary/20 border border-primary/30 rounded-full px-5 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-dark" />
              <span className="text-dark font-bold text-xs">KULLANIM KILAVUZU</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-light text-dark mb-6 tracking-tight">
              Dokümantasyon
            </h1>

            <p className="text-xl text-gray max-w-3xl mx-auto leading-relaxed">
              AdGusto'yu en verimli şekilde kullanmak için kapsamlı rehber ve ipuçları.
            </p>
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

        {/* Quick Start Guide */}
        <section className="px-6 py-16 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-dark mb-4">Hızlı Başlangıç</h2>
            <p className="text-gray text-lg">AdGusto'yu kullanmaya başlamak için temel adımlar</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Rocket,
                title: '1. Hesap Oluşturun',
                description: 'E-posta adresinizle hızlıca kaydolun ve ücretsiz denemeye başlayın.'
              },
              {
                icon: Target,
                title: '2. İşletmenizi Tanımlayın',
                description: 'Sektörünüzü, hedef kitlenizi ve özel özelliklerinizi girin.'
              },
              {
                icon: TrendingUp,
                title: '3. Analiz Alın',
                description: 'AI destekli pazarlama stratejilerinizi hemen görüntüleyin.'
              }
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white border border-primary/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-dark" />
                </div>
                <h3 className="text-lg font-medium text-dark mb-2">{step.title}</h3>
                <p className="text-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Documentation */}
        <section className="px-6 py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-dark mb-4">Özellikler</h2>
              <p className="text-gray text-lg">Platform özelliklerinin detaylı kullanım kılavuzu</p>
            </div>

            <div className="space-y-8">
              {/* Dijital Pazarlama Analizi */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-dark" />
                  </div>
                  <h3 className="text-2xl font-medium text-dark">Dijital Pazarlama Analizi</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-dark mb-3 flex items-center space-x-2">
                      <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-dark text-xs font-bold">1</span>
                      <span>Nasıl Çalışır?</span>
                    </h4>
                    <p className="text-gray leading-relaxed mb-4">
                      Dijital pazarlama analizi özelliği, işletmenizi tanımladıktan sonra AI algoritmaları
                      kullanarak size özel pazarlama stratejisi oluşturur.
                    </p>
                    <ul className="space-y-3">
                      {[
                        'Sektörünüzü ve hizmetlerinizi detaylı açıklayın',
                        'Hedef kitlenizi ve coğrafi bölgenizi belirtin',
                        'Rakiplerinizden farklı özelliklerinizi vurgulayın',
                        'Fiyat aralığınızı ve konumlandırmanızı ekleyin'
                      ].map((item, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-gray">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-dark mb-3 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-primary" />
                      <span>Daha İyi Sonuçlar İçin:</span>
                    </h4>
                    <ul className="space-y-2">
                      {[
                        'Mevcut pazarlama deneyimlerinizi paylaşın',
                        'Bütçe aralığınızı belirtin',
                        'Öncelikli hedeflerinizi açıklayın',
                        'Mevsimsel faktörleri göz önünde bulundurun'
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="text-primary mt-1">✓</span>
                          <span className="text-gray">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reklam Metni Oluşturucu */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-dark" />
                  </div>
                  <h3 className="text-2xl font-medium text-dark">Reklam Metni Oluşturucu</h3>
                </div>

                <div className="space-y-4 text-gray leading-relaxed">
                  <p>
                    AI destekli reklam metni oluşturucu, farklı platformlar için optimize edilmiş
                    reklam metinleri oluşturur.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    {[
                      { platform: 'Google Ads', desc: 'Arama ve display reklamları' },
                      { platform: 'Meta Ads', desc: 'Facebook & Instagram' },
                      { platform: 'LinkedIn', desc: 'B2B odaklı metinler' },
                      { platform: 'TikTok', desc: 'Genç kitle için yaratıcı içerik' }
                    ].map((item, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="font-medium text-dark mb-1">{item.platform}</h5>
                        <p className="text-sm text-gray">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Görsel Oluşturucu */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <ImagePlus className="w-6 h-6 text-dark" />
                  </div>
                  <h3 className="text-2xl font-medium text-dark">Görsel Oluşturucu</h3>
                </div>

                <div className="space-y-4 text-gray leading-relaxed">
                  <p>
                    AI ile profesyonel reklam görselleri oluşturun. Markanıza özel,
                    dikkat çekici görseller sadece birkaç tıkla hazır.
                  </p>
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <p className="text-dark font-medium">
                      💡 İpucu: Detaylı açıklamalar daha iyi sonuçlar üretir.
                    </p>
                  </div>
                </div>
              </div>

              {/* CSV Analizi */}
              <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-lg">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-dark" />
                  </div>
                  <h3 className="text-2xl font-medium text-dark">CSV Kampanya Analizi</h3>
                </div>

                <div className="space-y-4 text-gray leading-relaxed">
                  <p>
                    Reklam platformlarından dışa aktardığınız CSV dosyalarını yükleyin ve
                    detaylı performans analizi alın.
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Google Ads, Meta Ads CSV formatlarını destekler',
                      'Kampanya performansını otomatik analiz eder',
                      'İyileştirme önerileri sunar',
                      'Trend grafikleri ve metrikler gösterir'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-6 py-16 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-dark" />
            </div>
            <h2 className="text-3xl font-light text-dark mb-4">Sıkça Sorulan Sorular</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'AdGusto nasıl çalışır?',
                a: 'Hizmetinizi tanımladıktan sonra, AI algoritmalarımız sektörünüze özel pazarlama stratejileri oluşturur ve en uygun reklam kanallarını önerir.'
              },
              {
                q: 'Hangi platformları destekliyorsunuz?',
                a: 'Google Ads, Meta (Facebook/Instagram), LinkedIn, TikTok ve YouTube için özelleştirilmiş strateji ve reklam metinleri oluşturuyoruz.'
              },
              {
                q: 'Analiz sonuçları ne kadar doğru?',
                a: 'AI modelimiz 50+ farklı sektörden veri ile eğitilmiştir ve %95 doğruluk oranına sahiptir. Sürekli öğrenen sistemimiz her gün daha da gelişmektedir.'
              },
              {
                q: 'Teknik bilgim yok, kullanabilir miyim?',
                a: 'Kesinlikle! AdGusto\'yu kullanmak için teknik bilgiye ihtiyaç yok. Sade arayüzümüz ile herkes kolayca kullanabilir.'
              },
              {
                q: 'Ücretsiz deneme süresi var mı?',
                a: 'Evet! Kaydolduğunuzda tüm özellikleri denemek için ücretsiz erişim sunuyoruz.'
              }
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-medium text-dark mb-3">{faq.q}</h3>
                <p className="text-gray leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-16 bg-dark text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">Hala Sorunuz mu Var?</h2>
            <p className="text-white/70 text-lg mb-8">
              Destek ekibimiz size yardımcı olmak için burada.
            </p>
            <button
              onClick={() => onShowPage('contact')}
              className="px-8 py-4 bg-primary text-dark rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              İletişime Geçin
            </button>
          </div>
        </section>
      </main>

      <Footer onShowPage={onShowPage} />
    </div>
  );
};
