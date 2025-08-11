'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Calendar, MapPin, Users, Clock, Trash2, Edit3, Share2 } from 'lucide-react'
import { Header } from '@/components/header'

interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  duration: string
  travelers: string
  fromCity: string
  createdAt: string
}

export default function TripsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchTrips()
  }, [session, status])

  const fetchTrips = async () => {
    try {
      const response = await fetch('/api/trips')
      if (response.ok) {
        const tripsData = await response.json()
        setTrips(tripsData)
      }
    } catch (error) {
      console.error('Error fetching trips:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setTrips(trips.filter(trip => trip.id !== tripId))
      } else {
        alert('Failed to delete trip')
      }
    } catch (error) {
      console.error('Error deleting trip:', error)
      alert('Error deleting trip')
    }
  }

  const getTripStatus = (startDate: string, endDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)

    if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-700' }
    if (now >= start && now <= end) return { status: 'ongoing', color: 'bg-green-100 text-green-700' }
    return { status: 'completed', color: 'bg-gray-100 text-gray-700' }
  }

  const getDaysUntil = (startDate: string) => {
    const now = new Date()
    const start = new Date(startDate)
    const diffTime = start.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-gentle-pulse text-slate-600">Loading your trips...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="pt-20">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800 mb-2">My Trips</h1>
                <p className="text-slate-600">
                  {trips.length === 0 
                    ? "Start planning your next adventure" 
                    : `${trips.length} trip${trips.length !== 1 ? 's' : ''} planned`
                  }
                </p>
              </div>
              <Link 
                href="/"
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Trip</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {trips.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">No trips planned yet</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Start your journey by planning your first trip. Our AI will help you create the perfect itinerary.
              </p>
              <Link href="/" className="btn-primary">
                Plan Your First Trip
              </Link>
            </div>
          ) : (
            /* Trips Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const startDate = new Date(trip.startDate)
                const endDate = new Date(trip.endDate)
                const status = getTripStatus(trip.startDate, trip.endDate)
                const daysUntil = getDaysUntil(trip.startDate)

                return (
                  <div key={trip.id} className="card-elegant overflow-hidden hover:shadow-xl transition-elegant">
                    {/* Header */}
                    <div className="h-32 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-white text-lg leading-tight mb-1">
                            {trip.name}
                          </h3>
                          <p className="text-blue-100 text-sm">{trip.destination}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color} bg-white/90`}>
                          {status.status}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="text-sm opacity-90">
                          {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{trip.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{trip.travelers}</span>
                          </div>
                        </div>
                      </div>

                      {status.status === 'upcoming' && daysUntil > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-sm text-blue-700">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days to go`}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/trips/${trip.id}`}
                          className="flex-1 text-center btn-primary py-2 text-sm"
                        >
                          View Details
                        </Link>
                        
                        <button 
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-smooth"
                          title="Edit trip"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-smooth"
                          title="Share trip"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-smooth"
                          title="Delete trip"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

