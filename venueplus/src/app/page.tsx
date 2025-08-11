'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
      
      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-emerald-50 overflow-hidden">
        {/* Background Images - Three Box Layout */}
        <div className="absolute inset-0">
          {/* Main Large Image - Top Right */}
          <div className="absolute top-0 right-0 w-1/2 h-3/5 rounded-bl-[80px] overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=800&h=600&fit=crop&crop=faces,entropy&auto=format"
              alt="Milan Cathedral"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-sm font-semibold">MILAN</div>
                <div className="text-xs opacity-90">Architecture</div>
              </div>
            </div>
          </div>
          
          {/* Venice Canal - Middle Right */}
          <div className="absolute top-1/3 right-8 w-64 h-48 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=600&h=400&fit=crop&crop=faces,entropy&auto=format"
              alt="Venice Canals"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-3 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-sm font-semibold">VENICE</div>
                <div className="text-xs opacity-90">Canals</div>
              </div>
            </div>
          </div>
          
          {/* Food Image - Bottom Right */}
          <div className="absolute bottom-0 right-0 w-80 h-72 rounded-tl-[60px] overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&crop=faces,entropy&auto=format"
              alt="Italian Cuisine"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <div className="text-sm font-semibold">ITALIAN CUISINE</div>
                <div className="text-xs opacity-90">Authentic Flavors</div>
              </div>
            </div>
          </div>
          
          {/* Floating decorative elements for theme blending */}
          <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-emerald-200/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="w-full px-6 lg:px-8 xl:px-12 py-20">
              <div className="max-w-2xl ml-4 lg:ml-6">
              {/* Badge */}
              <div className="mb-6">
                <span className="inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                  LOCAL WONDERS AWAIT ...
                </span>
              </div>
              
              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-gray-900">
                <span className="block mb-2">Discover Your</span>
                <span className="block mb-2">
                  City's
                </span>
                <span className="block">Hidden Treasures.</span>
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-10 max-w-lg leading-relaxed">
                Your digital gateway to the heartbeat of your city. Immerse yourself in the 
                vibrancy and diversity that defines our urban landscape.
              </p>
              
              {/* Search Form - Enhanced with Theme */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-5 max-w-4xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter keyword ..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-gray-50/80"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 appearance-none bg-gray-50/80">
                      <option>Category</option>
                      <option>🍽️ Restaurants</option>
                      <option>🏛️ Attractions</option>
                      <option>🏨 Hotels</option>
                      <option>🎭 Events</option>
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 appearance-none bg-gray-50/80">
                      <option>Select City</option>
                      <option>🏛️ Milan</option>
                      <option>🚤 Venice</option>
                      <option>🏛️ Rome</option>
                      <option>🎨 Florence</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Search Place
                  </button>
                </div>
                
                {/* Quick destination tags inspired by the images */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500 font-medium">Trending:</span>
                  <button className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm rounded-full transition-colors">
                    Milan Cathedral
                  </button>
                  <button className="px-3 py-1 bg-teal-100 hover:bg-teal-200 text-teal-700 text-sm rounded-full transition-colors">
                    Venice Gondolas
                  </button>
                  <button className="px-3 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-sm rounded-full transition-colors">
                    Tuscan Food
                  </button>
                </div>
              </div>
              
              {/* Urban Badge - Simplified */}
              <div className="mt-8 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <span className="text-violet-600 font-semibold">URBAN</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FeatureShowcase />
      <TestimonialSection />
      <StatsSection />

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