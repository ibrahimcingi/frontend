import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, CheckCircle,Eye, EyeOff } from 'lucide-react';

export  function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const sendOTPRequest = async (email) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/SendResetPasswordEmail', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        console.log('OTP sent to:', email);
        return true;
      } else {
        console.error('Failed to send OTP');
        return false;
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      return false;
    }
  };
  

  // Email gönderme
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    const success = await sendOTPRequest(email);
    if (success) {
      setTimeout(() => {
        setIsLoading(false);
        setStep(2);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  };
  

  // OTP input değişikliği
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Otomatik sonraki input'a geçiş
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  // OTP doğrulama
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const otpCode = otp.join('');
    
    // Backend API çağrısı
    try {
      const response=await fetch('http://localhost:8000/api/auth/verifyOTP',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:email, OTP: otpCode })
      })
      if(response.ok){
        console.log('OTP verified:', otpCode);
      
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1000);

      }
      
    } catch (error) {
      console.error('Verify OTP error:', error);
      setIsLoading(false);
    }
  };

  // Yeni şifre belirleme
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (newPassword.length < 8) {
      setError("Şifre en az 8 karakter olmalı");
      setIsLoading(false)
      return;
    }

    // Şifre eşleşme kontrolü
    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setIsLoading(false)
      return;
    }
    
    // Backend API çağrısı
    try {

      const response=await fetch('http://localhost:8000/api/auth/resetPassword',{
        method:"POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({OTP:otp.join(''),new_password:newPassword,email:email})
      })

      const data=await response.json()


      if(response.ok){
        console.log(data.message)
        console.log('Password reset successful');

      setTimeout(() => {
        setIsLoading(false);
        setStep(4);
      }, 1000);
      }

    } catch (error) {
      console.error('Reset password error:', error);
      setIsLoading(false);
    }
  };

  // OTP tekrar gönderme
  const handleResendOTP = async () => {
    console.log('Resending OTP to:', email);
    setIsLoading(true);
  
    const success = await sendOTPRequest(email);
    if (success) {
      console.log('OTP resent successfully');
    }
  
    setIsLoading(false);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Şifremi Unuttum</h1>
                <p className="text-gray-300">E-posta adresinize doğrulama kodu göndereceğiz</p>
              </div>

              <div className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                    E-posta Adresi
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="ornek@email.com"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Gönderiliyor...
                    </div>
                  ) : (
                    'Doğrulama Kodu Gönder'
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Kodu Girin</h1>
                <p className="text-gray-300">
                  <span className="font-medium text-white">{email}</span> adresine gönderilen 6 haneli kodu girin
                </p>
              </div>

              <div className="space-y-6">
                {/* OTP Input */}
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && index > 0) {
                          document.getElementById(`otp-${index - 1}`).focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-2xl font-bold border border-gray-600 rounded-xl bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    />
                  ))}
                </div>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Kodu almadınız mı?</p>
                  <button
                    onClick={handleResendOTP}
                    className="text-purple-400 hover:text-purple-300 font-semibold text-sm transition-colors"
                  >
                    Tekrar Gönder
                  </button>
                </div>

                {/* Verify Button */}
                <button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.some(d => !d)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Doğrulanıyor...
                    </div>
                  ) : (
                    'Doğrula'
                  )}
                </button>

                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 text-gray-300 hover:text-white transition-colors py-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>E-posta adresini değiştir</span>
                </button>
              </div>
            </>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Yeni Şifre</h1>
                <p className="text-gray-300">Hesabınız için yeni bir şifre belirleyin</p>
              </div>

              <div className="space-y-5">
                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Yeni Şifre
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="En az 8 karakter"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-2">
                    Şifre Tekrar
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-xl bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="Şifrenizi tekrar girin"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Hata mesajı */}
                  {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Submit Button */}
                <button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Kaydediliyor...
                    </div>
                  ) : (
                    'Şifremi Değiştir'
                  )}
                </button>
              </div>          
            </>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <>
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Başarılı!</h1>
                <p className="text-gray-300">Şifreniz başarıyla değiştirildi</p>
              </div>

              {/* Login Button */}
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
              >
                Giriş Yap
              </button>
            </>
          )}

          {/* Back to Login (Visible in step 1 only) */}
          {step === 1 && (
            <div className="mt-6 text-center">
              <a href="http://localhost:5173/login" className="text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Giriş sayfasına dön</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-6">
          © 2025 Blog. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}