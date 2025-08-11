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
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-gentle-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl animate-gentle-float animation-delay-400"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 py-20">
          <div className="mb-8 animate-soft-fade-in">
            <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-600 text-sm font-medium border border-slate-200">
              ✨ Smart Travel Planning
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light mb-8 animate-soft-fade-in animation-delay-200">
            <span className="block text-slate-800 font-extralight mb-2">Plan Your</span>
            <span className="block text-blue-600 font-semibold mb-2">Perfect Journey</span>
            <span className="block text-slate-700 font-light text-2xl md:text-3xl">with intelligent recommendations</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed animate-soft-fade-in animation-delay-400">
            Create personalized itineraries, discover hidden gems, and book your dream vacation with our AI-powered platform
          </p>
          
          <div className="animate-soft-fade-in animation-delay-600">
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