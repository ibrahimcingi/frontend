import React, { useState } from 'react';
import { 
  Settings, LogOut, User, Menu, X, Home, FileText,
  BookOpen, Lock, Mail, Globe, Key, Tag, Save, 
  CreditCard, Bell, Shield, Trash2, CheckCircle, Eye, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export  function SettingsPage({name,email,wordpressUrl,wordpressUsername,categories}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate=useNavigate()

  // Account Settings
  const [accountData, setAccountData] = useState({
    name: {name},
    email: {email},
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // WordPress Settings
  const [wordpressData, setWordpressData] = useState({
    url: {wordpressUrl},
    username: {wordpressUsername},
    applicationPassword: '••••••••••••',
    categories: categories
  });

  const [newCategory, setNewCategory] = useState('');

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailOnPublish: true,
    weeklyReport: true,
    systemUpdates: false
  });

  // Plan Info (read-only for now)
  const planInfo = {
    name: 'Pro Plan',
    price: '$29/ay',
    features: ['Sınırsız Blog', 'Tüm Kategoriler', 'Öncelikli Destek']
  };

  const handleAccountSave = async () => {
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/UpdateAccount',{
        method:"PUT",
        credentials:'include',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
          name:accountData.name,
          email:accountData.email
        })
      })
      if(response.ok){
      console.log('Account data saved:', accountData);
      setTimeout(() => {
        setIsSaving(false);
        alert('Hesap bilgileri güncellendi!');
      }, 1000);
      }else if(response.status===401){
        navigate('/login')

      }
     
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (accountData.newPassword !== accountData.confirmPassword) {
      alert('Şifreler eşleşmiyor!');
      //think of different animations maybe an error with red text
      return;
    }
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/ChangePassword',{
        method:"PUT",
        credentials:'include',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
          currentPassword:accountData.currentPassword,
          newPassword:accountData.newPassword
        })
      })
      if(response.ok){
        console.log('Password changed');
        setTimeout(() => {
          setIsSaving(false);
          setAccountData({
            ...accountData,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          alert('Şifre başarıyla değiştirildi!');
      }, 1000);

      }else if(response.status===401){
        navigate('/login')
      }
      
    } catch (error) {
      console.error('Password change error:', error);
      setIsSaving(false);
    }
  };

  const handleWordPressSave = async () => {
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/WordpressUpdate',{
        method:"PUT",
        credentials:'include',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
          wordpressUrl:wordpressData.url,
          wordpressUsername:wordpressData.username,
          wordpressPassword:wordpressData.applicationPassword,
          categories:wordpressData.categories
        })
      })
      if(response.ok){
        console.log('WordPress data saved:', wordpressData);
      setTimeout(() => {
        setIsSaving(false);
        alert('WordPress ayarları güncellendi!');
      }, 1000);
    }else if(response.status===401){
      navigate('/login')
    }
 
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !wordpressData.categories.includes(newCategory.trim())) {
      setWordpressData({
        ...wordpressData,
        categories: [...wordpressData.categories, newCategory.trim()]
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (category) => {
    setWordpressData({
      ...wordpressData,
      categories: wordpressData.categories.filter(cat => cat !== category)
    });
  };

  const handleNotificationSave = async () => {
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/WordpressUpdate',{
        method:"PUT",
        credentials:'include',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(notifications)
      })

      if(response.ok){
        console.log('Notifications saved:', notifications);
        setTimeout(() => {
          setIsSaving(false);
          alert('Bildirim ayarları güncellendi!');
        }, 1000);
      }else if(response.status===401){
        navigate('/login')
      }
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  const handleDeleteAccount =async  () => {
    if (confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      console.log('Account deletion requested');

      try{
        const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/users/DeleteAccount',{
          method:"DELETE",
          credentials:'include',
        })
        if(response.ok){
          setTimeout(() => {
            console.log('account deleted')
            alert('Hesabınız Başarıyla Silindi!');
            navigate('/register')
          }, 1000);
        }
      }catch(error){
        console.error('Delete error:', error);

      }

    }
  };

  const handleLogout =async () => {
    console.log('Logout');
    try{
      const response=await fetch('https://autonomous-blog-app-9oron.ondigitalocean.app/api/auth/logout',{
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

  const tabs = [
    { id: 'account', label: 'Hesap', icon: User },
    { id: 'wordpress', label: 'WordPress', icon: Globe },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'plan', label: 'Plan', icon: CreditCard },
    { id: 'security', label: 'Güvenlik', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      
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
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span>Blog Geçmişi</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Ayarlar</span>
          </a>
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{accountData.name}</p>
              <p className="text-xs text-gray-400">{accountData.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors w-full">
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
                <h1 className="text-xl font-bold text-white">Ayarlar</h1>
                <p className="text-sm text-gray-400">Hesap ve uygulama ayarlarınızı yönetin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Tabs Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Hesap Bilgileri</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Ad Soyad</label>
                        <input
                          type="text"
                          value={accountData.name}
                          onChange={(e) => setAccountData({...accountData, name: e.target.value})}
                          className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">E-posta</label>
                        <input
                          type="email"
                          value={accountData.email}
                          onChange={(e) => setAccountData({...accountData, email: e.target.value})}
                          className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <button
                        onClick={handleAccountSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Şifre Değiştir</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Mevcut Şifre</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={accountData.currentPassword}
                            onChange={(e) => setAccountData({...accountData, currentPassword: e.target.value})}
                            className="block w-full px-4 py-3 pr-12 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Yeni Şifre</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={accountData.newPassword}
                            onChange={(e) => setAccountData({...accountData, newPassword: e.target.value})}
                            className="block w-full px-4 py-3 pr-12 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Yeni Şifre Tekrar</label>
                        <input
                          type="password"
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                          className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      </div>

                      <button
                        onClick={handlePasswordChange}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                      >
                        <Lock className="w-4 h-4" />
                        {isSaving ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* WordPress Settings */}
              {activeTab === 'wordpress' && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">WordPress Bağlantısı</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">WordPress URL</label>
                      <input
                        type="url"
                        value={wordpressData.url}
                        onChange={(e) => setWordpressData({...wordpressData, url: e.target.value})}
                        className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Kullanıcı Adı</label>
                      <input
                        type="text"
                        value={wordpressData.username}
                        onChange={(e) => setWordpressData({...wordpressData, username: e.target.value})}
                        className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Application Password</label>
                      <input
                        type="password"
                        value={wordpressData.applicationPassword}
                        onChange={(e) => setWordpressData({...wordpressData, applicationPassword: e.target.value})}
                        className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Kategoriler</label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                          placeholder="Yeni kategori ekle"
                          className="flex-1 px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <button
                          onClick={handleAddCategory}
                          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all"
                        >
                          Ekle
                        </button>
                      </div>
                      
                      {wordpressData.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-gray-600">
                          {wordpressData.categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-lg text-sm"
                            >
                              <Tag className="w-3.5 h-3.5" />
                              {category}
                              <button
                                onClick={() => handleRemoveCategory(category)}
                                className="hover:text-purple-200 transition-colors"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleWordPressSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Bildirim Tercihleri</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Blog Yayınlandığında E-posta</p>
                        <p className="text-sm text-gray-400">Yeni blog yayınlandığında bildirim alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailOnPublish}
                          onChange={(e) => setNotifications({...notifications, emailOnPublish: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Haftalık Rapor</p>
                        <p className="text-sm text-gray-400">Haftalık blog istatistiklerini alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.weeklyReport}
                          onChange={(e) => setNotifications({...notifications, weeklyReport: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">Sistem Güncellemeleri</p>
                        <p className="text-sm text-gray-400">Yeni özellikler ve güncellemeler hakkında bilgi alın</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.systemUpdates}
                          onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <button
                      onClick={handleNotificationSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                  </div>
                </div>
              )}

              {/* Plan */}
              {activeTab === 'plan' && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Mevcut Planınız</h2>
                  
                  <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{planInfo.name}</h3>
                        <p className="text-3xl font-bold text-purple-300">{planInfo.price}</p>
                      </div>
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {planInfo.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-white">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all">
                      Plan Yükselt
                    </button>
                  </div>

                  <p className="text-sm text-gray-400 text-center">
                    Planınızı değiştirmek veya iptal etmek için destek ekibi ile iletişime geçin.
                  </p>
                </div>
              )}

              {/* Security */}
              {activeTab === 'security' && (
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                  <h2 className="text-xl font-bold text-white mb-6">Güvenlik ve Gizlilik</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <h3 className="text-yellow-400 font-semibold mb-2">Hesabı Sil</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        Hesabınızı sildiğinizde tüm verileriniz kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                        Hesabı Sil
                      </button>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <h3 className="text-white font-semibold mb-2">Oturum Geçmişi</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Son giriş: Bugün, 14:30
                      </p>
                      <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                        Tüm cihazlardan çıkış yap →
                      </button>
                    </div>

                    
                  </div>
                </div>
              )}

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
    </div>
  );
}