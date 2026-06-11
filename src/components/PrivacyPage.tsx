import React from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import { Shield } from 'lucide-react';

interface PrivacyPageProps {
  onShowPage: (page: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({
  onShowPage,
}) => {
  return (
    <div className="min-h-screen bg-white text-dark flex flex-col">
      <PublicHeader onShowPage={onShowPage} />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#97fa07]/20 border border-[#97fa07]/30 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-[#0b0b0b]" />
            <span className="text-[#0b0b0b] text-sm font-medium">Gizlilik ve Güvenlik</span>
          </div>
          <h1 className="text-4xl font-extrabold text-[#0b0b0b] mb-4 leading-tight tracking-tight drop-shadow-sm">
            Gizlilik Politikası
          </h1>
          <p className="text-lg text-[#0b0b0b]/80 max-w-2xl mx-auto leading-relaxed mb-6">
            Verilerinizin güvenliği ve gizliliği bizim için en önemli önceliktir. AdGusto olarak verilerinizi <span className='font-semibold text-[#0b0b0b]'>şeffaflık</span> ve <span className='font-semibold text-[#0b0b0b]'>güven</span> ilkeleriyle koruyoruz.
          </p>
          <div className="max-w-xl mx-auto mb-4">
            <div className="flex items-center bg-[#0b0b0b]/5 border border-[#0b0b0b]/10 rounded-xl px-6 py-4 text-left gap-3">
              <Shield className="w-6 h-6 text-[#0b0b0b] flex-shrink-0" />
              <span className="text-base text-[#0b0b0b]/90 font-medium">Tüm verileriniz şifreli ve güvenli sunucularda saklanır. Hiçbir zaman üçüncü şahıslarla paylaşılmaz.</span>
            </div>
          </div>
        </div>

        {/* Privacy Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-8">
            {/* 1. Toplanan Bilgiler */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">1. Toplanan Bilgiler</h2>
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>Pazarlama analizi için girdiğiniz işletme bilgileri</li>
                <li>Platform kullanım istatistikleri (anonim)</li>
                <li>Teknik loglar ve hata raporları</li>
              </ul>
            </div>
            {/* 2. Bilgilerin Kullanımı */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">2. Bilgilerin Kullanımı</h2>
              </div>
              <div className="bg-[#97fa07]/10 border border-[#97fa07]/20 rounded-lg p-4 mb-3">
                <p className="text-[#0b0b0b]/90 mb-0 text-base font-medium">Topladığımız bilgileri sadece hizmet kalitesini artırmak ve size daha iyi bir deneyim sunmak için kullanıyoruz.</p>
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>Size özelleştirilmiş pazarlama analizi sunmak</li>
                <li>Hesabınızı güvenli tutmak ve kimlik doğrulama yapmak</li>
                <li>Ürün geliştirme ve hizmet kalitesini artırma</li>
                <li>Teknik destek sağlama</li>
              </ul>
            </div>
            {/* 3. Veri Güvenliği */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">3. Veri Güvenliği</h2>
              </div>
              <div className="bg-[#0b0b0b]/5 border border-[#0b0b0b]/10 rounded-lg p-4 mb-3">
                <ul className="list-disc list-inside space-y-2">
                  <li>Tüm veriler <span className='font-semibold text-[#0b0b0b]'>şifrelenerek</span> saklanır</li>
                  <li>Firebase Authentication ile güvenli kimlik doğrulama</li>
                  <li>HTTPS protokolü ile güvenli veri iletimi</li>
                  <li>Düzenli güvenlik denetimleri</li>
                </ul>
              </div>
            </div>
            {/* 4. Veri Paylaşımı */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">4. Veri Paylaşımı</h2>
              </div>
              <div className="bg-[#97fa07]/10 border border-[#97fa07]/20 rounded-lg p-4 mb-3">
                <p className="text-[#0b0b0b]/90 mb-0 text-base font-medium">Kişisel verileriniz asla üçüncü taraflarla paylaşılmaz. Sadece yasal zorunluluklar ve açık rızanız ile paylaşım yapılır.</p>
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>Yasal zorunluluklar gereği</li>
                <li>Açık rızanız ile</li>
                <li>Hizmet sağlayıcılarımızla (sadece hizmet sunumu için gerekli olan kısım)</li>
              </ul>
            </div>
            {/* 5. Haklarınız */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">5. Haklarınız</h2>
              </div>
              <div className="bg-[#0b0b0b]/5 border border-[#0b0b0b]/10 rounded-lg p-4 mb-3">
                <p className="text-[#0b0b0b]/90 mb-0 text-base font-medium">KVKK kapsamında sahip olduğunuz tüm haklara saygı duyuyoruz. Dilediğiniz zaman verilerinize erişebilir, düzeltebilir veya silebilirsiniz.</p>
              </div>
              <ul className="list-disc list-inside space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin düzeltilmesini isteme</li>
                <li>Kişisel verilerinizin silinmesini isteme</li>
                <li>Hesabınızı tamamen kapatma</li>
              </ul>
            </div>
            {/* 6. İletişim */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-[#97fa07]" />
                <h2 className="text-2xl font-bold text-[#0b0b0b] mb-0">6. İletişim</h2>
              </div>
              <div className="bg-[#97fa07]/10 border border-[#97fa07]/20 rounded-lg p-4 mb-3">
                <p className="text-[#0b0b0b]/90 mb-0 text-base font-medium">
                  Gizlilik politikamız hakkında sorularınız için <strong className="text-[#97fa07]">destek@adgusto.app</strong> adresinden bizimle iletişime geçebilirsiniz.
                </p>
              </div>
            </div>
            {/* Son Güncelleme */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mt-8">
              <p className="text-[#0b0b0b] font-medium mb-2">Son Güncelleme: 1 Ocak 2025</p>
              <p className="text-[#0b0b0b]/70 text-sm">
                Bu gizlilik politikası değişiklik gösterebilir. Önemli değişiklikler için e-posta ile bilgilendirileceksiniz.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={onGoHome}>
                <span className="text-2xl font-light text-[#0b0b0b] hover:text-[#97fa07] transition-colors">AdGusto</span>
              </div>
              <p className="text-[#0b0b0b]/70 leading-relaxed mb-6">
                AI destekli pazarlama analizi ile işletmenizi büyütün
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-[#97fa07]/20 rounded-full flex items-center justify-center hover:bg-[#97fa07]/30 transition-colors cursor-pointer">
                  <span className="text-[#0b0b0b] font-bold text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-[#97fa07]/20 rounded-full flex items-center justify-center hover:bg-[#97fa07]/30 transition-colors cursor-pointer">
                  <span className="text-[#0b0b0b] font-bold text-sm">t</span>
                </div>
                  <Footer onShowPage={onShowPage} />
                <div className="w-10 h-10 bg-[#97fa07]/20 rounded-full flex items-center justify-center hover:bg-[#97fa07]/30 transition-colors cursor-pointer">
                  <span className="text-[#0b0b0b] font-bold text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-[#0b0b0b] mb-6">Ürün</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('features')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Özellikler</button></li>
                <li><button className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Fiyatlandırma</button></li>
                <li><button className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">API</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0b0b0b] mb-6">Şirket</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('about')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Hakkımızda</button></li>
                <li><button onClick={() => onShowPage('blog')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Blog</button></li>
                <li><button onClick={() => onShowPage('contact')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">İletişim</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#0b0b0b] mb-6">Kaynaklar</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('documentation')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Dokümantasyon</button></li>
                <li><button onClick={() => onShowPage('privacy')} className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Gizlilik</button></li>
                <li><button className="text-[#0b0b0b]/70 hover:text-[#0b0b0b] transition-colors hover:translate-x-1 inline-block">Destek</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[#0b0b0b]/60 text-sm">
              © 2025 AdGusto. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button className="text-[#0b0b0b]/60 hover:text-[#0b0b0b] text-sm transition-colors">Kullanım Koşulları</button>
              <button onClick={() => onShowPage('privacy')} className="text-[#0b0b0b]/60 hover:text-[#0b0b0b] text-sm transition-colors">Gizlilik Politikası</button>
            </div>
            <div className="mt-8 md:mt-0">
              <button onClick={onGoHome} className="px-6 py-3 bg-[#97fa07] text-[#0b0b0b] rounded-xl hover:bg-[#97fa07]/90 transition-all duration-200 font-medium shadow-sm hover:shadow-lg hover:-translate-y-1">
                Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}