import React, { useState,useEffect } from 'react';
import { 
  Sparkles, Tag, FileText, LogOut, Settings, User, 
  Menu, X, Home, Clock, CheckCircle, TrendingUp,
  BookOpen, Globe
} from 'lucide-react';

import { useNavigate,useLocation } from "react-router-dom";
import { Root } from '../config.js';

export default function DashBoardPage({name,email,wordpressUrl,categories}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [blogTitle, setBlogTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [userCategories,setUserCategories]=useState([])
  const [recentPosts,setRecentPosts]=useState([])
  const [stats,setStats]=useState([])
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPost, setGeneratedPost] = useState(null);
  const location=useLocation()

  const [error,setError]=useState()

  const navigate=useNavigate()

  const [isLoading,setIsLoading]=useState(true)

  const fetchSummary=async ()=>{
    try{
      const response=await fetch(`${Root}/api/wordpress/summary?wordpressUrl=${wordpressUrl}`,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
        }
      })
  
      const data=await response.json()
      
    
      if(response.ok && data){
        console.log('sucesfully fetched site summary')

        const formattedStats = [
          {
            label: "Toplam Blog",
            value: data.stats.totalPosts || 0,
            icon: BookOpen,
            color: "from-purple-500 to-purple-600",
          },
          {
            label: "Bu Ay",
            value: data.stats.monthlyPosts || 0,
            icon: TrendingUp,
            color: "from-blue-500 to-blue-600",
          },
          {
            label: "Aktif Kategori",
            value: data.stats.activeCategories || 0,
            icon: Tag,
            color: "from-green-500 to-green-600",
          },
          {
            label: "WordPress Sitesi",
            value: 1, // statik olarak 1 siteyi temsil ediyor
            icon: Globe,
            color: "from-orange-500 to-orange-600",
          },
        ];
  
        setUserCategories(categories)
        setRecentPosts(data.recentPosts);
        setStats(formattedStats);

        setIsLoading(false)
      }else{
        console.error('Something went wrong'); 
      }


    }catch(error){
      setError(error)
      console.error("❌ User fetch error:", error);

    }

  }

  useEffect(()=>{
    fetchSummary()
  },[location.pathname,wordpressUrl])
  
  const handleGenerate = async () => {
    if (!selectedCategory) {
      alert('Lütfen bir kategori seçin');
      return;
    }

    setIsGenerating(true);
    
    // Backend API çağrısı
    try {
      const response=await fetch(`${Root}/generate-and-post`,{
        method:"POST",
        credentials:'include',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        category: selectedCategory,
        title: blogTitle || null
             })
      })
      
      console.log('Generating blog:', { category: selectedCategory, title: blogTitle });

      if(response.ok){
        const data=await response.json()
        setTimeout(() => {
          setIsGenerating(false);
          
          // Backend'den gelecek post bilgileri
          const postData = {
            title: data.title,
            url: data.postUrl,
            category: selectedCategory,
            publishDate: new Date().toLocaleString('tr-TR')
          };
          
          setGeneratedPost(postData);
          setShowSuccessModal(true);
          setSelectedCategory('');
          setBlogTitle('');
        }, 3000);
  

      }
    } catch (error) {
      console.error('Generate error:', error);
      setIsGenerating(false);
    }
  };

  const handleLogout =async () => {
    try{
      const response=await fetch(`${Root}/api/auth/logout`,{
        method:"POST",
      })
      if(response.ok){
        console.log('Logout');
        navigate('/login')
      }

    }catch(error){
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

    {isLoading ? (
       <div className="fixed inset-0 flex items-center justify-center z-50">
       <div className="text-center">
         {/* Animated Logo */}
         <div className="relative mb-8">
           <div className="w-32 h-32 border-4 border-purple-500/30 rounded-full"></div>
           <div className="w-32 h-32 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
           <div className="w-24 h-24 border-4 border-blue-500/30 rounded-full absolute top-4 left-4"></div>
           <div className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-4 left-4" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
           <div className="absolute inset-0 flex items-center justify-center">
             <BookOpen className="w-12 h-12 text-white animate-pulse" />
           </div>
         </div>

         {/* Loading Text */}
         <h2 className="text-2xl font-bold text-white mb-3">AutoBlog Yükleniyor</h2>
         <p className="text-gray-400 mb-6">Dashboard hazırlanıyor...</p>

         {/* Animated Dots */}
         <div className="flex items-center justify-center gap-2">
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
           <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
         </div>

         {/* Loading Bar */}
         <div className="mt-8 w-64 h-1.5 bg-slate-700 rounded-full overflow-hidden mx-auto">
           <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
         </div>
       </div>
     </div>
    ):(
      <>
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AutoBlog</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span className="font-medium">Ana Sayfa</span>
          </a>
          <a href="http://localhost:5173/BlogHistory" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span>Blog Geçmişi</span>
          </a>
          <a href="http://localhost:5173/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span>Ayarlar</span>
          </a>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors w-full cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        
        {/* Top Bar */}
        <header className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <p className="text-gray-400 text-sm">Hoş geldiniz,</p>
                <p className="text-white font-semibold">{name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Blog Generator */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            
            {/* Generator Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Blog Oluştur</h2>
              </div>

              {!isGenerating ? (
                <div className="space-y-5">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Kategori Seçin <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-slate-800">Kategori seçin...</option>
                        {userCategories.map((cat, index) => (
                          <option key={index} value={cat} className="bg-slate-800">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Blog Title (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Blog Başlığı <span className="text-gray-500 text-xs">(Opsiyonel)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        placeholder="Boş bırakırsanız otomatik oluşturulur"
                        className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!selectedCategory}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Blog Oluştur
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    AI ile oluşturulan blog otomatik olarak WordPress sitenize yayınlanacaktır.
                  </p>
                </div>
              ) : (
                // Loading Animation
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 border-4 border-purple-500/30 rounded-full"></div>
                    <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-10 h-10 text-purple-400 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Blog Oluşturuluyor...</h3>
                  <p className="text-gray-400 text-center mb-4">AI blogunuzu yazıyor, lütfen bekleyin</p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-6">Bu işlem 1-2 dakika sürebilir</p>
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Son Bloglar</h2>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-medium text-sm line-clamp-1">{post.title}</h3>
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 ml-2" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md">{post.category}</span>
                      <span className="text-gray-400">{post.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={()=>navigate('/BlogHistory')} className="w-full mt-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                Tümünü Görüntüle →
              </button>
            </div>
          </div>

        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
        ></div>
      )}
      </>
      
    )}

    {/* Success Modal */}
    {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            
            {/* Success Icon with Animation */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                {/* Confetti Effect */}
                <div className="absolute -top-2 -left-2 w-3 h-3 bg-purple-500 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-yellow-500 rounded-full animate-ping" style={{ animationDelay: '0.6s' }}></div>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="text-2xl font-bold text-white text-center mb-2">
              🎉 Blog Yayınlandı!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Blog başarıyla oluşturuldu ve WordPress sitenize yayınlandı
            </p>

            {/* Post Details */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Başlık</p>
                <p className="text-white font-medium">{generatedPost?.title}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Kategori</p>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm">
                  <Tag className="w-3 h-3" />
                  {generatedPost?.category}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Yayın Tarihi</p>
                <p className="text-white text-sm">{generatedPost?.publishDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <a
                href={generatedPost?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Globe className="w-5 h-5" />
                Blogu Görüntüle
              </a>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      
      

    </div>
  );
}