'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Users, Clock, DollarSign, Share2, Edit3, Download } from 'lucide-react'
import { ItineraryView } from '@/components/itinerary/itinerary-view'
import { BudgetBreakdown } from '@/components/budget/budget-breakdown'
import { ItineraryGenerator, TripItinerary } from '@/lib/itinerary-generator'
import { ActivityList } from '@/components/activity/activity-list'

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

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [itinerary, setItinerary] = useState<TripItinerary | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'activities'>('itinerary')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchTrip()
  }, [session, status, params.id])

  const fetchTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${params.id}`)
      if (response.ok) {
        const tripData = await response.json()
        setTrip(tripData)
        
        // Generate detailed itinerary from trip data
        const generatedItinerary = ItineraryGenerator.generateItinerary({
          destination: tripData.destination,
          duration: tripData.duration,
          startDate: new Date(tripData.startDate),
          selectedCities: tripData.stops?.map((stop: any) => stop.city.name) || [tripData.destination],
          travelers: tripData.travelers,
          fromCity: tripData.fromCity
        })
        generatedItinerary.tripId = tripData.id
        setItinerary(generatedItinerary)
      } else {
        router.push('/trips')
      }
    } catch (error) {
      console.error('Error fetching trip:', error)
      router.push('/trips')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${trip?.name} - VenuePlus`,
        text: `Check out my ${trip?.destination} trip itinerary!`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-gentle-pulse text-slate-600">Loading your trip...</div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-800 mb-4">Trip not found</h1>
          <button onClick={() => router.push('/trips')} className="btn-primary">
            Back to Trips
          </button>
        </div>
      </div>
    )
  }

  const startDate = new Date(trip.startDate)
  const endDate = new Date(trip.endDate)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <button 
                  onClick={() => router.push('/trips')}
                  className="text-slate-500 hover:text-slate-700 transition-smooth"
                >
                  ← Back to trips
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{trip.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{days} days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{trip.travelers}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="btn-secondary flex items-center space-x-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              <button className="btn-primary flex items-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Trip</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-8 mt-8 border-b border-slate-200">
            {[
              { id: 'itinerary', label: 'Itinerary', icon: Calendar },
              { id: 'budget', label: 'Budget', icon: DollarSign },
              { id: 'activities', label: 'Activities', icon: MapPin }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium transition-smooth ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'itinerary' && (
          itinerary ? (
            <ItineraryView trip={trip} itinerary={itinerary} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Generating your detailed itinerary...</p>
              </div>
            </div>
          )
        )}
        {activeTab === 'budget' && (
          itinerary ? (
            <BudgetBreakdown trip={trip} itinerary={itinerary} />
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Calculating budget breakdown...</p>
              </div>
            </div>
          )
        )}
        {activeTab === 'activities' && <ActivityList tripId={trip.id} />}
      </div>
    </div>
  )
}
