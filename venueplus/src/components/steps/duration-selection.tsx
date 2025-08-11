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
    <div className="h-full flex flex-col">
      <div className="text-center mb-6 flex-shrink-0">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">
          How long do you want to <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">explore</span>?
        </h3>
        <p className="text-slate-600">
          Choose the perfect duration for your adventure
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {durations.map((duration) => (
          <div
            key={duration.id}
            onClick={() => handleDurationSelect(duration.label)}
            className={`group relative bg-white border-2 rounded-2xl p-4 cursor-pointer transition-all-smooth hover:scale-102 hover:shadow-lg ${
              tripData.duration === duration.label
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg scale-102'
                : 'border-gray-200 hover:border-blue-300 shadow-md'
            }`}
          >
            {duration.recommended && (
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                🏆 POPULAR
              </div>
            )}
            
            <div className="text-center">
              {/* Duration Icon */}
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                duration.id === '4-6' ? 'bg-gradient-to-br from-indigo-400 to-purple-500' :
                duration.id === '7-9' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                duration.id === '10-12' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                'bg-gradient-to-br from-pink-400 to-rose-500'
              } shadow-lg group-hover:scale-110 transition-transform`}>
                <div className="text-2xl text-white">
                  {duration.icon}
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {duration.label}
              </h4>
              
              <div className="text-xs text-gray-500 mb-3">
                {duration.id === '4-6' && 'Quick getaway'}
                {duration.id === '7-9' && 'Explore highlights'}
                {duration.id === '10-12' && 'Immersive experience'}
                {duration.id === '13-15' && 'Ultimate adventure'}
              </div>

              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                duration.id === '4-6' ? 'bg-green-100 text-green-700' :
                duration.id === '7-9' ? 'bg-blue-100 text-blue-700' :
                duration.id === '10-12' ? 'bg-purple-100 text-purple-700' :
                'bg-orange-100 text-orange-700'
              }`}>
                {duration.id === '4-6' && '💰 Budget'}
                {duration.id === '7-9' && '💎 Value'}
                {duration.id === '10-12' && '⭐ Premium'}
                {duration.id === '13-15' && '👑 Luxury'}
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  )
}
