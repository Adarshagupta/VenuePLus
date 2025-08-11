'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TripData } from '../trip-planning-modal'

interface TripSummaryProps {
  tripData: TripData
  isAuthenticated: boolean
  onNext?: () => void
}

export function TripSummary({ tripData, isAuthenticated, onNext }: TripSummaryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      // For non-authenticated users, redirect to signup with trip data
      const tripDataParam = encodeURIComponent(JSON.stringify({ ...tripData, useAI }))
      router.push(`/auth/signup?tripData=${tripDataParam}`)
      return
    }

    // For authenticated users, proceed to payment step
    if (onNext) {
      onNext()
      return
    }

    // Fallback: create trip without payment (old behavior)
    setIsSubmitting(true)
    
    try {

      // Calculate end date based on duration and start date
      let endDate = new Date(tripData.startDate!)
      if (tripData.duration === '4-6 Days') {
        endDate.setDate(endDate.getDate() + 5)
      } else if (tripData.duration === '7-9 Days') {
        endDate.setDate(endDate.getDate() + 8)
      } else if (tripData.duration === '10-12 Days') {
        endDate.setDate(endDate.getDate() + 11)
      } else if (tripData.duration === '13-15 Days') {
        endDate.setDate(endDate.getDate() + 14)
      }

      if (useAI) {
        // Generate AI-powered itinerary
        const aiResponse = await fetch('/api/itinerary/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            destination: tripData.destination,
            duration: tripData.duration,
            startDate: tripData.startDate,
            endDate: endDate,
            travelers: tripData.travelers,
            fromCity: tripData.fromCity,
            selectedCities: tripData.selectedCities,
            rooms: tripData.rooms,
            budget: 'mid-range',
            interests: ['culture', 'sightseeing', 'food'],
            travelStyle: 'balanced'
          }),
        })

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json()
          router.push(`/trips/${aiResult.tripId}?ai=true`)
        } else {
          console.error('Failed to generate AI itinerary')
        }
      } else {
        // For authenticated users, save to database with detailed information
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `${tripData.destination} ${tripData.duration} Adventure`,
            destination: tripData.destination,
            duration: tripData.duration,
            startDate: tripData.startDate,
            endDate: endDate,
            travelers: tripData.travelers,
            fromCity: tripData.fromCity,
            selectedCities: tripData.selectedCities,
            rooms: tripData.rooms
          }),
        })

        if (response.ok) {
          const trip = await response.json()
          router.push(`/trips/${trip.id}`)
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Error creating trip. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error creating trip. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side - VenuePlus Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-8 text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold gradient-text-white">V</span>
            </div>
            
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              {useAI ? (
                <>
                  CREATE<br/>
                  <span className="text-yellow-300">AI-POWERED</span><br/>
                  ITINERARIES
                </>
              ) : (
                <>
                  CREATE<br/>
                  <span className="text-green-300">CUSTOM</span><br/>
                  TRAVEL PLANS
                </>
              )}
            </h2>

            <div className="space-y-4 mb-8">
              {useAI ? (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🤖</span>
                    </div>
                    <span>AI-Generated Itineraries</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🎯</span>
                    </div>
                    <span>Smart Booking Options</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">💡</span>
                    </div>
                    <span>Real-time Recommendations</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">👍</span>
                    </div>
                    <span>100% Customised</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🛡️</span>
                    </div>
                    <span>Curated by Experts</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">🎧</span>
                    </div>
                    <span>24x7 Live Support</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Trip Summary and AI Toggle */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">
            {isAuthenticated 
              ? 'Choose Your Planning Method'
              : 'Login to View Full Itinerary'
            }
          </h3>
          
          {/* AI Toggle for authenticated users */}
          {isAuthenticated && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUseAI(true)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    useAI
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="font-semibold text-sm">AI Planning</div>
                    <div className="text-xs opacity-75">Recommended</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setUseAI(false)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    !useAI
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold text-sm">Basic Planning</div>
                    <div className="text-xs opacity-75">Traditional</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Trip Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold mb-3">Trip Summary:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-medium">{tripData.destination}</span>
              </div>
              {tripData.duration && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{tripData.duration}</span>
                </div>
              )}
              {tripData.startDate && (
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">
                    {tripData.startDate.toLocaleDateString()}
                  </span>
                </div>
              )}
              {tripData.travelers && (
                <div className="flex justify-between">
                  <span>Travelers:</span>
                  <span className="font-medium">{tripData.travelers}</span>
                </div>
              )}
              {tripData.fromCity && (
                <div className="flex justify-between">
                  <span>From:</span>
                  <span className="font-medium">{tripData.fromCity}</span>
                </div>
              )}
              {tripData.selectedCities && tripData.selectedCities.length > 0 && (
                <div className="flex justify-between">
                  <span>Cities:</span>
                  <span className="font-medium">{tripData.selectedCities.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 ${
              isAuthenticated
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center justify-center space-x-2">
                <span>💳</span>
                <span>Proceed to Payment</span>
              </div>
            ) : (
              'Login to Continue'
            )}
          </button>

          {!isAuthenticated && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-3">
                🔒 Sign up to unlock full itinerary with AI recommendations
              </p>
              <p className="text-xs text-gray-500">
                Your trip preferences will be saved during signup
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="mt-8 bg-green-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold mb-2">Exclusive for you</h4>
            <div className="bg-white text-green-500 px-3 py-1 rounded text-sm font-semibold inline-block">
              🎯 Scan to book flights and Get 1000 PYT Greens
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <div className="w-16 h-16 bg-black rounded grid grid-cols-4 gap-px">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className={`${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

