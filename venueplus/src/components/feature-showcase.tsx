'use client'

import { useState, useEffect, useRef } from 'react'
import { Sparkles, Zap, Shield, Clock } from 'lucide-react'

export function FeatureShowcase() {
  const [visibleCards, setVisibleCards] = useState(new Set())
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardIndex = parseInt(entry.target.getAttribute('data-card-index') || '0')
            setVisibleCards(prev => new Set([...prev, cardIndex]))
          }
        })
      },
      { threshold: 0.2 }
    )

    const cards = sectionRef.current?.querySelectorAll('[data-card-index]')
    cards?.forEach(card => observer.observe(card))

    return () => observer.disconnect()
  }, [])
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Planning",
      description: "Our intelligent algorithms create personalized itineraries based on your preferences, budget, and travel style.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Zap,
      title: "Instant Customization", 
      description: "Real-time modifications to your trip plans with smart suggestions and automatic rebooking.",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Shield,
      title: "Travel Protection",
      description: "Comprehensive travel insurance and 24/7 support to keep you safe wherever you go.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Save 10+ Hours",
      description: "Skip the endless research. Get expert-curated recommendations in minutes, not hours.",
      color: "from-purple-400 to-pink-500"
    }
  ]

  return (
    <section ref={sectionRef} className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-200/30 rounded-full blur-2xl animate-float-particles"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-float-particles" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 md:mb-6 animate-fade-in">
            Why Choose <span className="font-bold gradient-text-primary">Our Platform</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
            Experience the future of travel planning with our cutting-edge platform designed for modern travelers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-card-index={index}
              className={`group bg-white rounded-xl md:rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 md:hover:-translate-y-2 border border-gray-100 relative overflow-hidden cursor-pointer ${
                visibleCards.has(index) 
                  ? 'animate-scale-in opacity-100' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                animationDelay: `${index * 150}ms`,
                transitionDelay: `${index * 150}ms`
              }}
            >
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
              
              <div className={`w-12 md:w-16 h-12 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.color} p-3 md:p-4 mb-4 md:mb-6 group-hover:scale-110 transition-all duration-300 relative z-10 group-hover:rotate-3`}>
                <feature.icon className="w-6 md:w-8 h-6 md:h-8 text-white" />
              </div>
              
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 group-hover:text-purple-600 transition-colors duration-300 relative z-10">
                {feature.title}
              </h3>
              
              <p className="text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 relative z-10">
                {feature.description}
              </p>

              {/* Interactive border glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

