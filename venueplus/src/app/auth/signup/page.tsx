'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { Eye, EyeOff, User } from 'lucide-react'
import { useTripContext } from '@/contexts/TripContext'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasTripData, setHasTripData] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setTripData } = useTripContext()

  useEffect(() => {
    // Check if there's trip data in URL params - only run once on mount
    const tripDataParam = searchParams.get('tripData')
    if (tripDataParam) {
      try {
        const decodedTripData = JSON.parse(decodeURIComponent(tripDataParam))
        // Convert date strings back to Date objects
        if (decodedTripData.startDate) {
          decodedTripData.startDate = new Date(decodedTripData.startDate)
        }
        setTripData(decodedTripData)
        setHasTripData(true)
      } catch (error) {
        console.error('Error parsing trip data from URL:', error)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Intentionally empty - only run once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (response.ok) {
        // Auto sign in after successful registration
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.ok) {
          if (hasTripData) {
            // If we have trip data, redirect to create the trip
            router.push('/create-trip')
          } else {
            router.push('/')
          }
        } else {
          setError('Registration successful, but login failed. Please try signing in.')
        }
      } else {
        const data = await response.json()
        setError(data.message || 'Registration failed')
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

      {/* Right Panel - Sign Up Form */}
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
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Create Account</h2>
            <p className="text-gray-600 text-lg">
              {hasTripData 
                ? 'Complete your registration to save your trip'
                : 'Join us and start your travel journey today'
              }
            </p>
          </div>

          {hasTripData && (
            <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-xl">
              <p className="text-sm text-sky-700 text-center font-medium">
                🎉 Your trip plan is ready to be saved! Create an account to continue.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-3">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200"
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
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200"
                    placeholder="Create a password"
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

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-base font-medium text-gray-700 mb-3">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-400 transition-all duration-200"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                required
                className="w-4 h-4 text-gray-600 border-gray-300 rounded focus:ring-gray-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-gray-600 hover:text-gray-800 underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-gray-600 hover:text-gray-800 underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-lg text-white font-semibold bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{hasTripData ? 'Create Account & Save Trip' : 'Create Account'}</span>
              )}
            </button>

            {/* Google Sign Up */}
            <button
              type="button"
              className="w-full flex items-center justify-center py-4 px-6 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                href={hasTripData ? `/auth/signin?tripData=${encodeURIComponent(JSON.stringify(searchParams.get('tripData')))}` : "/auth/signin"} 
                className="font-semibold text-gray-900 hover:text-gray-700 underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}