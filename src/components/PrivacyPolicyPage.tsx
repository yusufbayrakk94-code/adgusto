import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import { Shield, Calendar, Lock, Eye, Database, Bell, Users, FileCheck } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onShowPage: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onShowPage }) => {
  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-dark">GİZLİLİK</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
              Gizlilik Politikası
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
                <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <p className="text-dark leading-relaxed m-0">
                  AdGusto olarak gizliliğinize önem veriyoruz. Bu politika, kişisel verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                Topladığımız Bilgiler
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                AdGusto platformunu kullanırken aşağıdaki bilgiler toplanabilir:
              </p>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-dark mb-3">Hesap Bilgileri</h3>
                  <ul className="space-y-2 text-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>İsim, e-posta adresi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Şirket bilgileri (isteğe bağlı)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Ödeme bilgileri (şifreli)</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-dark mb-3">Kullanım Verileri</h3>
                  <ul className="space-y-2 text-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Platform kullanım istatistikleri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Oluşturulan reklam metinleri ve görseller</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Yüklenen CSV dosyaları</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Kampanya analiz sonuçları</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-dark mb-3">Teknik Veriler</h3>
                  <ul className="space-y-2 text-gray">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>IP adresi, tarayıcı türü</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Cihaz bilgileri</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Çerezler (cookies)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-primary" />
                </div>
                Bilgileri Nasıl Kullanıyoruz
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                Topladığımız bilgileri şu amaçlarla kullanıyoruz:
              </p>
              <ul className="space-y-3 text-gray">
                <li className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="text-primary font-bold mt-1">1.</span>
                  <div>
                    <strong className="text-dark">Hizmet Sunumu:</strong> Platform özelliklerini sağlamak ve iyileştirmek
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="text-primary font-bold mt-1">2.</span>
                  <div>
                    <strong className="text-dark">Kişiselleştirme:</strong> Kullanıcı deneyimini optimize etmek
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="text-primary font-bold mt-1">3.</span>
                  <div>
                    <strong className="text-dark">İletişim:</strong> Önemli güncellemeler ve bildirimler göndermek
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="text-primary font-bold mt-1">4.</span>
                  <div>
                    <strong className="text-dark">Güvenlik:</strong> Hesap güvenliğini sağlamak ve dolandırıcılığı önlemek
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="text-primary font-bold mt-1">5.</span>
                  <div>
                    <strong className="text-dark">Analiz:</strong> Platform performansını izlemek ve iyileştirmek
                  </div>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                Veri Güvenliği
              </h2>
              <p className="text-gray leading-relaxed mb-6">
                Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanıyoruz:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">Şifreleme</h3>
                  <p className="text-gray text-sm">
                    Tüm veriler SSL/TLS ile şifrelenir
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl p-6 border border-blue-500/20">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">Güvenli Depolama</h3>
                  <p className="text-gray text-sm">
                    Veriler güvenli sunucularda saklanır
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-6 border border-green-500/20">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">Erişim Kontrolü</h3>
                  <p className="text-gray text-sm">
                    Sınırlı personel erişimi
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl p-6 border border-purple-500/20">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                    <FileCheck className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">Düzenli Denetim</h3>
                  <p className="text-gray text-sm">
                    Güvenlik sistemleri sürekli izlenir
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                Bilgi Paylaşımı
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                Kişisel bilgilerinizi aşağıdaki durumlar dışında üçüncü taraflarla paylaşmıyoruz:
              </p>
              <ul className="space-y-2 text-gray">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-dark">Yasal Zorunluluk:</strong> Yasal bir gereklilik olduğunda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-dark">Hizmet Sağlayıcılar:</strong> Ödeme işlemcileri gibi güvenilir üçüncü taraflar (NDA ile korunur)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-dark">Şirket Birleşmeleri:</strong> Şirket satış, birleşme veya devralma durumunda</span>
                </li>
              </ul>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-4">
                <p className="text-dark font-semibold m-0">
                  ⚠️ Bilgilerinizi asla pazarlama amaçlı satmıyoruz veya kiralamıyoruz.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                Çerezler (Cookies)
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                AdGusto, kullanıcı deneyimini iyileştirmek için çerezler kullanır:
              </p>
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-dark mb-2">Gerekli Çerezler</h4>
                  <p className="text-gray text-sm">
                    Platform işlevselliği için zorunlu çerezler (oturum yönetimi, güvenlik)
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-dark mb-2">Analitik Çerezler</h4>
                  <p className="text-gray text-sm">
                    Platform kullanımını analiz etmek için (Google Analytics gibi)
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-bold text-dark mb-2">Tercih Çerezleri</h4>
                  <p className="text-gray text-sm">
                    Kullanıcı tercihlerini hatırlamak için (dil, tema seçimleri)
                  </p>
                </div>
              </div>
              <p className="text-gray text-sm mt-4">
                Çerezleri tarayıcı ayarlarınızdan yönetebilirsiniz. Ancak bazı çerezleri devre dışı bırakmak platform işlevselliğini etkileyebilir.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileCheck className="w-5 h-5 text-primary" />
                </div>
                Kullanıcı Hakları
              </h2>
              <p className="text-gray leading-relaxed mb-4">
                Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                  <h4 className="font-bold text-dark mb-2">✓ Erişim Hakkı</h4>
                  <p className="text-gray text-sm">
                    Hangi verilerinizi sakladığımızı öğrenme
                  </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                  <h4 className="font-bold text-dark mb-2">✓ Düzeltme Hakkı</h4>
                  <p className="text-gray text-sm">
                    Yanlış bilgileri düzeltme
                  </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                  <h4 className="font-bold text-dark mb-2">✓ Silme Hakkı</h4>
                  <p className="text-gray text-sm">
                    Verilerinizin silinmesini talep etme
                  </p>
                </div>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary transition-colors">
                  <h4 className="font-bold text-dark mb-2">✓ Taşıma Hakkı</h4>
                  <p className="text-gray text-sm">
                    Verilerinizi indirme ve başka yere taşıma
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">🌍</span>
                </div>
                Uluslararası Veri Aktarımı
              </h2>
              <p className="text-gray leading-relaxed">
                Verileriniz güvenli bulut sunucularında saklanır. Veriler, yerel veri koruma yasalarına uygun şekilde işlenir. Uluslararası aktarımlarda uygun güvenlik önlemleri alınır ve KVKK (Kişisel Verilerin Korunması Kanunu) ile GDPR standartlarına uyulur.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <span className="text-primary font-bold">👶</span>
                </div>
                Çocukların Gizliliği
              </h2>
              <p className="text-gray leading-relaxed">
                AdGusto, 18 yaşından küçük bireylere yönelik değildir. Bilerek 18 yaş altı kullanıcılardan kişisel bilgi toplamıyoruz. Eğer çocuğunuza ait bilgilerin toplandığını düşünüyorsanız, lütfen bizimle iletişime geçin.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-dark mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                Politika Değişiklikleri
              </h2>
              <p className="text-gray leading-relaxed">
                Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda e-posta ile bilgilendirileceksiniz. Güncellenmiş politika, yayınlandığı tarihte yürürlüğe girer. Platform kullanmaya devam ederek yeni politikayı kabul etmiş sayılırsınız.
              </p>
            </section>

            <section className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 rounded-2xl p-8">
              <div className="flex items-start gap-4">
                <Shield className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-dark mb-3">Bizimle İletişime Geçin</h3>
                  <p className="text-gray leading-relaxed mb-4">
                    Gizlilik politikası veya verilerinizle ilgili sorularınız için:
                  </p>
                  <div className="space-y-2 text-gray">
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-dark">E-posta:</span>
                      <a href="mailto:privacy@adgusto.com" className="text-primary hover:underline">destek@adgusto.app</a>
                    </p>
                    <p><span className="font-bold text-dark">Adres:</span> İstanbul, Türkiye</p>
                    <p className="text-sm mt-4 pt-4 border-t border-gray-300">
                      Veri sorumlusu: AdGusto A.Ş. | KVKK uyumlu
                    </p>
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
