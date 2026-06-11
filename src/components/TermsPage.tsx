import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import { FileText, Calendar, Shield, AlertCircle } from 'lucide-react';

interface TermsPageProps {
  onShowPage: (page: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onShowPage }) => {
  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-dark">YASAL</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Kullanım Koşulları
            </h1>
            <div className="flex items-center gap-4 text-gray">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Son Güncelleme: 7 Eylül 2025</span>
              </div>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-dark leading-relaxed m-0">
                  Bu koşulları dikkatlice okuyun. AdGusto hizmetlerini kullanarak, bu koşulları kabul etmiş sayılırsınız.
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                Hizmet Tanımı
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                AdGusto, yapay zeka destekli pazarlama analizi ve reklam içeriği oluşturma platformudur. Platform aşağıdaki hizmetleri sunmaktadır:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Yapay zeka destekli reklam metni oluşturma</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Pazarlama görseli üretimi ve analizi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>CSV kampanya verisi analizi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Detaylı performans raporları</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                Kullanıcı Sorumlulukları
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                AdGusto'yu kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Hesap bilgilerinizi güvenli tutmak ve başkalarıyla paylaşmamak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Yasa dışı, zararlı veya yanıltıcı içerik oluşturmamak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Platformun güvenliğini tehlikeye atacak eylemlerden kaçınmak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Doğru ve güncel bilgiler sağlamak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Üçüncü taraf haklarına saygı göstermek</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                Fikri Mülkiyet Hakları
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                Platform üzerinde oluşturulan içeriklerle ilgili haklar:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Platformun kendisi ve teknolojisi AdGusto'nun mülkiyetindedir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Kullanıcılar tarafından yüklenen içerikler kullanıcının mülkiyetindedir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI tarafından oluşturulan içeriklerin kullanım hakkı kullanıcıya aittir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AdGusto, hizmet iyileştirme amacıyla anonim veriler kullanabilir</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                Ücretlendirme ve Abonelik
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                Ücretli planlar ve ödeme koşulları:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Ücretler aylık veya yıllık olarak tahsil edilir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Abonelik iptal edilene kadar otomatik olarak yenilenir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>İade politikası: İlk 14 gün içinde tam iade hakkı</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Fiyatlar önceden bildirimle değiştirilebilir</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">5</span>
                </div>
                Hizmet Kesintileri
              </h2>
              <p className="text-gray leading-relaxed">
                AdGusto, teknik bakım, güncellemeler veya beklenmedik durumlar nedeniyle hizmette kesintiler yaşanabileceğini kabul eder. Platform, mümkün olan en kısa sürede hizmetin tekrar sağlanması için çalışır ancak kesintilerden kaynaklanan zararlardan sorumlu tutulamaz.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">6</span>
                </div>
                Sorumluluk Sınırlaması
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                AdGusto'nun sorumluluğu aşağıdaki şekilde sınırlandırılmıştır:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Platform "olduğu gibi" sunulmaktadır</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>AI tarafından üretilen içeriklerin doğruluğu garanti edilmez</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Kullanıcılar içerikleri kendi sorumluluklarında değerlendirmelidir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Dolaylı zararlardan sorumluluk kabul edilmez</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">7</span>
                </div>
                Hesap İptali
              </h2>
              <p className="text-gray leading-relaxed">
                AdGusto, kullanım koşullarını ihlal eden hesapları önceden bildirimde bulunmaksızın askıya alabilir veya iptal edebilir. Kullanıcılar istedikleri zaman hesaplarını kapatabilir. Hesap kapatıldığında, kullanıcı verileri gizlilik politikasına uygun şekilde işlenir.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">8</span>
                </div>
                Değişiklikler
              </h2>
              <p className="text-gray leading-relaxed">
                AdGusto, bu kullanım koşullarını dilediği zaman değiştirme hakkını saklı tutar. Önemli değişiklikler e-posta veya platform üzerinden bildirilir. Değişiklikler yayınlandıktan sonra hizmeti kullanmaya devam etmek, yeni koşulları kabul ettiğiniz anlamına gelir.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">9</span>
                </div>
                Uygulanacak Hukuk
              </h2>
              <p className="text-gray leading-relaxed">
                Bu kullanım koşulları Türkiye Cumhuriyeti yasalarına tabidir. Herhangi bir uyuşmazlık durumunda İstanbul mahkemeleri yetkilidir.
              </p>
            </section>

            <section className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-dark mb-3">İletişim</h3>
                  <p className="text-gray leading-relaxed mb-4">
                    Kullanım koşullarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                  </p>
                  <div className="space-y-2 text-gray">
                    <p><strong className="text-dark">E-posta:</strong> destek@adgusto.app</p>
                    <p><strong className="text-dark">Adres:</strong> İstanbul, Türkiye</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer onShowPage={onShowPage} />
    </div>
  );
};
