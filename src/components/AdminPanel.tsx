import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  LogOut, 
  Settings, 
  FileText, 
  Users, 
  BarChart3,
  Save,
  Plus,
  Trash2,
  Edit
} from 'lucide-react';

interface AdminPanelProps {
  onGoHome: () => void;
  onLogout: () => void;
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

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  onGoHome, 
  onLogout, 
  userEmail 
}) => {
  const [activeTab, setActiveTab] = useState<'blog' | 'pages' | 'settings'>('blog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('adgusto_blog_posts');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });

  const saveBlogPosts = (posts: BlogPost[]) => {
    setBlogPosts(posts);
    localStorage.setItem('adgusto_blog_posts', JSON.stringify(posts));
  };

  const handleSavePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: BlogPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      excerpt: newPost.excerpt || newPost.content.substring(0, 150) + '...',
      createdAt: new Date().toISOString(),
      published: newPost.published
    };

    saveBlogPosts([post, ...blogPosts]);
    setNewPost({ title: '', content: '', excerpt: '', published: false });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;

    const updatedPosts = blogPosts.map(post => 
      post.id === editingPost.id ? editingPost : post
    );
    saveBlogPosts(updatedPosts);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('Bu blog yazısını silmek istediğinizden emin misiniz?')) {
      saveBlogPosts(blogPosts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={onGoHome}
            className="inline-flex items-center space-x-2 text-[#334155] hover:text-[#0f172a] transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Dashboard'a Dön</span>
          </button>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={onGoHome}>
              <div className="w-8 h-8 bg-[#52e9aa] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-light text-[#0f172a] group-hover:text-[#52e9aa] transition-colors">AdGusto</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-[#334155]">{userEmail}</span>
              <button
                onClick={onLogout}
                className="text-[#334155] hover:text-[#0f172a] transition-colors p-2 rounded-2xl hover:bg-white/50"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#52e9aa]/10 border border-[#52e9aa]/20 rounded-full px-4 py-2 mb-8">
            <Settings className="w-4 h-4 text-[#52e9aa]" />
            <span className="text-[#52e9aa] text-sm font-medium">Admin Paneli</span>
          </div>
          
          <h1 className="text-4xl font-light text-[#0f172a] mb-6 leading-tight tracking-tight">
            Yönetim
            <br />
            <span className="text-[#52e9aa] font-medium">paneli</span>
          </h1>
          
          <p className="text-lg text-[#334155] max-w-2xl mx-auto leading-relaxed">
            Site içeriğini ve ayarları yönetin
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex space-x-1 bg-white border border-[#e2e8f0] rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
                activeTab === 'blog' 
                  ? 'bg-[#52e9aa] text-white shadow-sm' 
                  : 'text-[#334155] hover:bg-[#f8fafc]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Blog Yönetimi</span>
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
                activeTab === 'pages' 
                  ? 'bg-[#52e9aa] text-white shadow-sm' 
                  : 'text-[#334155] hover:bg-[#f8fafc]'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Sayfa Yönetimi</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-xl transition-all ${
                activeTab === 'settings' 
                  ? 'bg-[#52e9aa] text-white shadow-sm' 
                  : 'text-[#334155] hover:bg-[#f8fafc]'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Ayarlar</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto">
          
          {/* Blog Management */}
          {activeTab === 'blog' && (
            <div className="space-y-8">
              
              {/* New Post Form */}
              <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8">
                <h2 className="text-2xl font-light text-[#0f172a] mb-8">
                  {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı'}
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-3">Başlık</label>
                    <input
                      type="text"
                      value={editingPost ? editingPost.title : newPost.title}
                      onChange={(e) => editingPost 
                        ? setEditingPost({...editingPost, title: e.target.value})
                        : setNewPost({...newPost, title: e.target.value})
                      }
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all"
                      placeholder="Blog yazısı başlığı..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-3">Özet</label>
                    <input
                      type="text"
                      value={editingPost ? editingPost.excerpt : newPost.excerpt}
                      onChange={(e) => editingPost 
                        ? setEditingPost({...editingPost, excerpt: e.target.value})
                        : setNewPost({...newPost, excerpt: e.target.value})
                      }
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all"
                      placeholder="Kısa özet..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#0f172a] mb-3">İçerik</label>
                    <textarea
                      value={editingPost ? editingPost.content : newPost.content}
                      onChange={(e) => editingPost 
                        ? setEditingPost({...editingPost, content: e.target.value})
                        : setNewPost({...newPost, content: e.target.value})
                      }
                      rows={12}
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all resize-none"
                      placeholder="Blog yazısı içeriği..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPost ? editingPost.published : newPost.published}
                        onChange={(e) => editingPost 
                          ? setEditingPost({...editingPost, published: e.target.checked})
                          : setNewPost({...newPost, published: e.target.checked})
                        }
                        className="w-4 h-4 text-[#52e9aa] border-[#e2e8f0] rounded focus:ring-[#52e9aa]/20"
                      />
                      <span className="text-[#334155]">Yayınla</span>
                    </label>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={editingPost ? handleUpdatePost : handleSavePost}
                      className="flex items-center space-x-2 bg-[#52e9aa] hover:bg-[#52e9aa]/90 text-white px-6 py-3 rounded-2xl transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>{editingPost ? 'Güncelle' : 'Kaydet'}</span>
                    </button>
                    
                    {editingPost && (
                      <button
                        onClick={() => setEditingPost(null)}
                        className="flex items-center space-x-2 border border-[#e2e8f0] text-[#334155] px-6 py-3 rounded-2xl hover:bg-[#f8fafc] transition-all"
                      >
                        <span>İptal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Blog Posts List */}
              <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8">
                <h2 className="text-2xl font-light text-[#0f172a] mb-8">Blog Yazıları</h2>
                
                {blogPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-[#334155] mx-auto mb-4" />
                    <p className="text-[#334155]">Henüz blog yazısı yok</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="border border-[#e2e8f0] rounded-2xl p-6 hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-medium text-[#0f172a]">{post.title}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.published 
                                  ? 'bg-[#52e9aa]/10 text-[#52e9aa] border border-[#52e9aa]/20' 
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}>
                                {post.published ? 'Yayında' : 'Taslak'}
                              </span>
                            </div>
                            <p className="text-[#334155] text-sm">{post.excerpt}</p>
                            <p className="text-xs text-[#334155] mt-2">
                              {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setEditingPost(post)}
                              className="p-2 text-[#334155] hover:text-[#52e9aa] hover:bg-[#f8fafc] rounded-xl transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-[#334155] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Page Management */}
          {activeTab === 'pages' && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8">
              <h2 className="text-2xl font-light text-[#0f172a] mb-8">Sayfa Yönetimi</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-[#e2e8f0] rounded-2xl p-6">
                  <h3 className="font-medium text-[#0f172a] mb-4">Hakkımızda Sayfası</h3>
                  <p className="text-[#334155] text-sm mb-4">Şirket bilgileri ve misyon</p>
                  <button className="text-[#52e9aa] hover:text-[#52e9aa]/80 text-sm font-medium">
                    Düzenle →
                  </button>
                </div>
                
                <div className="border border-[#e2e8f0] rounded-2xl p-6">
                  <h3 className="font-medium text-[#0f172a] mb-4">İletişim Sayfası</h3>
                  <p className="text-[#334155] text-sm mb-4">İletişim bilgileri ve form</p>
                  <button className="text-[#52e9aa] hover:text-[#52e9aa]/80 text-sm font-medium">
                    Düzenle →
                  </button>
                </div>
                
                <div className="border border-[#e2e8f0] rounded-2xl p-6">
                  <h3 className="font-medium text-[#0f172a] mb-4">Gizlilik Politikası</h3>
                  <p className="text-[#334155] text-sm mb-4">KVKK ve gizlilik metni</p>
                  <button className="text-[#52e9aa] hover:text-[#52e9aa]/80 text-sm font-medium">
                    Düzenle →
                  </button>
                </div>
                
                <div className="border border-[#e2e8f0] rounded-2xl p-6">
                  <h3 className="font-medium text-[#0f172a] mb-4">Dokümantasyon</h3>
                  <p className="text-[#334155] text-sm mb-4">Ürün kullanım kılavuzu</p>
                  <button className="text-[#52e9aa] hover:text-[#52e9aa]/80 text-sm font-medium">
                    Düzenle →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Settings */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#e2e8f0] rounded-3xl p-8">
              <h2 className="text-2xl font-light text-[#0f172a] mb-8">Genel Ayarlar</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-medium text-[#0f172a] mb-4">Site Ayarları</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-2">Site Başlığı</label>
                      <input
                        type="text"
                        defaultValue="AdGusto - AI Destekli Reklam Stratejisi"
                        className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#334155] mb-2">Site Açıklaması</label>
                      <input
                        type="text"
                        defaultValue="AI destekli pazarlama analizi ve reklam stratejisi"
                        className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-[#0f172a] mb-4">API Ayarları</h3>
                  <div>
                    <label className="block text-sm font-medium text-[#334155] mb-2">Groq API Anahtarı</label>
                    <input
                      type="password"
                      defaultValue="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"
                      className="w-full px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl focus:ring-2 focus:ring-[#52e9aa]/20 focus:border-[#52e9aa] transition-all"
                    />
                  </div>
                </div>
                
                <button className="flex items-center space-x-2 bg-[#52e9aa] hover:bg-[#52e9aa]/90 text-white px-6 py-3 rounded-2xl transition-all">
                  <Save className="w-4 h-4" />
                  <span>Ayarları Kaydet</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};