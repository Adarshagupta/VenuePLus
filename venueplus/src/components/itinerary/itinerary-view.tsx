'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, Camera, Star } from 'lucide-react'

interface ItineraryDay {
  date: string
  activities: Activity[]
}

interface Activity {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  location: string
  category: string
  estimatedCost: number
  imageUrl?: string
  rating?: number
}

interface ItineraryViewProps {
  tripId: string
}

export function ItineraryView({ tripId }: ItineraryViewProps) {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItinerary()
  }, [tripId])

  const fetchItinerary = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockItinerary: ItineraryDay[] = [
        {
          date: "2025-08-13",
          activities: [
            {
              id: "1",
              name: "Arrival in Bali",
              description: "Arrive at Ngurah Rai International Airport and transfer to hotel",
              startTime: "10:00",
              endTime: "12:00",
              location: "Ngurah Rai Airport",
              category: "Transport",
              estimatedCost: 25,
              imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
            },
            {
              id: "2",
              name: "Check-in & Lunch",
              description: "Check into your beachfront resort and enjoy welcome lunch",
              startTime: "12:30",
              endTime: "14:00",
              location: "Resort Restaurant",
              category: "Accommodation",
              estimatedCost: 40,
              rating: 4.5
            },
            {
              id: "3",
              name: "Sunset at Tanah Lot",
              description: "Visit the iconic temple and watch the sunset over the ocean",
              startTime: "16:00",
              endTime: "19:00",
              location: "Tanah Lot Temple",
              category: "Sightseeing",
              estimatedCost: 15,
              imageUrl: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              rating: 4.8
            }
          ]
        },
        {
          date: "2025-08-14",
          activities: [
            {
              id: "4",
              name: "Ubud Rice Terraces",
              description: "Explore the beautiful Tegallalang Rice Terraces",
              startTime: "09:00",
              endTime: "11:30",
              location: "Tegallalang, Ubud",
              category: "Nature",
              estimatedCost: 10,
              imageUrl: "https://images.unsplash.com/photo-1555400143-4fb4b2dc73ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
              rating: 4.6
            },
            {
              id: "5",
              name: "Traditional Balinese Lunch",
              description: "Authentic Balinese cuisine at a local warung",
              startTime: "12:00",
              endTime: "13:30",
              location: "Ubud Center",
              category: "Food",
              estimatedCost: 20,
              rating: 4.4
            },
            {
              id: "6",
              name: "Monkey Forest Sanctuary",
              description: "Visit the sacred monkey forest in Ubud",
              startTime: "14:00",
              endTime: "15:30",
              location: "Ubud Monkey Forest",
              category: "Wildlife",
              estimatedCost: 5,
              rating: 4.2
            }
          ]
        }
      ]
      
      setItinerary(mockItinerary)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching itinerary:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-gentle-pulse text-slate-600 text-center py-12">
        Loading your itinerary...
      </div>
    )
  }

  const getTotalCost = () => {
    return itinerary.reduce((total, day) => 
      total + day.activities.reduce((dayTotal, activity) => dayTotal + activity.estimatedCost, 0), 0
    )
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Transport': 'bg-blue-100 text-blue-700',
      'Accommodation': 'bg-green-100 text-green-700',
      'Sightseeing': 'bg-purple-100 text-purple-700',
      'Nature': 'bg-emerald-100 text-emerald-700',
      'Food': 'bg-orange-100 text-orange-700',
      'Wildlife': 'bg-yellow-100 text-yellow-700',
      'Adventure': 'bg-red-100 text-red-700'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="card-elegant p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Trip Overview</h2>
          <div className="text-2xl font-bold text-blue-600">${getTotalCost()}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="font-semibold text-slate-800">{itinerary.length}</div>
            <div className="text-slate-600">Days Planned</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="font-semibold text-slate-800">
              {itinerary.reduce((total, day) => total + day.activities.length, 0)}
            </div>
            <div className="text-slate-600">Activities</div>
          </div>
          <div className="text-center p-3 bg-slate-50 rounded-lg">
            <div className="font-semibold text-slate-800">${Math.round(getTotalCost() / itinerary.length)}</div>
            <div className="text-slate-600">Avg. per Day</div>
          </div>
        </div>
      </div>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        {itinerary.map((day, dayIndex) => (
          <div key={day.date} className="card-elegant overflow-hidden">
            {/* Day Header */}
            <div className="bg-blue-50 px-6 py-4 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {dayIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-slate-600">{day.activities.length} activities planned</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">
                    ${day.activities.reduce((total, activity) => total + activity.estimatedCost, 0)}
                  </div>
                  <div className="text-sm text-slate-600">day total</div>
                </div>
              </div>
            </div>

            {/* Activities */}
            <div className="p-6 space-y-4">
              {day.activities.map((activity, activityIndex) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-smooth">
                  {/* Time */}
                  <div className="flex-shrink-0 text-center min-w-[80px]">
                    <div className="text-sm font-semibold text-slate-800">{activity.startTime}</div>
                    <div className="text-xs text-slate-500">{activity.endTime}</div>
                  </div>

                  {/* Image */}
                  {activity.imageUrl && (
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 truncate">{activity.name}</h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                          {activity.category}
                        </span>
                        <span className="font-semibold text-slate-800">${activity.estimatedCost}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{activity.location}</span>
                      </div>
                      {activity.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{activity.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Activity Button */}
      <div className="text-center">
        <button className="btn-secondary">
          + Add New Activity
        </button>
      </div>
    </div>
  )
}

