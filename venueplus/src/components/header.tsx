'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, ChevronDown } from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all-smooth ${
      scrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`}>
      <div className="w-full px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 ml-4 lg:ml-6">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="VenuePlus Logo"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="relative h-12 flex items-center">
                <Image
                  src="/name.png"
                  alt="VenuePlus Name"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <button className={`flex items-center space-x-1 transition-colors hover:text-violet-600 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className={`flex items-center space-x-1 transition-colors hover:text-violet-600 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                <span>Packages</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <Link href="/about" className={`transition-colors hover:text-violet-600 ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}>
                About
              </Link>
              {session && (
                <Link href="/trips" className={`transition-colors hover:text-violet-600 ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  My Trips
                </Link>
              )}
            </div>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className={`flex items-center space-x-2 ${
                  scrolled ? 'text-gray-700' : 'text-white'
                }`}>
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className={`transition-colors hover:text-violet-600 ${
                    scrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className={`transition-colors hover:text-violet-600 ${
                    scrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-2 rounded-full transition-all duration-200 hover:scale-105 font-medium shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors ${
                scrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-lg">
            <div className="px-6 lg:px-8 xl:px-12 ml-4 lg:ml-6 py-4 space-y-4">
              <Link href="/destinations" className="block text-gray-700 hover:text-violet-600 py-2">
                Destinations
              </Link>
              <Link href="/packages" className="block text-gray-700 hover:text-violet-600 py-2">
                Packages
              </Link>
              <Link href="/about" className="block text-gray-700 hover:text-violet-600 py-2">
                About
              </Link>
              {session ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-gray-700 py-2">
                      Welcome, {session.user?.name || session.user?.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-700 hover:text-violet-600 py-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <Link
                    href="/auth/signin"
                    className="block text-gray-700 hover:text-violet-600 py-2"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-center transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Get Started
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
