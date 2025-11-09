import React, { useState } from 'react';
import { Globe, Key, Tag, CheckCircle, AlertCircle, Info, ExternalLink,Eye,EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Root } from '../config.js';
import { useUser } from '../context/UserContext.jsx';

export  function WordPressConnectionPage() {
  const [formData, setFormData] = useState({
    wordpressUrl: '',
    wordpressUsername: '',
    applicationPassword: '',
    categories: []
  });
  const [categoryInput, setCategoryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'success', 'error'

  const {setReady}=useUser()

  
  const [showPassword,setShowPassword]=useState(false)
  const navigate=useNavigate()

  const handleChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(cat => cat !== categoryToRemove)
    });
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    setConnectionStatus(null);
    
    // Backend API çağrısı - Bağlantıyı test et
    try {
      const response=await fetch(`${Root}/api/wordpress/testConnection`,{
        method: 'POST',
        credentials: "include",
           headers: { 
             'Content-Type': 'application/json'},
             body:JSON.stringify({
              wordpressUrl:formData.wordpressUrl,
              wordpressUser:formData.wordpressUsername,
              wordpressPassword:formData.applicationPassword
             })
      })
      console.log('Testing connection:', formData);

      if(response.ok){
        setTimeout(() => {
          setIsLoading(false);
          setConnectionStatus('success');
        }, 2000);
      }else{
        const errorText = await response.text();
        throw new Error(`HTTP Error ${response.status}: ${errorText}`);

      }
      
    } catch (error) {
      console.error('Connection test error:', error);
      setIsLoading(false);
      setConnectionStatus('error');
    }
  };

  const handleSaveConnection = async () => {
    setIsLoading(true);
    if(connectionStatus==='success'){
    try {
      const response=await fetch(`${Root}/api/wordpress/save`,{
        method:"POST",
        credentials:'include',
        headers:{'Content-Type': 'application/json',},
        body: JSON.stringify(formData)
      })
      
      console.log('Saving WordPress connection:', formData);

      const data = await response.json(); // 👈 body'yi JSON olarak oku

      console.log('Response status:', response.status);
      console.log('Response data:', data);

      if(response.ok){
        setTimeout(async () => {
          await setReady(true)
          setIsLoading(false);
          alert('WordPress bağlantısı başarıyla kaydedildi!');
          navigate('/')
        }, 2000);
      }else if(response.status===401){
        navigate('/login')
      }
      
    } catch (error) {
      console.error('Save connection error:', error);
      setIsLoading(false);
    }
  };

    }
    
    

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-2xl">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">WordPress Bağlantısı</h1>
            <p className="text-gray-300">Otonom blog yazma için WordPress sitenizi bağlayın</p>
          </div>

          {/* Info Box */}
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-300">
              <p className="font-medium text-blue-300 mb-1">WordPress Application Password Nasıl Alınır?</p>
              <p className="text-xs">WordPress Admin Panel → Kullanıcılar → Profil → Application Passwords bölümünden yeni bir uygulama şifresi oluşturabilirsiniz.</p>
              <a href="https://wordpress.org/support/article/application-passwords/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1 mt-2 transition-colors">
                Detaylı bilgi <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {/* WordPress URL */}
            <div>
              <label htmlFor="wordpressUrl" className="block text-sm font-medium text-gray-200 mb-2">
                WordPress Site URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="wordpressUrl"
                  name="wordpressUrl"
                  type="url"
                  value={formData.wordpressUrl}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="https://example.com"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">WordPress sitenizin tam URL'sini girin</p>
            </div>


            {/* WordPress Username */}
            <div>
              <label htmlFor="wordpressUsername" className="block text-sm font-medium text-gray-200 mb-2">
                WordPress Kullanıcı Adı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="wordpressUsername"
                  name="wordpressUsername"
                  type="text"
                  value={formData.wordpressUsername}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="admin"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">WordPress admin kullanıcı adınız</p>
            </div>

            

            {/* Application Password */}
            <div>
              <label htmlFor="applicationPassword" className="block text-sm font-medium text-gray-200 mb-2">
                Application Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="applicationPassword"
                  name="applicationPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.applicationPassword}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm"
                  placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                />
                <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">WordPress'ten aldığınız Application Password'ü girin</p>
            </div>

           

            {/* Test Connection Button */}
            <button
              onClick={handleTestConnection}
              disabled={isLoading || !formData.wordpressUrl || !formData.wordpressUsername || !formData.applicationPassword}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Bağlantı test ediliyor...
                </>
              ) : (
                <>
                  <Globe className="w-5 h-5" />
                  Bağlantıyı Test Et
                </>
              )}
            </button>

            {/* Connection Status */}
            {connectionStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="text-sm text-green-300">
                  <p className="font-medium">Bağlantı Başarılı!</p>
                  <p className="text-xs text-green-400 mt-0.5">WordPress sitenize başarıyla bağlandık.</p>
                </div>
              </div>
            )}

            {connectionStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="text-sm text-red-300">
                  <p className="font-medium">Bağlantı Hatası!</p>
                  <p className="text-xs text-red-400 mt-0.5">Lütfen URL ve Application Password bilgilerinizi kontrol edin.</p>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/50 text-gray-300 rounded-full">Kategoriler</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label htmlFor="categories" className="block text-sm font-medium text-gray-200 mb-2">
                Blog Kategorileri
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="categories"
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory(e);
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Kategori adı girin"
                  />
                </div>
                <button
                  onClick={handleAddCategory}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-200"
                >
                  Ekle
                </button>
              </div>
              
              {/* Category Tags */}
              {formData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-white/5 rounded-xl border border-gray-600">
                  {formData.categories.map((category, index) => (
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
              
              <p className="mt-2 text-xs text-gray-400">
                Otonom blogların yayınlanacağı kategorileri ekleyin. Enter tuşu ile de ekleyebilirsiniz.
              </p>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveConnection}
              disabled={isLoading || !formData.wordpressUrl || !formData.wordpressUsername || !formData.applicationPassword || formData.categories.length === 0 || connectionStatus!=='success'}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Kaydediliyor...
                </div>
              ) : (
                'Kaydet ve Devam Et'
              )}
            </button>

            
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2025 haveAI. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}