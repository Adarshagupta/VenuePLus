'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'
import { Header } from '@/components/header'
import { TripPlanningModal } from '@/components/trip-planning-modal'
import { SearchSection } from '@/components/search-section'
import { StatsSection } from '@/components/stats-section'
import { FeatureShowcase } from '@/components/feature-showcase'
import { TestimonialSection } from '@/components/testimonial-section'

export default function HomePage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <main className="pt-4 relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-20 h-20 bg-violet-300/30 rounded-full blur-2xl animate-bounce" style={{animationDuration: '3s'}}></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-indigo-200/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-bounce" style={{animationDuration: '4s', animationDelay: '2s'}}></div>
        </div>
        
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 xl:px-16 relative z-10">
      {/* Hero Section */}
          <div className="flex items-start justify-between min-h-[600px] py-8">
            {/* Left Content */}
            <div className="flex-1 max-w-[600px] pr-20 pt-8">
              {/* Main Heading with Gradient */}
              <h1 className="text-[4.5rem] leading-[1.1] font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-purple-800 to-violet-900 bg-clip-text text-transparent animate-fade-in">
                Discover Your<br />
                <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Perfect Travel Experience
            </span>
          </h1>
          
              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-[420px] font-normal">
                Explore curated destinations, authentic experiences, and hidden gems. Plan your perfect trip with AI-powered recommendations.
              </p>
              
              {/* Enhanced Category Tabs */}
              <div className="flex items-center space-x-0 mb-8 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-1 w-fit shadow-lg border border-white/50 backdrop-blur-sm">
                <button className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3 7l9 5 9-5-9-5zM5 11l7 4 7-4M5 15l7 4 7-4"/>
                  </svg>
                  <span>Destinations</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900 hover:bg-white/70 px-5 py-2.5 text-sm font-medium flex items-center space-x-2 transition-all duration-300 rounded-lg hover:shadow-md">
                  <svg className="w-4 h-4 group-hover:animate-spin" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H9v3h10V7z"/>
                  </svg>
                  <span>Experiences</span>
                </button>
                <button className="text-gray-600 hover:text-gray-900 hover:bg-white/70 px-5 py-2.5 text-sm font-medium flex items-center space-x-2 transition-all duration-300 rounded-lg hover:shadow-md">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                  </svg>
                  <span>Bookings</span>
                </button>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                    className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 text-base bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Popular Tags */}
              <div className="mb-8">
                <span className="text-sm text-gray-500 font-medium mr-4">Popular:</span>
                <div className="inline-flex flex-wrap gap-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">paris</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">tokyo</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">bali</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">rome</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">santorini</button>
                  <button className="text-sm text-gray-600 hover:text-gray-900 underline">iceland</button>
                </div>
              </div>
            </div>
            
            {/* Right Content - Custom GIF */}
            <div className="flex-1 relative max-w-[900px]">
              <div className="relative rounded-[2rem] h-[480px] overflow-hidden border border-gray-100 shadow-lg">
                {/* Custom GIF from public folder */}
                <div className="w-full h-full relative overflow-hidden">
                  <img 
                    src="/GIF2.gif"
                    alt="Beautiful travel destination GIF"
                    className="w-full h-full object-cover transition-transform duration-[8000ms] ease-in-out hover:scale-105"
                    style={{
                      filter: 'brightness(1.05) contrast(1.02)',
                      animation: 'slowFloat 6s ease-in-out infinite alternate'
                    }}
                  />
                  <style jsx>{`
                    @keyframes slowFloat {
                      0% { transform: scale(1) translateY(0px); }
                      100% { transform: scale(1.02) translateY(-2px); }
                    }
                    @keyframes fadeIn {
                      0% { opacity: 0; transform: translateY(20px); }
                      100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes shimmer {
                      0% { background-position: -200% 0; }
                      100% { background-position: 200% 0; }
                    }
                    .animate-fade-in {
                      animation: fadeIn 1s ease-out;
                    }
                    .animate-shimmer {
                      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                      background-size: 200% 100%;
                      animation: shimmer 2s infinite;
                    }
                  `}</style>
                </div>
                
                {/* Overlay with location info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Location badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Featured Destination</div>
                      <div className="text-sm text-gray-600">Discover Amazing Places</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">4.9</span>
                      <span className="text-xs text-gray-500">(2.5k reviews)</span>
                    </div>
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Explore
                    </button>
                  </div>
                </div>
                
                {/* Top right badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
                  <div className="text-xs text-gray-600 font-medium">Featured Experience</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Grid Section */}
          <div className="py-8 border-t border-gray-100">
                        {/* Category Navigation */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-8 overflow-x-auto">
                <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-3 whitespace-nowrap">Popular</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Europe</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Asia</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Adventure</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Beach</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Culture</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Food & Wine</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Luxury</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Budget</button>
                <button className="text-gray-600 hover:text-gray-900 font-medium pb-3 whitespace-nowrap">Solo Travel</button>
              </div>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
                <span>Filters</span>
              </button>
            </div>
        
                        {/* Destination Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 mb-12">
              {/* Enhanced Travel destination cards */}
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2 hover:scale-105">
                <div className="h-3/4 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center relative text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div className="text-xs font-semibold tracking-wide">PARIS</div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white/20 rounded-full blur-xl"></div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between bg-gradient-to-r from-white to-blue-50/50 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Paris, France</div>
                  <div className="text-xs text-yellow-500 font-medium">⭐ 4.9</div>
                </div>
              </div>
          
                            <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-red-400 to-pink-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.82 22 12 18.27 6.18 22l1.73-7.26L2 9l6.91-1.74L12 2z"/>
                    </svg>
                    <div className="text-xs font-semibold">TOKYO</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Tokyo, Japan</div>
                  <div className="text-xs text-yellow-500">⭐ 4.8</div>
                </div>
              </div>
              
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-green-400 to-teal-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <div className="text-xs font-semibold">BALI</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Bali, Indonesia</div>
                  <div className="text-xs text-yellow-500">⭐ 4.7</div>
                </div>
              </div>
              
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-orange-400 to-yellow-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div className="text-xs font-semibold">ROME</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Rome, Italy</div>
                  <div className="text-xs text-yellow-500">⭐ 4.6</div>
                </div>
        </div>
        
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.82 22 12 18.27 6.18 22l1.73-7.26L2 9l6.91-1.74L12 2z"/>
                    </svg>
                    <div className="text-xs font-semibold">SANTORINI</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Santorini, Greece</div>
                  <div className="text-xs text-yellow-500">⭐ 4.9</div>
                </div>
          </div>
          
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div className="text-xs font-semibold">ICELAND</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Reykjavik, Iceland</div>
                  <div className="text-xs text-yellow-500">⭐ 4.8</div>
                </div>
              </div>
              
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L17.82 22 12 18.27 6.18 22l1.73-7.26L2 9l6.91-1.74L12 2z"/>
                    </svg>
                    <div className="text-xs font-semibold">DUBLIN</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Dublin, Ireland</div>
                  <div className="text-xs text-yellow-500">⭐ 4.5</div>
                </div>
              </div>
              
              <div className="aspect-[4/3] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer">
                <div className="h-3/4 bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center relative text-white">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-1 opacity-90" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <div className="text-xs font-semibold">MOROCCO</div>
                  </div>
                </div>
                <div className="h-1/4 p-3 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Marrakech, Morocco</div>
                  <div className="text-xs text-yellow-500">⭐ 4.4</div>
          </div>
        </div>
      </div>

            {/* Rating and Travelers */}
            <div className="flex items-center justify-center space-x-12 pt-8">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                    </svg>
                  ))}
                </div>
                <span className="text-gray-900 font-semibold text-lg">4.8/5</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4C18.2 4 20 5.8 20 8C20 10.2 18.2 12 16 12C13.8 12 12 10.2 12 8C12 5.8 13.8 4 16 4ZM16 14C18.7 14 22 15.3 22 16V18H10V16C10 15.3 13.3 14 16 14ZM8 4C10.2 4 12 5.8 12 8C12 10.2 10.2 12 8 12C5.8 12 4 10.2 4 8C4 5.8 5.8 4 8 4ZM8 14C10.7 14 14 15.3 14 16V18H2V16C2 15.3 5.3 14 8 14Z"/>
                </svg>
                <span className="text-gray-900 font-semibold text-lg">50k+ Travelers</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trip Planning Modal */}
      {isModalOpen && (
        <TripPlanningModal 
          onClose={() => setIsModalOpen(false)}
          isAuthenticated={!!session}
        />
      )}
    </div>
  )
}