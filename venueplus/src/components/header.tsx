'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Menu, X, User, ChevronDown, Settings, BookOpen, Calendar, 
  Heart, Activity, LogOut, Bell, CreditCard, HelpCircle 
} from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false)
      }
    }
    
    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileMenuOpen])

  return (
    <header className={`transition-all duration-300 sticky top-0 z-50 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-transparent border-b border-gray-100/50'
    }`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 group relative">
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:w-full"></div>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 group relative">
                <span>Experiences</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:w-full"></div>
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 group relative">
                <span>Book Trip</span>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:w-full"></div>
              </button>
              <Link href="/blog" className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 group relative">
                Blog
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>
            
            {session ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Menu */}
                <div className="relative profile-menu">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-all duration-200 p-2 rounded-lg hover:bg-purple-50"
                  >
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                    <span className="font-medium hidden lg:block">{session.user?.name || 'User'}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{session.user?.name || 'User'}</p>
                            <p className="text-sm text-gray-600">{session.user?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Profile Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <User className="w-5 h-5" />
                          <div>
                            <p className="font-medium">My Profile</p>
                            <p className="text-xs text-gray-500">View and edit profile</p>
                          </div>
                        </Link>

                        <Link
                          href="/profile?tab=itineraries"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <BookOpen className="w-5 h-5" />
                          <div>
                            <p className="font-medium">My Itineraries</p>
                            <p className="text-xs text-gray-500">Saved trip plans</p>
                          </div>
                        </Link>

                        <Link
                          href="/profile?tab=bookings"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <Calendar className="w-5 h-5" />
                          <div>
                            <p className="font-medium">My Bookings</p>
                            <p className="text-xs text-gray-500">Travel reservations</p>
                          </div>
                        </Link>

                        <Link
                          href="/profile?tab=memories"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                        >
                          <Heart className="w-5 h-5" />
                          <div>
                            <p className="font-medium">Travel Memories</p>
                            <p className="text-xs text-gray-500">Photos and reviews</p>
                          </div>
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            href="/?action=plan-trip"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                          >
                            <Activity className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Plan New Trip</p>
                              <p className="text-xs text-gray-500">Start planning adventure</p>
                            </div>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <Link
                            href="/profile?tab=settings"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                          >
                            <Settings className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Settings</p>
                              <p className="text-xs text-gray-500">Account preferences</p>
                            </div>
                          </Link>

                          <Link
                            href="/billing"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                          >
                            <CreditCard className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Billing</p>
                              <p className="text-xs text-gray-500">Payment methods</p>
                            </div>
                          </Link>

                          <Link
                            href="/help"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                          >
                            <HelpCircle className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Help & Support</p>
                              <p className="text-xs text-gray-500">Get assistance</p>
                            </div>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setIsProfileMenuOpen(false)
                              signOut()
                            }}
                            className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                          >
                            <LogOut className="w-5 h-5" />
                            <div>
                              <p className="font-medium">Sign Out</p>
                              <p className="text-xs text-red-500">Log out of your account</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 relative group"
                >
                  Sign up
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-violet-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-purple-600 hover:to-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-xl relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">Log in</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-4 space-y-4">
              <Link href="/explore" className="block text-gray-700 hover:text-gray-900 py-2 font-medium">
                Explore
              </Link>
              <Link href="/find-talent" className="block text-gray-700 hover:text-gray-900 py-2 font-medium">
                Find Talent
              </Link>
              <Link href="/get-hired" className="block text-gray-700 hover:text-gray-900 py-2 font-medium">
                Get Hired
              </Link>
              <Link href="/blog" className="block text-gray-700 hover:text-gray-900 py-2 font-medium">
                Blog
              </Link>
              {session ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 py-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{session.user?.name || 'User'}</div>
                        <div className="text-sm text-gray-600">{session.user?.email}</div>
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      href="/profile?tab=itineraries"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 font-medium"
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>My Itineraries</span>
                    </Link>
                    
                    <Link
                      href="/profile?tab=bookings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 font-medium"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>My Bookings</span>
                    </Link>
                    
                    <Link
                      href="/profile?tab=memories"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 font-medium"
                    >
                      <Heart className="w-5 h-5" />
                      <span>Travel Memories</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <Link
                        href="/?action=plan-trip"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 py-3 text-green-600 hover:text-green-700 font-medium"
                      >
                        <Activity className="w-5 h-5" />
                        <span>Plan New Trip</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <Link
                        href="/profile?tab=settings"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 font-medium"
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsMenuOpen(false)
                          signOut()
                        }}
                        className="flex items-center space-x-3 py-3 text-red-600 hover:text-red-700 font-medium w-full text-left"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block text-gray-700 hover:text-gray-900 py-2 font-medium"
                  >
                    Sign up
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-center font-medium transition-colors"
                  >
                    Log in
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
