'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TripData } from '../trip-planning-modal'

interface TripSummaryProps {
  tripData: TripData
  isAuthenticated: boolean
  onClose: () => void
}

export function TripSummary({ tripData, isAuthenticated, onClose }: TripSummaryProps) {
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!isAuthenticated && !phone) {
      alert('Please enter your mobile number')
      return
    }

    setIsSubmitting(true)
    
    try {
      if (!isAuthenticated) {
        // For non-authenticated users, redirect to signup with trip data
        const tripDataParam = encodeURIComponent(JSON.stringify(tripData))
        router.push(`/auth/signup?tripData=${tripDataParam}`)
        onClose() // Close the modal
        return
      }

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
        onClose()
        router.push(`/trips/${trip.id}`)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error creating trip. Please try again.')
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
        {/* Left Side - Promotional Content */}
        <div className="bg-gradient-to-br from-teal-900 to-teal-700 rounded-xl p-8 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">
              <span className="text-green-300">P</span> pickyourtrail
            </div>
            
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              CREATE<br/>
              <span className="text-green-300">SUPER HIT</span><br/>
              HOLIDAYS
            </h2>

            <div className="space-y-4 mb-8">
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
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h3 className="text-xl font-semibold mb-2">
            {isAuthenticated 
              ? 'Create your customized itinerary'
              : 'Enter mobile number to save itinerary'
            }
          </h3>
          
          {!isAuthenticated && (
            <div className="space-y-4 mb-6">
              <div className="flex">
                <div className="bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg px-3 py-3 text-gray-600">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
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
            disabled={isSubmitting || (!isAuthenticated && !phone)}
            className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? 'Creating...' 
              : isAuthenticated 
                ? 'Create Trip'
                : 'View customized itinerary'
            }
          </button>

          {!isAuthenticated && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              By continuing, you agree to our Terms & Conditions and Privacy Policy
            </p>
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

