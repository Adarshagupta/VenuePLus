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
      
      {/* Hero Section with Parallax */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 animate-gradient-x"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float-slow"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-gray-600 text-sm font-medium mb-6 border border-white/20">
              ✨ AI-Powered Travel Planning
            </span>
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light mb-8 animate-fade-in-up animation-delay-200">
            <span className="block text-gray-800 font-extralight">Create</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              Extraordinary
            </span>
            <span className="block text-gray-800 font-extralight">Journeys</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
            Discover personalized travel experiences crafted by experts, powered by AI, and tailored just for you
          </p>
          
          <div className="animate-fade-in-up animation-delay-600">
            <SearchSection onOpenModal={() => setIsModalOpen(true)} />
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