import React from 'react';
import { Footer } from './Footer';
import { ArrowLeft, Sparkles, LogOut, Calendar, User } from 'lucide-react';

interface BlogPageProps {
  onGoHome: () => void;
  onShowPage: (page: string) => void;
  onLogout?: () => void;
  userEmail?: string;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  createdAt: string;
  published: boolean;
}

export const BlogPage: React.FC<BlogPageProps> = ({ 
  onGoHome, 
  onShowPage, 
  onLogout, 
  userEmail 
}) => {
  const [blogPosts] = React.useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('adgusto_blog_posts');
    const posts = saved ? JSON.parse(saved) : [];
    return posts.filter((post: BlogPost) => post.published);
  });

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 text-[#334155] hover:text-[#0f172a] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Geri</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={onGoHome}>
              <span className="text-2xl font-light text-[#0c4650] hover:text-[#94fa01] transition-colors">AdGusto</span>
            </div>
            
            {userEmail && onLogout && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-[#334155]">{userEmail}</span>
                <button
                  onClick={onLogout}
                  className="text-[#334155] hover:text-[#0f172a] transition-colors p-2 rounded-2xl hover:bg-white/50"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-light text-[#0f172a] mb-8 leading-tight tracking-tight">
            Blog
          </h1>
          <p className="text-xl text-[#334155] max-w-2xl mx-auto leading-relaxed">
            Dijital pazarlama dünyasından güncel haberler, ipuçları ve stratejiler
          </p>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto">
          {blogPosts.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-16 text-center">
              <div className="w-16 h-16 bg-[#52e9aa]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#52e9aa]" />
              </div>
              <h3 className="text-2xl font-light text-[#0f172a] mb-4">Yakında</h3>
              <p className="text-[#334155] leading-relaxed">
                Blog yazılarımız çok yakında yayında olacak. Dijital pazarlama dünyasından 
                en güncel içerikleri takip etmek için bizi izlemeye devam edin.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {blogPosts.map((post) => (
                <article key={post.id} className="bg-white border border-[#e2e8f0] rounded-3xl p-10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2 text-[#334155] text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[#334155] text-sm">
                      <User className="w-4 h-4" />
                      <span>AdGusto Ekibi</span>
                    </div>
                  </div>
                  
                  <h2 className="text-3xl font-light text-[#0f172a] mb-4 group-hover:text-[#52e9aa] transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-[#334155] leading-relaxed mb-6 text-lg">
                    {post.excerpt}
                  </p>
                  
                  <div className="prose prose-lg max-w-none text-[#334155] leading-relaxed">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <Footer onShowPage={onShowPage} />
        {/* Footer */}
        <footer className="mt-20 pt-16 border-t border-[#e2e8f0]">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4 cursor-pointer" onClick={onGoHome}>
                <span className="text-xl font-semibold text-[#0c4650]">AdGusto</span>
              </div>
              <p className="text-[#0c4650]/70 leading-relaxed">
                AI destekli pazarlama analizi ile işletmenizi büyütün
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-[#0c4650] mb-4">Ürün</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('features')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">Özellikler</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0c4650] mb-4">Şirket</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('about')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">Hakkımızda</button></li>
                <li><button onClick={() => onShowPage('blog')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">Blog</button></li>
                <li><button onClick={() => onShowPage('contact')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">İletişim</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-[#0c4650] mb-4">Kaynaklar</h4>
              <ul className="space-y-3">
                <li><button onClick={() => onShowPage('documentation')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">Dokümantasyon</button></li>
                <li><button onClick={() => onShowPage('privacy')} className="text-[#0c4650]/70 hover:text-[#0c4650] transition-colors hover:translate-x-1 inline-block">Gizlilik</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-[#0c4650]/60 text-sm">
              © 2025 AdGusto. Tüm hakları saklıdır.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};