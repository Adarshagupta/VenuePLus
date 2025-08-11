'use client'

import { Sparkles, Zap, Shield, Clock } from 'lucide-react'

export function FeatureShowcase() {
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
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-gray-800 mb-6">
            Why Choose <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VenuePlus</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of travel planning with our cutting-edge platform designed for modern travelers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all-smooth hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform-smooth`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

