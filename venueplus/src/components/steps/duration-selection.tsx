'use client'

import { TripData } from '../trip-planning-modal'

interface DurationSelectionProps {
  tripData: TripData
  onUpdate: (data: Partial<TripData>) => void
  onNext: () => void
}

export function DurationSelection({ tripData, onUpdate, onNext }: DurationSelectionProps) {
  const durations = [
    {
      id: '4-6',
      label: '4-6 Days',
      icon: '🌙',
      recommended: false
    },
    {
      id: '7-9',
      label: '7-9 Days',
      icon: '🌙',
      recommended: false
    },
    {
      id: '10-12',
      label: '10-12 Days',
      icon: '🌙',
      recommended: true
    },
    {
      id: '13-15',
      label: '13-15 Days',
      icon: '☀️',
      recommended: false
    }
  ]

  const handleDurationSelect = (duration: string) => {
    onUpdate({ duration })
    // Auto-advance after selection
    setTimeout(() => {
      onNext()
    }, 500)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-light text-gray-800 mb-4">
          How long do you want to <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">explore</span>?
        </h3>
        <p className="text-gray-600 text-lg">
          Choose the perfect duration for your adventure
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {durations.map((duration) => (
          <div
            key={duration.id}
            onClick={() => handleDurationSelect(duration.label)}
            className={`group relative bg-white border-2 rounded-3xl p-8 cursor-pointer transition-all-smooth hover:scale-105 hover:shadow-2xl ${
              tripData.duration === duration.label
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl scale-105'
                : 'border-gray-200 hover:border-blue-300 shadow-lg'
            }`}
          >
            {duration.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-shimmer">
                🏆 MOST POPULAR
              </div>
            )}
            
            <div className="text-center">
              {/* Duration Icon - Enhanced with better gradients */}
              <div className={`w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform-smooth ${
                duration.id === '4-6' ? 'bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500' :
                duration.id === '7-9' ? 'bg-gradient-to-br from-blue-400 via-cyan-500 to-teal-500' :
                duration.id === '10-12' ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' :
                'bg-gradient-to-br from-pink-400 via-rose-500 to-orange-500'
              } shadow-xl`}>
                <div className="absolute inset-0 bg-white/20 animate-float"></div>
                <div className="relative z-10">
                  {/* Decorative stars */}
                  <div className="absolute -top-3 -left-3 text-white/80 text-sm animate-float">✨</div>
                  <div className="absolute -top-2 right-0 text-white/80 text-sm animate-float-delayed">⭐</div>
                  <div className="absolute bottom-0 -left-2 text-white/80 text-sm animate-float-slow">💫</div>
                  
                  {/* Duration icon */}
                  <div className="text-4xl text-white">
                    {duration.id === '4-6' && '🌙'}
                    {duration.id === '7-9' && '🌊'}
                    {duration.id === '10-12' && '🌟'}
                    {duration.id === '13-15' && '☀️'}
                  </div>
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                {duration.label}
              </h4>
              
              <div className="text-sm text-gray-500 mb-4">
                {duration.id === '4-6' && 'Perfect for a quick getaway'}
                {duration.id === '7-9' && 'Ideal for exploring highlights'}
                {duration.id === '10-12' && 'Best for immersive experience'}
                {duration.id === '13-15' && 'Ultimate adventure package'}
              </div>

              {/* Price indicator */}
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                duration.id === '4-6' ? 'bg-green-100 text-green-700' :
                duration.id === '7-9' ? 'bg-blue-100 text-blue-700' :
                duration.id === '10-12' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {duration.id === '4-6' && '💰 Budget Friendly'}
                {duration.id === '7-9' && '💎 Great Value'}
                {duration.id === '10-12' && '⭐ Premium'}
                {duration.id === '13-15' && '👑 Luxury'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Customer Review */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 max-w-3xl mx-auto border border-blue-100">
        <div className="flex items-start space-x-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            S
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <h5 className="font-bold text-gray-800 text-lg">Snekha K</h5>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "We had an amazing trip to Bali, all thanks to VenuePlus! The 10-12 day package was perfect - gave us enough time to explore temples, beaches, and local culture without feeling rushed."
            </p>
            <div className="mt-3 text-sm text-gray-500">
              📍 10-Day Bali Adventure • Verified Traveler
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
