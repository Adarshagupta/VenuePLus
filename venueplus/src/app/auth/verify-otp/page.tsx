'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Mail, ArrowRight, RefreshCw, Shield, Sparkles, Plane } from 'lucide-react'

export default function VerifyOTPPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [email, setEmail] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    } else {
      // If no email in URL, redirect to signup
      router.push('/auth/signup')
    }
  }, [searchParams, router])

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !isVerified) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft, isVerified])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all fields are filled
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newOtp = [...otp]
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      handleVerifyOTP(pastedData)
    }
  }

  const handleVerifyOTP = async (otpCode?: string) => {
    const codeToVerify = otpCode || otp.join('')
    
    if (codeToVerify.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: codeToVerify
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsVerified(true)
        setTimeout(() => {
          router.push('/auth/signin?message=email-verified')
        }, 2000)
      } else {
        setError(data.error || 'Verification failed')
        // Clear OTP on error
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        setTimeLeft(600) // Reset timer
        setOtp(['', '', '', '', '', '']) // Clear current OTP
        inputRefs.current[0]?.focus()
        alert('New verification code sent to your email!')
      } else {
        setError(data.error || 'Failed to resend code')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Panel - Flowing Gradient Background */}
        <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[40vh] lg:min-h-screen">
          {/* Beautiful Flowing Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900">
            {/* Flowing wave patterns */}
            <div className="absolute inset-0">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
                <defs>
                  <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4"/>
                    <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4"/>
                  </linearGradient>
                  <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                    <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4"/>
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3"/>
                  </linearGradient>
                </defs>
                <path d="M0,0 C300,200 600,100 1200,300 L1200,0 Z" fill="url(#wave1)">
                  <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M0,0 C300,200 600,100 1200,300 L1200,0 Z;M0,0 C300,100 600,200 1200,200 L1200,0 Z;M0,0 C300,200 600,100 1200,300 L1200,0 Z"/>
                </path>
                <path d="M0,800 C300,600 600,700 1200,500 L1200,800 Z" fill="url(#wave2)">
                  <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0,800 C300,600 600,700 1200,500 L1200,800 Z;M0,800 C300,700 600,600 1200,600 L1200,800 Z;M0,800 C300,600 600,700 1200,500 L1200,800 Z"/>
                </path>
              </svg>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full animate-gentle-float"></div>
              <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full animate-gentle-float animation-delay-400"></div>
              <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-sky-400/10 rounded-full animate-gentle-float animation-delay-600"></div>
              
              {/* Airplane Elements - Static */}
              <div className="absolute top-1/4 right-1/4 transform rotate-12">
                <div className="relative">
                  <Plane className="w-14 h-14 text-white/80 relative z-10 drop-shadow-lg" />
                  {/* Vapor trail */}
                  <div className="absolute top-1/2 left-0 w-18 h-1 bg-gradient-to-r from-white/40 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
                  <div className="absolute top-1/2 left-0 w-14 h-0.5 bg-gradient-to-r from-cyan-200/60 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
                </div>
              </div>
              <div className="absolute bottom-1/4 left-1/6 transform -rotate-6">
                <div className="relative">
                  <Plane className="w-10 h-10 text-white/70 relative z-10 drop-shadow-md" />
                  {/* Vapor trail */}
                  <div className="absolute top-1/2 left-0 w-14 h-0.5 bg-gradient-to-r from-white/30 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
                  <div className="absolute top-1/2 left-0 w-10 h-0.5 bg-gradient-to-r from-sky-200/50 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
                </div>
              </div>
            </div>
            
            {/* Content Overlay */}
            <div className="relative z-10 h-full flex items-center justify-center p-12">
              <div className="text-center text-white animate-soft-fade-in">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-gentle-pulse">
                  <Plane className="w-10 h-10 text-cyan-300" />
                </div>
                <h1 className="text-4xl font-bold mb-4 text-white">Welcome!</h1>
                <p className="text-lg text-cyan-100 max-w-md">
                  Your journey to amazing destinations starts here. Discover, plan, and experience unforgettable adventures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Success Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative py-8 lg:py-0">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>
          
          <div className="relative z-10 w-full max-w-md p-8">
            <div className="text-center animate-scale-in">
              {/* Success Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-8 shadow-lg animate-bounce-in">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              
              {/* Success Message */}
              <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-soft-fade-in animation-delay-200">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 mb-6 animate-soft-fade-in animation-delay-400">
                Your account is now ready to use. Start planning your next adventure!
              </p>
              
              {/* Redirect Message */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 animate-soft-fade-in animation-delay-600">
                <p className="text-sm text-blue-700 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Redirecting to sign in...
                </p>
              </div>
              
              {/* Action Button */}
              <Link
                href="/auth/signin"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-sky-lg hover:shadow-sky-xl transform transition-all duration-300 hover:scale-105 animate-soft-fade-in animation-delay-800"
              >
                Continue to Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Flowing Gradient Background */}
      <div className="w-full lg:w-1/2 relative overflow-hidden min-h-[40vh] lg:min-h-screen">
        {/* Beautiful Flowing Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-blue-800 to-cyan-900">
          {/* Flowing wave patterns */}
          <div className="absolute inset-0">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
              <defs>
                <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4"/>
                  <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4"/>
                </linearGradient>
                <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3"/>
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3"/>
                </linearGradient>
                <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity="0.5"/>
                  <stop offset="50%" stopColor="#075985" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3"/>
                </linearGradient>
              </defs>
              <path d="M0,0 C300,200 600,100 1200,300 L1200,0 Z" fill="url(#wave1)">
                <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M0,0 C300,200 600,100 1200,300 L1200,0 Z;M0,0 C300,100 600,200 1200,200 L1200,0 Z;M0,0 C300,200 600,100 1200,300 L1200,0 Z"/>
              </path>
              <path d="M0,800 C300,600 600,700 1200,500 L1200,800 Z" fill="url(#wave2)">
                <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M0,800 C300,600 600,700 1200,500 L1200,800 Z;M0,800 C300,700 600,600 1200,600 L1200,800 Z;M0,800 C300,600 600,700 1200,500 L1200,800 Z"/>
              </path>
              <path d="M0,300 C300,100 600,200 1200,100 L1200,400 C600,300 300,400 0,500 Z" fill="url(#wave3)">
                <animate attributeName="d" dur="10s" repeatCount="indefinite" values="M0,300 C300,100 600,200 1200,100 L1200,400 C600,300 300,400 0,500 Z;M0,350 C300,150 600,250 1200,150 L1200,450 C600,350 300,450 0,550 Z;M0,300 C300,100 600,200 1200,100 L1200,400 C600,300 300,400 0,500 Z"/>
              </path>
            </svg>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full animate-gentle-float"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-blue-400/10 rounded-full animate-gentle-float animation-delay-400"></div>
            <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-sky-400/10 rounded-full animate-gentle-float animation-delay-600"></div>
            
            {/* Airplane Elements - Static */}
            <div className="absolute top-20 right-20 transform rotate-12">
              <div className="relative bg-red-500 p-4 rounded-full">
                <Plane className="w-20 h-20 text-white relative z-50" strokeWidth={3} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div className="absolute bottom-20 left-20 transform -rotate-12">
              <div className="relative bg-green-500 p-3 rounded-full">
                <Plane className="w-16 h-16 text-white relative z-50" strokeWidth={3} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-400 rounded-full"></div>
              </div>
            </div>
            <div className="absolute top-1/2 right-10 transform rotate-45">
              <div className="relative bg-purple-500 p-2 rounded-full">
                <Plane className="w-12 h-12 text-white relative z-50" strokeWidth={3} />
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-pink-400 rounded-full"></div>
              </div>
            </div>
            

          </div>
          
          {/* Content Overlay */}
          <div className="relative z-10 h-full flex items-center justify-center p-12">
            <div className="text-center text-white animate-soft-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-gentle-pulse">
                <Plane className="w-10 h-10 text-cyan-300" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Secure Verification</h1>
              <p className="text-lg text-cyan-100 max-w-md">
                Protecting your account with advanced security measures. Your privacy and safety are our top priority.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative py-8 lg:py-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        
        <div className="relative z-10 w-full max-w-lg px-4 sm:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-6 animate-soft-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Verification Code</h2>
            <p className="text-gray-600 mb-3">
              We've sent a 6-digit code to
            </p>
            <p className="font-semibold text-gray-900 bg-blue-50 px-4 py-2 rounded-lg inline-block">{email}</p>
          </div>

          {/* OTP Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 animate-scale-in animation-delay-200">
            <div className="space-y-5">
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4 text-center">
                  Enter the 6-digit code
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-3 max-w-sm mx-auto" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="flex-1 aspect-square max-w-[48px] sm:max-w-[56px] text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 hover:border-gray-300 shadow-sm"
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3">
                <p className="text-sm font-medium text-orange-700">
                  Code expires in: <span className="font-bold text-red-600 text-base">{formatTime(timeLeft)}</span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-3 animate-soft-fade-in">
                  <p className="text-red-700 font-medium text-sm text-center">{error}</p>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyOTP()}
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 font-medium">Didn't receive the code?</p>
                <button
                  onClick={handleResendOTP}
                  disabled={isResending || timeLeft > 0}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 hover:border-sky-300 transition-all duration-200 disabled:text-gray-400 disabled:bg-gray-50 disabled:border-gray-200 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                  {isResending ? 'Sending...' : timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 animate-soft-fade-in animation-delay-600">
            <p className="text-sm text-gray-600">
              Wrong email?{' '}
              <Link href="/auth/signup" className="font-semibold text-sky-600 hover:text-sky-700 transition-colors">
                Sign up again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
