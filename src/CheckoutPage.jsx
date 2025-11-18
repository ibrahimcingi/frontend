import React, { useState, useEffect } from 'react';
import { 
  CreditCard, Lock, CheckCircle, AlertCircle, X, 
  Calendar, User, Mail, Building, MapPin, ArrowLeft,
  Shield, Zap
} from 'lucide-react';
import { Root } from '../config.js';
import { useNavigate } from 'react-router-dom';

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";


export  function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate=useNavigate()

  const stripe = useStripe();
  const elements = useElements();

  const { state } = useLocation();
  
  const selectedPlan = state?.plan;

  const billingCycle=state?.billingCycle



  // Form data
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'TR'
  });

  // Field errors
  const [fieldErrors, setFieldErrors] = useState({});

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(()=>{
      setSuccessMessage(null)
      setIsProcessing(false);
    },5000)
  };


  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }

    

    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  

  const validateForm = () => {
    const errors = {};

    if (!formData.email || !validateEmail(formData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }


    if (!formData.billingAddress || formData.billingAddress.length < 5) {
      errors.billingAddress = 'Fatura adresinizi girin';
    }

    if (!formData.city || formData.city.length < 2) {
      errors.city = 'Şehir adını girin';
    }

    if (!formData.zipCode || formData.zipCode.length < 4) {
      errors.zipCode = 'Geçerli bir posta kodu girin';
    }

    setFieldErrors(errors);
    console.log(errors)
    return Object.keys(errors).length === 0;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Lütfen tüm alanları doğru şekilde doldurun.');
      return;
    }

    setIsProcessing(true);

    try {
        const cardElement = elements.getElement(CardElement);
    
        const { paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: formData.cardName,
            email: formData.email,
          },
        });
        console.log(paymentMethod);

        const response=await fetch(`${Root}/api/users/create-subscription`,{
          method:"POST",
          credentials:'include',
          headers:{'Content-Type': 'application/json',},
          body: JSON.stringify({
            email:formData.email,
            paymentMethodId: paymentMethod.id,
            priceId: billingCycle==='monthly' ? selectedPlan.monthlyPriceId : selectedPlan.yearlyPriceId,
            billingInfo: {
              name: formData.cardName,
              email: formData.email,
              address: formData.billingAddress,
              city: formData.city,
              country:formData.country,
              zip: formData.zipCode,
            },
          }),
        })

        const data=await response.json()

        console.log('Processing payment:', { plan: selectedPlan, formData });

        if(data.success){
          setTimeout(() => {
            showSuccess('Ödeme başarıyla tamamlandı! Dashboard\'a yönlendiriliyorsunuz...');
            
            setTimeout(() => {
              console.log('Redirecting to dashboard...');
              
              navigate('/Dashboard')
            }, 2000);
          }, 2500);

        }
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      showError('Ödeme işlemi başarısız oldu. Lütfen kart bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Geri Dön</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">Ödeme Bilgileri</h1>
              </div>
              <p className="text-gray-300 text-sm">Güvenli ödeme için bilgilerinizi girin</p>
            </div>

            {/* Payment Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6">
              
              {/* Security Badge */}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-6">
                <Shield className="w-5 h-5 text-green-400" />
                <p className="text-sm text-green-300">
                  <strong>Güvenli Ödeme:</strong> Tüm bilgileriniz SSL ile şifrelenir
                </p>
              </div>

              <div className="space-y-5">
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    E-posta Adresi <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:ring-purple-500'
                      }`}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                
                {/* Card Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Kart Üzerindeki İsim <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.cardName 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:ring-purple-500'
                      }`}
                      placeholder="AHMET YILMAZ"
                    />
                  </div>
                  {fieldErrors.cardName && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.cardName}
                    </p>
                  )}
                </div>

                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Kart Bilgileri <span className="text-red-400">*</span>
                </label>

                <div className="relative p-3 border rounded-xl bg-white/5 border-gray-600 focus-within:ring-2 focus-within:ring-purple-500">
                        <CardElement
                          options={{
                            hidePostalCode:true,
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#fff",
                                "::placeholder": {
                                  color: "#aaa",
                                },
                              },
                            },
                          }}
                        />
                    </div>
                {/* Billing Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Fatura Adresi <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="billingAddress"
                      value={formData.billingAddress}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.billingAddress 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:ring-purple-500'
                      }`}
                      placeholder="Adres satırı"
                    />
                  </div>
                  {fieldErrors.billingAddress && (
                    <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.billingAddress}
                    </p>
                  )}
                </div>

                {/* City & Zip */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Şehir <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                          fieldErrors.city 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-600 focus:ring-purple-500'
                        }`}
                        placeholder="İstanbul"
                      />
                    </div>
                    {fieldErrors.city && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Posta Kodu <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={`block w-full px-3 py-3 border rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                        fieldErrors.zipCode 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-600 focus:ring-purple-500'
                      }`}
                      placeholder="34000"
                    />
                    {fieldErrors.zipCode && (
                      <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.zipCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Ödeme İşleniyor...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Güvenli Ödeme Yap - ${selectedPlan.price}
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Ödeme işlemini tamamlayarak <a href="#" className="text-purple-400 hover:text-purple-300">Kullanım Koşulları</a> ve <a href="#" className="text-purple-400 hover:text-purple-300">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Sipariş Özeti</h2>

              {/* Plan Details */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white">{selectedPlan.name}</h3>
                  <span className="text-2xl font-bold text-purple-300">${selectedPlan.price}</span>
                </div>
                <p className="text-sm text-gray-300 mb-4">Aylık Abonelik</p>

                <ul className="space-y-2">
                  {selectedPlan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {selectedPlan.features.length > 4 && (
                    <li className="text-sm text-purple-400">
                      +{selectedPlan.features.length - 4} özellik daha
                    </li>
                  )}
                </ul>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-gray-300">
                  <span>Alt Toplam</span>
                  <span>${billingCycle==='monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice }</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>KDV (%20)</span>
                  <span>${((billingCycle==='monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice) * 0.2).toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-white text-xl font-bold mb-6">
                <span>Toplam</span>
                <span>${((billingCycle==='monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice) * 1.2).toFixed(2)}</span>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>256-bit SSL Şifreleme</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Anında Aktivasyon</span>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-2xl p-4 pr-12 min-w-[320px] max-w-md border border-green-400/30 backdrop-blur-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-bounce-slow">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Başarılı!</h4>
                <p className="text-sm text-green-50">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-2xl p-4 pr-12 min-w-[320px] max-w-md border border-red-400/30 backdrop-blur-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">Hata!</h4>
                <p className="text-sm text-red-50">{errorMessage}</p>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

