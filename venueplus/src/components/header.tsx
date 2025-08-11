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
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="VenuePlus Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div className="relative h-10 flex items-center">
                <Image
                  src="/name.png"
                  alt="VenuePlus Name"
                  width={120}
                  height={32}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-8">
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
                <span>Destinations</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
                <span>Experiences</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium">
                <span>Book Trip</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <Link href="/blog" className="text-gray-700 hover:text-gray-900 font-medium">
                Blog
              </Link>
            </div>
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign up
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Log in
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
                    <div className="text-gray-700 py-2 font-medium">
                      Welcome, {session.user?.name || session.user?.email}
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="text-gray-700 hover:text-gray-900 py-2 font-medium"
                    >
                      Sign Out
                    </button>
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
