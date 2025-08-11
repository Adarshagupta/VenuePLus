'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        router.push('/')
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Flowing Gradient Background */}
      <div className="w-1/2 relative overflow-hidden">
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
              <path d="M0,100 C400,300 800,200 1200,400 L1200,800 L0,800 Z" fill="url(#wave2)">
                <animate attributeName="d" dur="12s" repeatCount="indefinite" values="M0,100 C400,300 800,200 1200,400 L1200,800 L0,800 Z;M0,200 C400,200 800,300 1200,300 L1200,800 L0,800 Z;M0,100 C400,300 800,200 1200,400 L1200,800 L0,800 Z"/>
              </path>
              <path d="M0,200 C500,400 700,300 1200,500 L1200,600 L0,600 Z" fill="url(#wave3)">
                <animate attributeName="d" dur="16s" repeatCount="indefinite" values="M0,200 C500,400 700,300 1200,500 L1200,600 L0,600 Z;M0,300 C500,300 700,400 1200,400 L1200,600 L0,600 Z;M0,200 C500,400 700,300 1200,500 L1200,600 L0,600 Z"/>
              </path>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-12 py-16 text-white">
          {/* Top Section */}
          <div></div>

          {/* Main Content */}
          <div className="space-y-8">
            <h1 className="text-6xl font-black leading-tight">
              Your<br/>
              Adventure<br/>
              Awaits
            </h1>
            
            <p className="text-lg text-white/90 leading-relaxed max-w-md font-medium">
              Explore new horizons, create memories,<br/>
              and turn your travel dreams into reality.
            </p>
          </div>

          {/* Bottom spacer */}
          <div></div>
        </div>
      </div>

      {/* Right Panel - Sign In Form */}
      <div className="w-1/2 flex items-center justify-center px-8 py-12 bg-white relative">
        <div className="w-full max-w-md">
          {/* VenuePlus Logo - Center Top */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo.png"
                alt="VenuePlus Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <Image
                src="/name.png"
                alt="VenuePlus"
                width={120}
                height={30}
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome Back</h2>
            <p className="text-gray-600 text-lg">
              Enter your email and password to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-base"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200 text-base"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-sm font-medium text-gray-600 hover:text-gray-800">
                Forgot Password
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-lg text-white font-semibold bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                href="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              className="w-full flex items-center justify-center py-4 px-6 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 text-base"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign In with Google
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="font-semibold text-gray-900 hover:text-gray-700 underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}