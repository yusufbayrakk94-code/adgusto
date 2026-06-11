import React, { useState } from 'react';
import { PublicHeader } from './PublicHeader';
import { Footer } from './Footer';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

interface ContactPageProps {
  onShowPage: (page: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onShowPage
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase yapılandırması eksik');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mesaj gönderilemedi');
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 3000);
    } catch (err) {
      console.error('Form gönderim hatası:', err);
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <PublicHeader onShowPage={onShowPage} />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          
          {/* Hero */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-light text-dark mb-8 leading-tight tracking-tight">
              İletişim
            </h1>
            <p className="text-xl text-gray max-w-2xl mx-auto leading-relaxed">
              Sorularınız için buradayız. Size nasıl yardımcı olabileceğimizi öğrenmek için bizimle iletişime geçin.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white border border-[#e5e5e5] rounded-3xl p-8">
                <h2 className="text-2xl font-light text-dark mb-8">İletişim Bilgileri</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-dark" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">E-posta</h3>
                      <p className="text-dark/70">destek@adgusto.app</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-dark" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">Telefon</h3>                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-dark" />
                    </div>
                    <div>
                      <h3 className="font-medium text-dark">Adres</h3>
                      <p className="text-dark/70">
                        İstanbul, Türkiye
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#e5e5e5] rounded-3xl p-8">
                <h2 className="text-2xl font-light text-dark mb-6">Çalışma Saatleri</h2>
                <div className="space-y-3 text-dark/70">
                  <div className="flex justify-between">
                    <span>Pazartesi - Cuma</span>
                    <span className="font-medium">09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cumartesi</span>
                    <span className="font-medium">10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pazar</span>
                    <span className="font-medium">Kapalı</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white border border-[#e5e5e5] rounded-3xl p-8">
              <h2 className="text-2xl font-light text-dark mb-8">Bize Yazın</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send className="w-8 h-8 text-dark" />
                  </div>
                  <h3 className="text-xl font-medium text-dark mb-4">Mesajınız Gönderildi!</h3>
                  <p className="text-dark/70">
                    En kısa sürede size geri dönüş yapacağız.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
                      {error}
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-dark mb-3">Ad Soyad</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-[#0b0b0b]/20 rounded-2xl focus:ring-2 focus:ring-[#97fa07]/50 focus:border-[#97fa07] transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-dark mb-3">E-posta</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-[#0b0b0b]/20 rounded-2xl focus:ring-2 focus:ring-[#97fa07]/50 focus:border-[#97fa07] transition-all"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Konu</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-[#0b0b0b]/20 rounded-2xl focus:ring-2 focus:ring-[#97fa07]/50 focus:border-[#97fa07] transition-all"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-3">Mesaj</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border border-[#0b0b0b]/20 rounded-2xl focus:ring-2 focus:ring-[#97fa07]/50 focus:border-[#97fa07] transition-all resize-none"
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary hover:bg-primary/90 text-dark font-medium py-4 px-6 rounded-2xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Gönderiliyor...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Mesaj Gönder</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>

      <Footer onShowPage={onShowPage} />
    </div>
  );
};