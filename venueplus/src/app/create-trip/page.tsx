'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTripContext } from '@/contexts/TripContext'
import { CheckCircle, Loader, MapPin } from 'lucide-react'

export default function CreateTripPage() {
  const { data: session, status } = useSession()
  const { tripData, clearTripData } = useTripContext()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [tripCreated, setTripCreated] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (!tripData) {
      router.push('/')
      return
    }

    // Automatically create the trip
    createTrip()
  }, [session, status, tripData])

  const createTrip = async () => {
    if (!tripData || !session) return

    setIsCreating(true)
    setError('')

    try {
      // Calculate end date based on duration and start date
      let endDate = new Date(tripData.startDate!)
      
      // Helper function to extract days from duration string
      const getDaysFromDuration = (duration: string): number => {
        if (duration === '4-6 Days') return 5
        if (duration === '7-9 Days') return 8
        if (duration === '10-12 Days') return 11
        if (duration === '13-15 Days') return 14
        
        // Handle custom duration formats like "5 Days" or "10 Day"
        const customMatch = duration.match(/(\d+)\s+Days?/)
        if (customMatch) {
          return parseInt(customMatch[1])
        }
        
        // Default fallback
        return 7
      }
      
      const daysToAdd = getDaysFromDuration(tripData.duration || '')
      endDate.setDate(endDate.getDate() + daysToAdd)

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
        setTripCreated(true)
        clearTripData() // Clear the stored trip data
        
        // Redirect to the trip details after a short delay
        setTimeout(() => {
          router.push(`/trips/${trip.id}`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create trip. Please try again.')
      }
    } catch (error) {
      console.error('Error creating trip:', error)
      setError('An error occurred while creating your trip. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {isCreating && (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Creating Your Trip</h2>
              <p className="text-gray-600 mb-6">
                We're setting up your perfect {tripData?.destination} adventure...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </>
          )}

          {tripCreated && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your {tripData?.destination} trip has been saved. Redirecting to your itinerary...
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{tripData?.destination}</span>
                <span>•</span>
                <span>{tripData?.duration}</span>
                <span>•</span>
                <span>{tripData?.travelers}</span>
              </div>
            </>
          )}

          {error && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="w-8 h-8 text-red-600">❌</div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={createTrip}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

