import React, { useState } from 'react';
import { 
  BookOpen, Sparkles, Zap, Globe, TrendingUp, Clock,
  Check, ArrowRight, Menu, X, ChevronRight, Brain,
  BarChart3, Shield, Rocket, Users, Target, PenTool
} from 'lucide-react';

export  function AutoBlogLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Brain,
      title: 'AI Destekli Yazım',
      description: 'Yapay zeka teknolojisi ile otomatik blog içeriği üretimi. Seçtiğiniz kategoride profesyonel bloglar oluşturun.'
    },
    {
      icon: Globe,
      title: 'WordPress Entegrasyonu',
      description: 'Oluşturulan bloglar otomatik olarak WordPress sitenize yayınlanır. Tek tıkla canlıya alın.'
    },
    {
      icon: Target,
      title: 'Kategori Bazlı',
      description: 'İstediğiniz kategorilerde blog üretin. İşletmenize özel içerik stratejisi oluşturun.'
    },
    {
      icon: Clock,
      title: '7/24 Otomasyon',
      description: 'Sürekli içerik üretimi ile sitenizi her zaman güncel tutun. İçerik takvimi yönetimi kolaylaştı.'
    },
    {
      icon: BarChart3,
      title: 'Detaylı İstatistikler',
      description: 'Yayınlanan bloglarınızı takip edin. Hangi içerikler daha çok ilgi görüyor, analiz edin.'
    },
    {
      icon: Shield,
      title: 'Güvenli ve Hızlı',
      description: 'Verileriniz güvende. Hızlı blog üretimi ile dakikalar içinde içerik yayınlayın.'
    }
  ];

  const benefits = [
    {
      icon: Rocket,
      title: 'Zamandan Tasarruf',
      description: 'Blog yazımı için harcadığınız saatleri kurtarın. AI sizin için çalışsın.',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      icon: TrendingUp,
      title: 'SEO Optimizasyonu',
      description: 'SEO uyumlu içeriklerle arama motorlarında üst sıralarda yer alın.',
      color: 'from-green-600 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Daha Fazla Trafik',
      description: 'Sürekli güncel içerikle sitenize daha fazla ziyaretçi çekin.',
      color: 'from-purple-600 to-pink-600'
    },
    {
      icon: PenTool,
      title: 'Profesyonel Kalite',
      description: 'Profesyonel kalitede, akıcı ve okunabilir blog içerikleri.',
      color: 'from-orange-600 to-red-600'
    }
  ];

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      period: '/ay',
      features: [
        '5 Blog/Ay',
        '2 Kategori',
        'Temel AI Özellikleri',
        'Email Desteği',
        'WordPress Entegrasyonu'
      ]
    },
    {
      name: 'Pro',
      price: '29',
      period: '/ay',
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
      name: 'Enterprise',
      price: '99',
      period: '/ay',
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

  const steps = [
    {
      number: '1',
      title: 'WordPress Bağlayın',
      description: 'WordPress sitenizi güvenli şekilde bağlayın ve kategorilerinizi belirleyin.'
    },
    {
      number: '2',
      title: 'Kategori Seçin',
      description: 'Blog oluşturmak istediğiniz kategoriyi seçin. İsterseniz başlık da belirleyin.'
    },
    {
      number: '3',
      title: 'AI Üretsin',
      description: 'AI blogunuzu oluşturup otomatik olarak WordPress sitenize yayınlar.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">AutoBlog</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Özellikler</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">Nasıl Çalışır</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Fiyatlandırma</a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-white hover:text-purple-300 transition-colors font-medium">
                Giriş Yap
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all">
                Ücretsiz Başla
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-300 hover:text-white transition-colors py-2">Özellikler</a>
              <a href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors py-2">Nasıl Çalışır</a>
              <a href="#pricing" className="block text-gray-300 hover:text-white transition-colors py-2">Fiyatlandırma</a>
              <div className="pt-3 border-t border-white/10 space-y-2">
                <button className="w-full text-white hover:text-purple-300 transition-colors font-medium py-2">
                  Giriş Yap
                </button>
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-2 rounded-lg">
                  Ücretsiz Başla
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              AI Destekli Blog Otomasyonu
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Bloglarınız
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Otomatik Yayınlansın
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              <strong className="text-white">WordPress blogunuz için AI destekli otomatik içerik üretimi.</strong> 
            </p>

            <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
              Kategori seçin, AI profesyonel blog yazsın, WordPress sitenize otomatik yayınlansın. 
              Blog yazımı için harcadığınız zamanı ve maliyeti %90 azaltın.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30">
                Ücretsiz Dene
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-semibold px-8 py-4 rounded-xl transition-all border border-white/20">
                Hesabınız var mı? Giriş Yapın
              </button>
            </div>

            {/* Demo Preview */}
            <div className="relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm text-gray-400">AutoBlog Dashboard</span>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400 font-semibold">Blog Oluşturuluyor...</span>
                    </div>
                    <h3 className="text-white font-semibold mb-2">Yapay Zeka ve Gelecek Trendleri</h3>
                    <p className="text-sm text-gray-400">Kategori: Teknoloji</p>
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
                </div>
                
                <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-300 space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>AI içerik oluşturuldu</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>SEO optimizasyonu tamamlandı</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>WordPress'e yayınlanıyor...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Neden AutoBlog?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Blog yazımında devrim yaratın
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all group">
                <div className={`inline-flex p-4 bg-gradient-to-r ${benefit.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              3 basit adımda blog oluşturun
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Güçlü Özellikler</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Blogunuzu büyütecek her şey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group">
                <div className="inline-flex p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Fiyatlandırma</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Her boyutta blog için uygun planlar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-lg border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-purple-500/50 shadow-2xl shadow-purple-500/20 scale-105'
                    : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                    En Popüler
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}>
                  Başla
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-lg">
            <h2 className="text-4xl font-bold text-white mb-4">
              Blogunuzu Büyütmeye Hazır mısınız?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ücretsiz başlayın. Kredi kartı gerektirmez.
            </p>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-purple-500/30">
              Hemen Başla
              <Zap className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">AutoBlog</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 AutoBlog. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}