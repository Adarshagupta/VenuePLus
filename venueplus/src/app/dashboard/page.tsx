'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { 
  User, MapPin, Calendar, Heart, Settings, TrendingUp, 
  Plus, BookOpen, Activity, CreditCard, Star, Clock
} from 'lucide-react'

interface DashboardStats {
  totalTrips: number
  savedItineraries: number
  completedBookings: number
  totalSpent: number
  favoriteDestinations: string[]
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      loadDashboardData()
    }
  }, [status])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user profile to get stats
      const profileResponse = await fetch('/api/user/profile')
      if (profileResponse.ok) {
        const profile = await profileResponse.json()
        
        // Load recent activities
        const activitiesResponse = await fetch('/api/user/activities?limit=5')
        const activities = activitiesResponse.ok ? await activitiesResponse.json() : []
        
        setStats({
          totalTrips: profile.stats?.totalTrips || 0,
          savedItineraries: profile.stats?.savedItineraries || 0,
          completedBookings: profile.stats?.completedBookings || 0,
          totalSpent: profile.stats?.totalSpent || 0,
          favoriteDestinations: profile.stats?.favoriteDestinations || [],
          recentActivity: activities.slice(0, 5)
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your dashboard</p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {session?.user?.name || 'Traveler'}!</p>
            </div>
            <Link
              href="/?action=plan-trip"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your data...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MapPin className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Trips</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats?.totalTrips || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Saved Itineraries</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats?.savedItineraries || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Bookings</div>
                    <div className="text-2xl font-semibold text-gray-900">{stats?.completedBookings || 0}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-500">Total Spent</div>
                    <div className="text-2xl font-semibold text-gray-900">₹{(stats?.totalSpent || 0).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-6 space-y-4">
                  <Link
                    href="/profile?tab=itineraries"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium text-gray-900">My Itineraries</div>
                      <div className="text-sm text-gray-500">View saved trip plans</div>
                    </div>
                  </Link>

                  <Link
                    href="/profile?tab=bookings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">My Bookings</div>
                      <div className="text-sm text-gray-500">Manage reservations</div>
                    </div>
                  </Link>

                  <Link
                    href="/profile?tab=memories"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-medium text-gray-900">Travel Memories</div>
                      <div className="text-sm text-gray-500">Photos and reviews</div>
                    </div>
                  </Link>

                  <Link
                    href="/profile?tab=settings"
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">Settings</div>
                      <div className="text-sm text-gray-500">Account preferences</div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                </div>
                <div className="p-6">
                  {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {stats.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Activity className="w-5 h-5 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.description}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No recent activity</p>
                      <Link
                        href="/?action=plan-trip"
                        className="text-purple-600 hover:text-purple-700 text-sm mt-2 inline-block"
                      >
                        Start planning your first trip
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Favorite Destinations */}
            {stats?.favoriteDestinations && stats.favoriteDestinations.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Favorite Destinations</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {stats.favoriteDestinations.map((destination, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {destination}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
