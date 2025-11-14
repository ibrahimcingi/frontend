import React, { useState,useEffect } from 'react';
import { 
  FileText, LogOut, Settings, User, Menu, X, Home, 
  BookOpen, ExternalLink, Calendar, Tag, Search, 
  Filter, TrendingUp, Clock, Eye
} from 'lucide-react';

import { useNavigate } from "react-router-dom";
import { Root } from '../config.js';
import { useUser } from '../context/UserContext.jsx';

export  function BlogHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [blogPosts,setBlogPosts]=useState([]);
  const [categories,setCategories]=useState()
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading } = useUser();


  const navigate=useNavigate()

  const fetchBlogPosts=async ()=>{
    try{
      const response=await fetch(`${Root}/api/wordpress/BlogPosts?wordpressUrl=${user.wordpressUrl}`,{
        method:"GET",
        headers:{"Content-type":"application/json"},
        credentials:'include'
      })

      const data=await response.json()
      

  
      if(response.ok && data.BlogPosts){
        setBlogPosts(data.BlogPosts)
        setIsLoading(false)
      }

    }catch(error){
      console.error("Fetch error:", error);
    }
  }

  useEffect(()=>{
    if(!loading){
      setCategories(user.categories)
      fetchBlogPosts()
    }
  },[isLoading,loading])



  // Filtreleme
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout =async  () => {
    try{
      const response=await fetch(`${Root}/api/auth/logout`,{
        method:"POST",
        credentials:"include"
      })
      if(response.ok){
        console.log('Logout');
        navigate('/login')
      }

    }catch(error){
      console.error("Logout error:", error);
    }
   
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Teknoloji': 'bg-purple-500/20 text-purple-300',
      'Sağlık': 'bg-green-500/20 text-green-300',
      'Eğitim': 'bg-blue-500/20 text-blue-300',
      'Finans': 'bg-yellow-500/20 text-yellow-300',
      'Seyahat': 'bg-orange-500/20 text-orange-300',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-300';
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
         <p className="text-gray-400 mb-6">Postlar hazırlanıyor...</p>

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
          <a href="https://haveai.online/Dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span className="font-medium">Blog Geçmişi</span>
          </a>
          <a href="https://haveai.online/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
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
              <p className="text-sm font-medium text-white">{user.name}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
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
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Blog Geçmişi</h1>
                <p className="text-sm text-gray-400">Tüm yayınlanan bloglarınız</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          
          

          {/* Filters */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Blog ara..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  <option value="all" className="bg-slate-800">Tüm Kategoriler</option>
                  {categories?.filter(cat => cat !== 'all').map((cat, index) => (
                    <option key={index} value={cat} className="bg-slate-800">{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div key={post.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {post.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${getCategoryColor(post.category)}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Blogu Görüntüle
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Blog Bulunamadı</h3>
                <p className="text-gray-400">Arama kriterlerinize uygun blog bulunamadı.</p>
              </div>
            )}
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
    )
  }
    </div>
  );
}