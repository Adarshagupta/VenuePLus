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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('destinations')
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [selectedDestination, setSelectedDestination] = useState({
    name: 'Santorini, Greece',
    description: 'Mediterranean Paradise',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80',
    rating: '4.9',
    reviews: '3.2k'
  })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Destinations data
  const destinations = [
    {
      name: 'Santorini, Greece',
      description: 'Mediterranean Paradise',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1335&q=80',
      rating: '4.9',
      reviews: '3.2k',
      query: 'Santorini, Greece'
    },
    {
      name: 'Tokyo, Japan',
      description: 'Modern Metropolis',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1194&q=80',
      rating: '4.8',
      reviews: '5.1k',
      query: 'Tokyo, Japan'
    },
    {
      name: 'Paris, France',
      description: 'City of Lights',
      image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: '4.7',
      reviews: '4.8k',
      query: 'Paris, France'
    },
    {
      name: 'Bali, Indonesia',
      description: 'Tropical Paradise',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: '4.6',
      reviews: '2.9k',
      query: 'Bali, Indonesia'
    },
    {
      name: 'Rome, Italy',
      description: 'Eternal City',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      rating: '4.5',
      reviews: '3.7k',
      query: 'Rome, Italy'
    }
  ]

  const handleDestinationSelect = (destination: typeof destinations[0]) => {
    setSelectedDestination(destination)
    setSearchQuery(destination.query)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Main Content */}
      <main className="pt-4 relative overflow-hidden">
        {/* Interactive Floating Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Parallax Particles */}
          <div 
            className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl animate-pulse transform transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px) translateY(${scrollY * 0.1}px)`
            }}
          ></div>
          <div 
            className="absolute top-40 right-20 w-20 h-20 bg-violet-300/30 rounded-full blur-2xl animate-bounce transform transition-transform duration-700 ease-out" 
            style={{
              animationDuration: '3s',
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.015}px) translateY(${scrollY * 0.05}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-40 left-1/4 w-24 h-24 bg-indigo-200/25 rounded-full blur-2xl animate-pulse transform transition-transform duration-800 ease-out" 
            style={{
              animationDelay: '1s',
              transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * -0.01}px) translateY(${scrollY * 0.08}px)`
            }}
          ></div>
          <div 
            className="absolute bottom-20 right-1/3 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-bounce transform transition-transform duration-900 ease-out" 
            style={{
              animationDuration: '4s', 
              animationDelay: '2s',
              transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * 0.01}px) translateY(${scrollY * 0.06}px)`
            }}
          ></div>
          
          {/* Additional Interactive Particles */}
          <div 
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-gradient-to-r from-yellow-400/40 to-orange-400/40 rounded-full blur-sm animate-pulse transform transition-all duration-500"
            style={{
              transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * -0.02}px) rotate(${scrollY * 0.1}deg)`
            }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-sm animate-bounce transform transition-all duration-600"
            style={{
              animationDuration: '2.5s',
              transform: `translate(${mousePosition.x * -0.025}px, ${mousePosition.y * 0.025}px) scale(${1 + scrollY * 0.0001})`
            }}
          ></div>
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
              

              
              {/* Interactive Search Bar with Autocomplete */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSearchSuggestions(e.target.value.length > 0)
                    }}
                    onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    placeholder="Where would you like to go? (e.g., Paris, Tokyo, Bali)"
                    className="w-full px-5 py-4 pr-14 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400 text-base bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
                  />
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white p-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                  </button>
                  
                  {/* Search Suggestions Dropdown */}
                  {showSearchSuggestions && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-slide-down">
                      <div className="p-4">
                        <div className="text-sm font-medium text-gray-500 mb-3">Popular Destinations</div>
                        <div className="space-y-2">
                          {['Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'Rome, Italy', 'Santorini, Greece'].filter(dest => 
                            dest.toLowerCase().includes(searchQuery.toLowerCase())
                          ).map((destination, index) => (
                            <button
                              key={destination}
                              onClick={() => {
                                setSearchQuery(destination)
                                setShowSearchSuggestions(false)
                                setIsModalOpen(true)
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center space-x-3 group"
                            >
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                              </div>
                              <span className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">{destination}</span>
                            </button>
                          ))}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <button 
                            onClick={() => {
                              setIsModalOpen(true)
                              setShowSearchSuggestions(false)
                            }}
                            className="w-full text-center py-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                          >
                            Start Planning Your Trip →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Interactive Popular Tags */}
              <div className="mb-8">
                <span className="text-sm text-gray-500 font-medium mr-4">Popular:</span>
                <div className="inline-flex flex-wrap gap-2">
                  {['Paris', 'Tokyo', 'Bali', 'Rome', 'Santorini', 'Iceland'].map((tag, index) => (
                    <button 
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag)
                        setIsModalOpen(true)
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-1 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-sm border border-transparent hover:border-gray-200"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {tag.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Content - Enhanced Visual Gallery */}
            <div className="flex-1 relative max-w-[900px] pl-8">
              {/* Main Hero Image */}
              <div className="relative rounded-[2rem] h-[480px] overflow-hidden border border-gray-100 shadow-2xl group">
                <img 
                  src={selectedDestination.image}
                  alt={`Beautiful ${selectedDestination.name} landscape`}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  style={{
                    filter: 'brightness(1.05) contrast(1.02)',
                  }}
                />
                
                {/* Overlay with location info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                
                {/* Location badge */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform transition-all duration-300 group-hover:scale-105">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedDestination.name}</div>
                      <div className="text-sm text-gray-600">{selectedDestination.description}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{selectedDestination.rating}</span>
                      <span className="text-xs text-gray-500">({selectedDestination.reviews} reviews)</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSearchQuery(selectedDestination.query)
                        setIsModalOpen(true)
                      }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                    >
                      Explore
                    </button>
                  </div>
                </div>
                
                {/* Top right badge */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm animate-bounce-in">
                  <div className="text-xs text-blue-600 font-medium">🏆 Most Popular</div>
                </div>
              </div>
              
              {/* Mini Gallery Below Main Image */}
              <div className="mt-6 flex justify-center space-x-4">
                {/* Santorini thumbnail */}
                <div 
                  className={`w-24 h-24 rounded-2xl overflow-hidden shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-in-right relative ${
                    selectedDestination.name === destinations[0].name ? 'ring-4 ring-blue-500 ring-opacity-60' : ''
                  }`}
                  style={{ animationDelay: '0.1s' }}
                  onMouseEnter={() => handleDestinationSelect(destinations[0])}
                  onClick={() => {
                    handleDestinationSelect(destinations[0])
                    setIsModalOpen(true)
                  }}
                >
                  <img 
                    src={destinations[0].image}
                    alt={`${destinations[0].name} landscape`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-1 left-2 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                    {destinations[0].name.split(',')[0]}
                  </div>
                  
                  {/* Active indicator */}
                  {selectedDestination.name === destinations[0].name && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {destinations.slice(1).map((destination, index) => (
                  <div 
                    key={destination.name}
                    className={`w-24 h-24 rounded-2xl overflow-hidden shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-110 hover:shadow-2xl animate-slide-in-right relative ${
                      selectedDestination.name === destination.name ? 'ring-4 ring-blue-500 ring-opacity-60' : ''
                    }`}
                    style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                    onMouseEnter={() => handleDestinationSelect(destination)}
                    onClick={() => {
                      handleDestinationSelect(destination)
                      setIsModalOpen(true)
                    }}
                  >
                    <img 
                      src={destination.image}
                      alt={`${destination.name} landscape`}
                      className="w-full h-full object-cover transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-1 left-2 text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity duration-300">
                      {destination.name.split(',')[0]}
                    </div>
                    
                    {/* Active indicator */}
                    {selectedDestination.name === destination.name && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-1/3 -left-6 w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 -right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
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
        
                        {/* Interactive Destination Horizontal Scroll */}
            <div className="overflow-x-auto scrollbar-hide mb-12 scroll-smooth" style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              <div className="flex space-x-6 pb-4" style={{ width: 'max-content' }}>
              {/* Enhanced Travel destination cards with real images */}
              {[
                { 
                  name: 'Paris', 
                  country: 'France', 
                  rating: '4.9', 
                  image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-blue-50/50 to-purple-50/50' 
                },
                { 
                  name: 'Tokyo', 
                  country: 'Japan', 
                  rating: '4.8', 
                  image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-red-50/50 to-pink-50/50' 
                },
                { 
                  name: 'Bali', 
                  country: 'Indonesia', 
                  rating: '4.7', 
                  image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-green-50/50 to-teal-50/50' 
                },
                { 
                  name: 'Rome', 
                  country: 'Italy', 
                  rating: '4.6', 
                  image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-orange-50/50 to-yellow-50/50' 
                },
                { 
                  name: 'Santorini', 
                  country: 'Greece', 
                  rating: '4.9', 
                  image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-purple-50/50 to-indigo-50/50' 
                },
                { 
                  name: 'Iceland', 
                  country: 'Reykjavik', 
                  rating: '4.8', 
                  image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-cyan-50/50 to-blue-50/50' 
                },
                { 
                  name: 'Dublin', 
                  country: 'Ireland', 
                  rating: '4.5', 
                  image: 'https://images.unsplash.com/photo-1549918864-48ac978761a4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-emerald-50/50 to-green-50/50' 
                },
                { 
                  name: 'Morocco', 
                  country: 'Marrakech', 
                  rating: '4.4', 
                  image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                  hoverGradient: 'from-rose-50/50 to-pink-50/50' 
                }
              ].map((destination, index) => (
                <div 
                  key={destination.name}
                  onMouseEnter={() => setHoveredCard(destination.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => {
                    setSearchQuery(`${destination.name}, ${destination.country}`)
                    setIsModalOpen(true)
                  }}
                  className={`w-72 h-96 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transform transition-all duration-500 group perspective-1000 flex-shrink-0 ${
                    hoveredCard === destination.name 
                      ? 'shadow-2xl -translate-y-3 scale-105 rotate-x-2 rotate-y-2' 
                      : 'hover:shadow-xl hover:-translate-y-2 hover:scale-102'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="h-4/5 relative overflow-hidden">
                    <img 
                      src={destination.image}
                      alt={`${destination.name}, ${destination.country}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    {/* Location overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 mx-auto mb-1 opacity-90 drop-shadow-lg text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <div className="text-xs font-semibold tracking-wide text-white drop-shadow-lg">{destination.name.toUpperCase()}</div>
                      </div>
                    </div>
                    
                    {/* Interactive shine effect */}
                    {hoveredCard === destination.name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12 -translate-x-full animate-shine"></div>
                    )}
                  </div>
                  <div className={`h-1/5 p-4 flex items-center justify-between bg-gradient-to-r from-white ${destination.hoverGradient} transition-all duration-500`}>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700 transition-colors">{destination.name}, {destination.country}</div>
                    <div className="text-xs text-yellow-500 font-medium">⭐ {destination.rating}</div>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Scroll Indicator */}
            <div className="flex justify-center items-center space-x-2 mb-8">
              <span className="text-sm text-gray-500">Scroll horizontally to explore more destinations</span>
              <svg className="w-4 h-4 text-gray-400 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
              </svg>
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

      {/* Enhanced Section Components */}
      <SearchSection onOpenModal={() => setIsModalOpen(true)} />
      <FeatureShowcase />
      <StatsSection />
      <TestimonialSection />

      {/* Trip Planning Modal */}
      {isModalOpen && (
        <TripPlanningModal 
          onClose={() => setIsModalOpen(false)}
          isAuthenticated={!!session}
        />
      )}
      
      {/* Custom Cursor Trail Effect */}
      <div 
        className="fixed pointer-events-none z-50 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-50 mix-blend-multiply transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'scale(0.8)',
        }}
      ></div>
    </div>
  )
}