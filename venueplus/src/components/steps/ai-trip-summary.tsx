'use client'

import { useState } from 'react'
import { Calendar, MapPin, Users, Clock, Plane, DollarSign, ArrowRight, Sparkles, Bot, Zap } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TripData } from '../trip-planning-modal'

interface AITripSummaryProps {
  tripData: TripData
  isAuthenticated: boolean
  onClose: () => void
}

export function AITripSummary({ tripData, isAuthenticated, onClose }: AITripSummaryProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [useAI, setUseAI] = useState(true)
  const { data: session } = useSession()
  const router = useRouter()

  const handleCreateTrip = async () => {
    if (!isAuthenticated) {
      // Redirect to signup with trip data
      const tripDataParam = encodeURIComponent(JSON.stringify({ ...tripData, useAI }))
      router.push(`/auth/signup?tripData=${tripDataParam}`)
      return
    }

    setIsCreating(true)

    try {
      // Calculate end date based on duration
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
            startDate: tripData.startDate?.toISOString(),
            endDate: endDate.toISOString(),
            travelers: tripData.travelers,
            fromCity: tripData.fromCity,
            selectedCities: tripData.selectedCities,
            rooms: tripData.rooms,
            // Add AI preferences
            budget: 'mid-range',
            interests: ['culture', 'sightseeing', 'food'],
            travelStyle: 'balanced',
            accommodation: 'hotel',
            transportation: 'mixed'
          }),
        })

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json()
          router.push(`/trips/${aiResult.tripId}?ai=true`)
        } else {
          console.error('Failed to generate AI itinerary')
        }
      } else {
        // Create basic trip
        const response = await fetch('/api/trips', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: `Trip to ${tripData.destination}`,
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
          const result = await response.json()
          router.push(`/trips/${result.trip.id}`)
        } else {
          console.error('Failed to create trip')
        }
      }
    } catch (error) {
      console.error('Error creating trip:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8 flex-shrink-0">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-4">
          <span className="text-sm font-medium gradient-text-primary">Ready to Go!</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Your Trip Summary</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Review your travel preferences and choose how to create your personalized itinerary
        </p>
      </div>

      {/* AI Toggle */}
      <div className="mb-8 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUseAI(true)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                useAI
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  useAI ? 'bg-gradient-to-br from-purple-500 to-blue-600' : 'bg-gray-100'
                }`}>
                  <Bot className={`w-6 h-6 ${useAI ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`text-lg font-bold ${useAI ? 'text-purple-900' : 'text-gray-700'}`}>
                    AI-Powered Planning
                  </h3>
                  <p className={`text-sm ${useAI ? 'text-purple-700' : 'text-gray-500'}`}>
                    Recommended
                  </p>
                </div>
                {useAI && <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />}
              </div>
              <ul className={`text-sm space-y-2 text-left ${useAI ? 'text-purple-800' : 'text-gray-600'}`}>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Intelligent itinerary generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Real-time package comparison</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Individual booking options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Local insights & money-saving tips</span>
                </li>
              </ul>
            </button>

            <button
              onClick={() => setUseAI(false)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                !useAI
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-gray-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  !useAI ? 'bg-gradient-to-br from-blue-500 to-gray-600' : 'bg-gray-100'
                }`}>
                  <Calendar className={`w-6 h-6 ${!useAI ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="text-left">
                  <h3 className={`text-lg font-bold ${!useAI ? 'text-blue-900' : 'text-gray-700'}`}>
                    Basic Planning
                  </h3>
                  <p className={`text-sm ${!useAI ? 'text-blue-700' : 'text-gray-500'}`}>
                    Traditional
                  </p>
                </div>
              </div>
              <ul className={`text-sm space-y-2 text-left ${!useAI ? 'text-blue-800' : 'text-gray-600'}`}>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 flex items-center justify-center">•</span>
                  <span>Standard itinerary template</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 flex items-center justify-center">•</span>
                  <span>Manual planning required</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 flex items-center justify-center">•</span>
                  <span>Basic recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-4 h-4 flex items-center justify-center">•</span>
                  <span>Less personalization</span>
                </li>
              </ul>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trip Details */}
          <div className="space-y-6">
            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>Destination</span>
              </h3>
              <p className="text-2xl font-bold gradient-text-primary">{tripData.destination}</p>
              {tripData.selectedCities && tripData.selectedCities.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Cities to visit:</p>
                  <div className="flex flex-wrap gap-2">
                    {tripData.selectedCities.map((city: string, index: number) => (
                      <span key={index} className="badge badge-blue">{city}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span>Travel Dates</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-semibold">{tripData.startDate?.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{tripData.duration}</span>
                </div>
              </div>
            </div>

            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Plane className="w-5 h-5 text-green-500" />
                <span>Departure</span>
              </h3>
              <p className="text-lg font-semibold">{tripData.fromCity}</p>
            </div>
          </div>

          {/* Travel Information */}
          <div className="space-y-6">
            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-500" />
                <span>Travelers</span>
              </h3>
              <p className="text-lg font-semibold mb-3">{tripData.travelers}</p>
              {tripData.rooms && tripData.rooms.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Room configuration:</p>
                  <div className="space-y-2">
                    {tripData.rooms.map((room: any, index: number) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm">Room {index + 1}</span>
                        <span className="text-sm font-medium">
                          {room.adults} Adult{room.adults > 1 ? 's' : ''}
                          {room.children > 0 && `, ${room.children} Child${room.children > 1 ? 'ren' : ''}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="card-elegant p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Estimated Cost</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base Package:</span>
                  <span className="font-semibold">$800 - $1,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Per Person:</span>
                  <span className="font-semibold">$400 - $750</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total Range:</span>
                    <span className="text-xl font-bold gradient-text-primary">$1,200 - $2,250</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`card-elegant p-6 ${
              useAI 
                ? 'bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200' 
                : 'bg-gradient-to-br from-blue-50 to-gray-50 border border-blue-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${useAI ? 'text-purple-900' : 'text-blue-900'}`}>
                {useAI ? "What's Next with AI?" : "What's Next?"}
              </h3>
              <ul className={`space-y-2 text-sm ${useAI ? 'text-purple-800' : 'text-blue-800'}`}>
                {useAI ? (
                  <>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>AI generates personalized day-by-day itinerary</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Real-time comparison of travel packages</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Individual booking options for flights, hotels, activities</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Smart recommendations and money-saving tips</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Basic itinerary template</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Standard travel recommendations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Manual planning and booking required</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <button
            onClick={handleCreateTrip}
            disabled={isCreating}
            className={`px-8 py-4 text-lg font-semibold flex items-center space-x-3 mx-auto rounded-2xl transition-all duration-300 ${
              useAI
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                : 'bg-gradient-to-r from-blue-500 to-gray-600 hover:from-blue-600 hover:to-gray-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {isCreating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{useAI ? 'Generating AI Itinerary...' : 'Creating Your Trip...'}</span>
              </>
            ) : (
              <>
                {useAI && <Bot className="w-5 h-5" />}
                <span>
                  {isAuthenticated 
                    ? (useAI ? 'Generate AI Itinerary' : 'Create Basic Trip')
                    : 'Sign Up to Continue'
                  }
                </span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-600 mt-3">
              Your trip preferences will be saved during the signup process
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
