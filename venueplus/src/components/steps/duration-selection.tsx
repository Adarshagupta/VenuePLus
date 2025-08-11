'use client'

import { useState } from 'react'
import { Clock, Calendar, Sparkles, Star, Zap, Plane } from 'lucide-react'
import { TripData } from '../trip-planning-modal'

interface DurationSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function DurationSelection({ tripData, onUpdate, onNext }: DurationSelectionProps) {
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customDays, setCustomDays] = useState('')
  const durations = [
    {
      id: '4-6',
      label: '4-6 Days',
      subtitle: 'Quick getaway',
      icon: Clock,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      recommended: false,
      tag: 'Budget',
      tagColor: 'bg-green-100 text-green-700'
    },
    {
      id: '7-9',
      label: '7-9 Days',
      subtitle: 'Explore highlights',
      icon: Calendar,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      recommended: false,
      tag: 'Value',
      tagColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: '10-12',
      label: '10-12 Days',
      subtitle: 'Immersive experience',
      icon: Star,
      color: 'from-orange-400 to-pink-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      recommended: true,
      tag: 'Premium',
      tagColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: '13-15',
      label: '13-15 Days',
      subtitle: 'Ultimate adventure',
      icon: Sparkles,
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      recommended: false,
      tag: 'Luxury',
      tagColor: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'custom',
      label: 'Custom Duration',
      subtitle: 'Your perfect length',
      icon: Zap,
      color: 'from-teal-400 to-green-500',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      recommended: false,
      tag: 'Flexible',
      tagColor: 'bg-teal-100 text-teal-700'
    }
  ]

  const handleDurationSelect = (duration: string) => {
    if (duration === 'Custom Duration') {
      setShowCustomInput(true)
      return
    }
    onUpdate({ duration })
    // Auto-advance after selection
    setTimeout(() => {
      onNext()
    }, 500)
  }

  const handleCustomDurationSubmit = () => {
    const days = parseInt(customDays)
    if (days && days > 0) {
      const customDurationLabel = `${days} Day${days === 1 ? '' : 's'}`
      onUpdate({ duration: customDurationLabel })
      setTimeout(() => {
        onNext()
      }, 500)
    }
  }

  const handleCustomInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomDurationSubmit()
    }
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100"></div>
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-10 right-10 opacity-15">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-20 left-10 opacity-10">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full blur-2xl"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 opacity-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-150 to-gray-250 rounded-full blur-xl"></div>
        </div>
        
        {/* Floating Airplanes */}
        <div className="absolute top-16 right-1/4 transform rotate-12 opacity-25">
          <Plane className="w-12 h-12 text-gray-400" strokeWidth={1.5} />
          <div className="absolute top-1/2 left-0 w-16 h-0.5 bg-gradient-to-r from-gray-300/40 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
        </div>
        
        <div className="absolute bottom-32 left-16 transform -rotate-6 opacity-20">
          <Plane className="w-10 h-10 text-gray-500" strokeWidth={1.5} />
          <div className="absolute top-1/2 left-0 w-12 h-0.5 bg-gradient-to-r from-gray-400/30 to-transparent transform -translate-y-1/2 -translate-x-full"></div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="text-center mb-8 flex-shrink-0">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4 shadow-lg shadow-gray-100/50">
            <Clock className="w-5 h-5 text-gray-600 mr-2" />
            <span className="text-sm font-semibold text-gray-700">Perfect Duration</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            How long do you want to <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">explore</span>?
          </h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Choose the perfect duration for your adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
          {durations.map((duration) => {
            const IconComponent = duration.icon
            const isSelected = tripData.duration === duration.label
            
            return (
              <div
                key={duration.id}
                onClick={() => handleDurationSelect(duration.label)}
                className={`group relative bg-white/80 backdrop-blur-sm border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  isSelected
                    ? `${duration.borderColor} ${duration.bgColor} shadow-2xl scale-105 ring-4 ring-${duration.color.split('-')[1]}-200`
                    : 'border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl'
                }`}
              >
                {duration.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                    ⭐ POPULAR
                  </div>
                )}
                
                {/* Tag */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${duration.tagColor}`}>
                  {duration.tag}
                </div>
                
                <div className="text-center">
                  {/* Duration Icon */}
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-br ${duration.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <IconComponent className="w-10 h-10 text-white" strokeWidth={1.5} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {duration.label}
                  </h4>
                  
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {duration.subtitle}
                  </p>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

      {/* Custom Duration Input */}
      {showCustomInput && (
        <div className="mt-6 p-6 bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-2xl">
          <h4 className="text-lg font-bold text-gray-800 mb-4 text-center">
            How many days would you like your trip to be?
          </h4>
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              onKeyPress={handleCustomInputKeyPress}
              placeholder="Enter days"
              min="1"
              max="365"
              className="w-32 px-4 py-3 border-2 border-teal-200 rounded-xl text-center text-lg font-semibold focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all"
              autoFocus
            />
            <span className="text-gray-600 font-medium">days</span>
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <button
              onClick={() => setShowCustomInput(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleCustomDurationSubmit}
              disabled={!customDays || parseInt(customDays) <= 0}
              className="px-6 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
