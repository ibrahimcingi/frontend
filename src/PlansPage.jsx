import React, { useEffect, useState } from 'react';
import { 
  Settings, LogOut, User, Menu, X, Home, FileText,
  BookOpen, Check, Sparkles, Zap, Crown, ArrowRight,
  CreditCard
} from 'lucide-react';
import { Root } from '../config';
import { useUser } from '../context/UserContext';

export  function PlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showSuccessMessage,setShowSuccessMessage]=useState(false)
  const [currentPlan,setCurrentPlan]=useState({})

  const {user,loading}=useUser()

  useEffect(()=>{
    if(showSuccessMessage){
      setTimeout(()=>{
        setShowSuccessMessage(false)
        alert('Ödeme sayfasına yönlendiriliyorsunuz...');
        //redirect to payment page
      },5000)
    }
  },[showSuccessMessage])

  // Kullanıcının mevcut planı (backend'den gelecek)
  useEffect(()=>{
    if(!loading){
      setCurrentPlan(user.currentPlan)
    }
  },[loading])

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: BookOpen,
      description: 'Başlamak için ideal',
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: 'from-gray-600 to-gray-700',
      popular: false,
      features: [
        '5 Blog/Ay',
        '2 Kategori',
        'Temel AI Özellikleri',
        'Email Desteği',
        'WordPress Entegrasyonu'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      description: 'Profesyoneller için',
      monthlyPrice: 29,
      yearlyPrice: 290,
      color: 'from-purple-600 to-blue-600',
      popular: true,
      features: [
        'Sınırsız Blog',
        'Sınırsız Kategori',
        'Gelişmiş AI Özellikleri',
        'Öncelikli Destek',
        'WordPress Entegrasyonu',
        'SEO Optimizasyonu',
        'Analitik Dashboard'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      description: 'Büyük takımlar için',
      monthlyPrice: 99,
      yearlyPrice: 990,
      color: 'from-orange-600 to-red-600',
      popular: false,
      features: [
        'Sınırsız Blog',
        'Sınırsız Kategori',
        'Özel AI Modeli',
        '7/24 Destek',
        'Çoklu WordPress Siteleri',
        'Özel SEO Stratejileri',
        'Gelişmiş Analitik',
        'API Erişimi',
        'Özel Eğitim'
      ]
    }
  ];

  const handleSelectPlan = (planId) => {
    const plan = plans.find(p => p.id === planId)
    setSelectedPlan(plan);
    console.log('selected plan!',plan)
  };

  const handleUpgrade = async () => {
    if (!selectedPlan && selectedPlan.id ==='free') return;

    try{
      const response=await fetch(`${Root}/api/users/PlanUpdate`,{
        method:"PUT",
        credentials:'include',
        headers:{
          "Content-type":"application/json"
        },
        body:JSON.stringify({
          SelectedPlan:selectedPlan,
          billingCycle:billingCycle
        })
      })
      if(response.ok){
        setTimeout(()=>{
          setShowSuccessMessage(true)
          console.log('Selected plan:', selectedPlan, 'Billing cycle:', billingCycle);
        },200)
      }  

    }catch(error){
      //again consider showing a toast
      console.error(error)
    }
    
  };

  const handleLogout =async () => {
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

  const getPrice = (plan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPriceDisplay = (plan) => {
    const price = getPrice(plan);
    if (price === 0) return 'Ücretsiz';
    return billingCycle === 'monthly' ? `$${price}/ay` : `$${price}/yıl`;
  };

  const getSavingsPercent = (plan) => {
    if (plan.monthlyPrice === 0) return 0;
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = ((monthlyCost - plan.yearlyPrice) / monthlyCost) * 100;
    return Math.round(savings);
  };

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
          <a href="https://haveai.online" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Home className="w-5 h-5" />
            <span>Ana Sayfa</span>
          </a>
          <a href="https://haveai.online/BlogHistory" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <FileText className="w-5 h-5" />
            <span>Blog Geçmişi</span>
          </a>
          <a href="https://haveai.online/settings" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            <span>Ayarlar</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-white bg-white/10 rounded-xl transition-colors">
            <CreditCard className="w-5 h-5" />
            <span className="font-medium">Planlar</span>
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
                <h1 className="text-xl font-bold text-white">Planlar ve Fiyatlandırma</h1>
                <p className="text-sm text-gray-400">Size en uygun planı seçin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Mevcut Planınız: {currentPlan.name}
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Doğru planı seçin
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              İhtiyaçlarınıza uygun plana yükseltip AutoBlog'un tüm özelliklerinden yararlanın
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-1 inline-flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Aylık
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Yıllık
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              const isCurrentPlan = currentPlan.name === plan.name;
              
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white/5 backdrop-blur-lg border rounded-2xl p-8 transition-all hover:scale-105 ${
                    plan.popular
                      ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20'
                      : 'border-white/10'
                  } ${
                    selectedPlan === plan.id
                      ? 'ring-2 ring-purple-500'
                      : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full">
                        En Popüler
                      </div>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                        Mevcut Plan
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`inline-flex p-3 bg-gradient-to-r ${plan.color} rounded-xl mb-4`}>
                    <PlanIcon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-white">
                        {plan.monthlyPrice === 0 ? 'Ücretsiz' : `$${getPrice(plan)}`}
                      </span>
                      {plan.monthlyPrice !== 0 && (
                        <span className="text-gray-400">
                          /{billingCycle === 'monthly' ? 'ay' : 'yıl'}
                        </span>
                      )}
                    </div>
                    {billingCycle === 'yearly' && plan.monthlyPrice !== 0 && (
                      <p className="text-green-400 text-sm mt-1">
                        %{getSavingsPercent(plan)} tasarruf edin
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                      isCurrentPlan
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    {isCurrentPlan ? 'Mevcut Planınız' : 'Bu Planı Seç'}
                    {!isCurrentPlan && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Checkout */}
          {selectedPlan && selectedPlan !== plans.find(p => p.name === currentPlan.name)?.id && (
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Seçilen Plan</h3>
                  <p className="text-gray-400">
                    {plans.find(p => p.id === selectedPlan)?.name} - {getPriceDisplay(plans.find(p => p.id === selectedPlan.id))}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Ödemeye Geç
              </button>
            </div>
          )}

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Sıkça Sorulan Sorular</h3>
            <div className="space-y-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-2">Planımı dilediğim zaman değiştirebilir miyim?</h4>
                <p className="text-gray-400 text-sm">Evet, planınızı istediğiniz zaman yükseltebilir veya düşürebilirsiniz. Değişiklikler anında etkinleşir.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-2">Hangi ödeme yöntemlerini kabul ediyorsunuz?</h4>
                <p className="text-gray-400 text-sm">Kredi kartı, banka kartı ve PayPal ile ödeme yapabilirsiniz.</p>
              </div>
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-2">İptal politikanız nedir?</h4>
                <p className="text-gray-400 text-sm">İstediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar planınız aktif kalır.</p>
              </div>
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
                <p className="text-sm text-green-50">Plan seçimi başarılı,Ödeme sayfasına yönlendiriliyorsunuz</p>
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

    </div>
  );
}