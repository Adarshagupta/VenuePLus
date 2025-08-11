'use client'

import { useState } from 'react'
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
    },
    {
      id: 'custom',
      label: 'Custom Duration',
      icon: '⚡',
      recommended: false
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
                duration.id === '13-15' ? 'bg-gradient-to-br from-pink-400 to-rose-500' :
                'bg-gradient-to-br from-emerald-400 to-teal-500'
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
                {duration.id === 'custom' && 'Your perfect length'}
              </div>

              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                duration.id === '4-6' ? 'bg-green-100 text-green-700' :
                duration.id === '7-9' ? 'bg-blue-100 text-blue-700' :
                duration.id === '10-12' ? 'bg-purple-100 text-purple-700' :
                duration.id === '13-15' ? 'bg-orange-100 text-orange-700' :
                'bg-teal-100 text-teal-700'
              }`}>
                {duration.id === '4-6' && '💰 Budget'}
                {duration.id === '7-9' && '💎 Value'}
                {duration.id === '10-12' && '⭐ Premium'}
                {duration.id === '13-15' && '👑 Luxury'}
                {duration.id === 'custom' && '🎯 Flexible'}
              </div>
            </div>
          </div>
        ))}
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
  )
}
