import React, { useState,useEffect } from 'react';
import { 
  Settings, LogOut, User, Menu, X, Home, FileText,
  BookOpen, Lock, Mail, Globe, Key, Tag, Save, 
  CreditCard, Bell, Shield, Trash2, CheckCircle, Eye, EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Root } from '../config.js';
import { useUser } from '../context/UserContext.jsx';

export  function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm,setShowNewPasswordConfirm]=useState(false)
  const [showSuccessMessage,setShowSuccessMessage]=useState(false)
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate=useNavigate()
  const { user, loading } = useUser();

  
  // Account Settings
  const [accountData, setAccountData] = useState({
    name: user?.name,
    email: user?.email,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // WordPress Settings
  const [wordpressData, setWordpressData] = useState({
    url: user?.wordpressUrl,
    username: user?.wordpressUser,
    applicationPassword: '',
  });


  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailOnPublish: user?.notifications.emailOnPublish,
    weeklyReport: user?.notifications.weeklyReport,
    systemUpdates: user?.notifications.systemUpdates
  });

  // Plan Info (read-only for now)
  const [planInfo,setPlanInfo] =useState({
    name: `${user?.currentPlan.name} Plan`,
    price: user?.billingCycle==='monthly' ? `$${user?.currentPlan.monthlyPrice}/ay`:`$${user?.currentPlan.yearlyPrice}/yıl`,
    features: user?.currentPlan.features
  }) ;


  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000); // animasyon süresi kadar (5 saniye)
  
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);



  useEffect(() => {
    if (loading || !user) return;

    console.log(user.loginHistory)

    console.log(user.loginHistory)
    
    setAccountData(prev => ({
      name: prev.name || user.name || '',
      email: prev.email || user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  
    setWordpressData(prev => ({
      ...prev,
      url: prev.url || user.wordpressUrl || '',
      username: prev.username || user.wordpressUser || '',
    }));
  
    setNotifications(prev => ({
      emailOnPublish:
        typeof prev.emailOnPublish === 'boolean'
          ? prev.emailOnPublish
          : user.notifications?.emailOnPublish || false,
      weeklyReport:
        typeof prev.weeklyReport === 'boolean'
          ? prev.weeklyReport
          : user.notifications?.weeklyReport || false,
      systemUpdates:
        typeof prev.systemUpdates === 'boolean'
          ? prev.systemUpdates
          : user.notifications?.systemUpdates || false,
    }));

    setPlanInfo(prev=>({
      name:prev.name || `${user.currentPlan.name} Plan`,
      price:prev.price || user.billingCycle==='monthly' ? `$${user?.currentPlan.monthlyPrice}/ay`:`$${user?.currentPlan.yearlyPrice}/yıl` ,
      features:prev.features || user.currentPlan.features
    }))
  }, [loading, user]);
  

  const handleAccountSave = async () => {
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch(`${Root}/api/users/UpdateAccount`,{
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
        setShowSuccessMessage(true)
        setSuccessMessage('Hesap bilgileri başarıyla güncellendi')
        
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
      const response=await fetch(`${Root}/api/users/ChangePassword`,{
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
          setShowSuccessMessage(true)
          setSuccessMessage('Şifreniz başarıyla değiştirildi')
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
      const response=await fetch(`${Root}/api/users/WordpressUpdate`,{
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
        setShowSuccessMessage(true)
        setSuccessMessage('Wordpress bilgileri başarıyla güncellendi')
      }, 1000);
    }else if(response.status===401){
      navigate('/login')
    }
 
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };

  

  const handleNotificationSave = async () => {
    setIsSaving(true);
    // Backend API call
    try {
      const response=await fetch(`${Root}/api/users/WordpressUpdate`,{
        method:"PUT",
        credentials:'include',
        headers:{"Content-type":"application/json"},
        body:JSON.stringify(notifications)
      })

      if(response.ok){
        console.log('Notifications saved:', notifications);
        setTimeout(() => {
          setIsSaving(false);
          setShowSuccessMessage(true)
          setSuccessMessage('Bildirim ayarları başarıyla güncellendi')
        }, 1000);
      }else if(response.status===401){
        navigate('/login')
      }
    } catch (error) {
      console.error('Save error:', error);
      setIsSaving(false);
    }
  };


  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    console.log('Account deletion confirmed');
    setShowDeleteModal(false);
    if (confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
      console.log('Account deletion requested');

      try{
        const response=await fetch(`${Root}/api/users/DeleteAccount`,{
          method:"DELETE",
          credentials:'include',
        })
        if(response.ok){
          setTimeout(() => {
            console.log('account deleted')
            alert('Hesabınız Başarıyla Silindi!');
            navigate('/login')
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

  const handleLogoutAll=async ()=>{
    console.log('Handling logout all')
    try{
      const response=await fetch(`${Root}/api/auth/logoutAll`,{
        method:"POST",
        credentials:'include',
      })

      if(response.ok){
        console.log('Logout');
        navigate('/login')
      }
    }catch(error){
      console.error("LogoutAll error:", error);

    }
  }

  const tabs = [
    { id: 'account', label: 'Hesap', icon: User },
    { id: 'wordpress', label: 'WordPress', icon: Globe },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'plan', label: 'Plan', icon: CreditCard },
    { id: 'security', label: 'Güvenlik', icon: Shield }
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {loading ? (
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
          <a href="https://haveai.online" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </a>
          <a href="https://haveai.online/BlogHistory" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
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
                            autoComplete="new-password"
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

                        <div className='relative'>
                        <input
                          type={showNewPasswordConfirm ? 'text':'password'}
                          value={accountData.confirmPassword}
                          onChange={(e) => setAccountData({...accountData, confirmPassword: e.target.value})}
                          className="block w-full px-4 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showNewPasswordConfirm ? (
                              <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                            )}
                          </button>

                        </div>
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

                    <button onClick={()=>navigate('/PlansPage')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all">
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
                      <h3 className="text-white font-semibold mb-3">Oturum Geçmişi</h3>

                      {user.loginHistory && user.loginHistory.length > 0 ? (
                        <div className="space-y-3">
                          {user.loginHistory
                            .slice()                          // copy
                            .sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt)) // son giriş en üstte
                            .map(h => (
                              <div
                                key={h.loggedAt}
                                className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
                              >
                                <div>
                                  <p className="text-white font-medium">
                                    {h.deviceType ? h.deviceType.toUpperCase() : "CİHAZ"} • {h.browser || "Browser"}
                                  </p>
                                  <p className="text-gray-400 text-sm">
                                    {h.city || "—"}, {h.country || "—"}
                                  </p>
                                </div>

                                <p className="text-gray-300 text-sm">
                                  {new Date(h.loggedAt).toLocaleString()}
                                </p>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">Henüz oturum geçmişi yok.</p>
                      )}

                      <button
                        onClick={handleLogoutAll}
                        className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
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
      {/* Success Toast Notification */}
      {showSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-2xl p-4 pr-12 min-w-[320px] max-w-md border border-green-400/30 backdrop-blur-lg">
            <div className="flex items-start gap-3">
              {/* Success Icon with Animation */}
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce-slow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Başarılı!</h4>
                <p className="text-sm text-green-50">{successMessage}</p>
              </div>

              {/* Close Button */}
              <button
                onClick={() =>{
                  setShowSuccessMessage(false)
                } }
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-xl overflow-hidden">
              <div className="h-full bg-white/60 animate-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            
            {/* Warning Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                {/* Pulse effect */}
                <div className="absolute inset-0 w-20 h-20 bg-red-500/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl font-bold text-white text-center mb-3">
              Hesabı Sil
            </h3>
            <p className="text-gray-400 text-center mb-6">
              Hesabınızı silmek istediğinize emin misiniz? 
            </p>

            {/* Warning List */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <p className="text-red-400 font-semibold mb-3 text-sm">⚠️ Bu işlem geri alınamaz ve şunlar silinecek:</p>
              <ul className="space-y-2 text-sm text-red-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  Tüm blog geçmişiniz
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  WordPress bağlantı bilgileriniz
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                  Tüm kişisel verileriniz
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Hesabı Sil
              </button>
            </div>
          </div>
        </div>
      )}

<style>{`
  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes bounce-slow {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  @keyframes progress {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
  }

  .animate-slide-in { animation: slide-in 0.3s ease-out; }
  .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
  .animate-progress { animation: progress 5s linear forwards; }
`}</style>


     
        </>
      ) }
    </div>
  );
}