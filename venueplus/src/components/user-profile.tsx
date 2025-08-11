'use client'

import { useState, useEffect } from 'react'
import { 
  User, Settings, Calendar, BookOpen, Heart, Activity,
  MapPin, Clock, DollarSign, Star, Edit3, Camera,
  Download, Trash2, Share2, Eye, Filter, Search,
  Plus, ChevronDown, ChevronUp, Award, TrendingUp,
  Globe, Plane, Car, Camera as CameraIcon, Image, X
} from 'lucide-react'
import { 
  UserProfile as UserProfileType, 
  SavedItinerary, 
  RecentlyViewedItem, 
  BookingHistory,
  TravelMemory,
  Wishlist,
  ItineraryFilter,
  BookingFilter 
} from '@/lib/user-types'

interface UserProfileProps {
  userId: string
  onClose?: () => void
}

export function UserProfile({ userId, onClose }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'itineraries' | 'bookings' | 'memories' | 'settings'>('overview')
  const [profile, setProfile] = useState<UserProfileType | null>(null)
  const [itineraries, setItineraries] = useState<SavedItinerary[]>([])
  const [recentViews, setRecentViews] = useState<RecentlyViewedItem[]>([])
  const [bookings, setBookings] = useState<BookingHistory[]>([])
  const [memories, setMemories] = useState<TravelMemory[]>([])
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [loading, setLoading] = useState(true)
  const [itineraryFilter, setItineraryFilter] = useState<ItineraryFilter>({})
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>({})
  const [expandedSections, setExpandedSections] = useState<string[]>(['stats'])

  useEffect(() => {
    loadUserData()
  }, [userId])

  // Handle URL tab parameter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (tabParam && ['overview', 'itineraries', 'bookings', 'memories', 'settings'].includes(tabParam)) {
        setActiveTab(tabParam as any)
      }
    }
  }, [])

  const loadUserData = async () => {
    try {
      setLoading(true)
      
      // Build query parameters (no userId needed - uses session)
      const itineraryParams = new URLSearchParams()
      const recentViewParams = new URLSearchParams({ limit: '10' })
      const bookingParams = new URLSearchParams()
      
      // Add itinerary filters
      if (itineraryFilter.status) {
        itineraryParams.append('status', itineraryFilter.status.join(','))
      }
      if (itineraryFilter.sortBy) {
        itineraryParams.append('sortBy', itineraryFilter.sortBy)
        itineraryParams.append('sortOrder', itineraryFilter.sortOrder || 'desc')
      }
      
      // Add booking filters
      if (bookingFilter.status) {
        bookingParams.append('status', bookingFilter.status.join(','))
      }
      if (bookingFilter.sortBy) {
        bookingParams.append('sortBy', bookingFilter.sortBy)
        bookingParams.append('sortOrder', bookingFilter.sortOrder || 'desc')
      }

      const [profileRes, itinerariesRes, recentViewsRes, bookingsRes] = await Promise.all([
        fetch('/api/user/profile'),
        fetch(`/api/user/itineraries?${itineraryParams}`),
        fetch(`/api/user/recent-views?${recentViewParams}`),
        fetch(`/api/user/bookings?${bookingParams}`)
      ])

      if (profileRes.ok) {
        const userProfile = await profileRes.json()
        setProfile(userProfile)
      }
      
      if (itinerariesRes.ok) {
        const userItineraries = await itinerariesRes.json()
        setItineraries(userItineraries)
      }
      
      if (recentViewsRes.ok) {
        const userRecentViews = await recentViewsRes.json()
        setRecentViews(userRecentViews)
      }
      
      if (bookingsRes.ok) {
        const userBookings = await bookingsRes.json()
        setBookings(userBookings)
      }

      // For now, set empty arrays for memories and wishlists
      // These would be populated from their respective APIs
      setMemories([])
      setWishlists([])
      
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'draft': 'bg-gray-100 text-gray-700',
      'planned': 'bg-blue-100 text-blue-700',
      'booked': 'bg-green-100 text-green-700',
      'completed': 'bg-purple-100 text-purple-700',
      'cancelled': 'bg-red-100 text-red-700',
      'pending': 'bg-yellow-100 text-yellow-700',
      'confirmed': 'bg-green-100 text-green-700'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load user profile.</p>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-gray-600">{profile.email}</p>
              {profile.phone && (
                <p className="text-gray-500 text-sm">{profile.phone}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <span className="text-sm text-gray-500">
                  Member since {formatDate(profile.stats.memberSince)}
                </span>
                {profile.subscription && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.subscription.type === 'pro' ? 'bg-gold-100 text-gold-700' :
                    profile.subscription.type === 'premium' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {profile.subscription.type.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Travel Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Travel Statistics</h2>
          <button
            onClick={() => toggleSection('stats')}
            className="text-gray-400 hover:text-gray-600"
          >
            {expandedSections.includes('stats') ? 
              <ChevronUp className="w-5 h-5" /> : 
              <ChevronDown className="w-5 h-5" />
            }
          </button>
        </div>
        
        {expandedSections.includes('stats') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profile.stats.totalTrips}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(profile.stats.totalSpent).replace('.00', '')}
              </div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profile.stats.totalDaysTravel}</div>
              <div className="text-sm text-gray-600">Days Traveled</div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{profile.stats.countriesVisited}</div>
              <div className="text-sm text-gray-600">Countries</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('itineraries')}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{itineraries.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Saved Itineraries</h3>
          <p className="text-sm text-gray-600">Manage your trip plans</p>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{bookings.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Bookings</h3>
          <p className="text-sm text-gray-600">View booking history</p>
        </button>

        <button
          onClick={() => setActiveTab('memories')}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <CameraIcon className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{memories.length}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Travel Memories</h3>
          <p className="text-sm text-gray-600">Photos and reviews</p>
        </button>

        <button className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow text-left">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{wishlists.reduce((acc, wl) => acc + wl.items.length, 0)}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Wishlist</h3>
          <p className="text-sm text-gray-600">Dream destinations</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h2>
        {recentViews.length > 0 ? (
          <div className="space-y-3">
            {recentViews.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden">
                    {item.itemData.imageUrl ? (
                      <img src={item.itemData.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{item.itemData.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{item.itemType}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{formatDate(item.viewedAt)}</p>
                  {item.itemData.price && (
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(item.itemData.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        )}
      </div>
    </div>
  )

  const renderItineraries = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Itineraries</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>New Itinerary</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search itineraries..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Itineraries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {itineraries.map((itinerary) => (
          <div key={itinerary.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-purple-500 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute top-4 left-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(itinerary.status)}`}>
                  {itinerary.status}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">{itinerary.name}</h3>
                <p className="text-sm opacity-90">{itinerary.destination}</p>
              </div>
              <div className="absolute top-4 right-4">
                <button className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-white hover:bg-opacity-30">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{itinerary.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(itinerary.totalCost).replace('.00', '')}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {itinerary.description || `${itinerary.duration} trip to ${itinerary.destination} for ${itinerary.travelers} travelers`}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Updated {formatDate(itinerary.updatedAt)}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-blue-600">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {itineraries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Itineraries</h3>
          <p className="text-gray-600 mb-6">Start planning your next adventure!</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Your First Itinerary
          </button>
        </div>
      )}
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Booking History</h2>
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Booking List */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{booking.destination}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-gray-600">Booking Reference: {booking.bookingReference}</p>
                <p className="text-sm text-gray-500">Booked on {formatDate(booking.bookingDate)}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(booking.totalAmount)}
                </div>
                <div className="text-sm text-gray-600">{booking.travelers} travelers</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-100">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Travel Dates</h4>
                <p className="text-gray-600 text-sm">
                  {formatDate(booking.travelDates.startDate)} - {formatDate(booking.travelDates.endDate)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Payment Status</h4>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Provider</h4>
                <p className="text-gray-600 text-sm">{booking.provider}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Contact: {booking.contactInfo.name}</span>
                <span>•</span>
                <span>{booking.contactInfo.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-700 text-sm">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
          <p className="text-gray-600">Your booking history will appear here once you make your first booking.</p>
        </div>
      )}
    </div>
  )

  const renderMemories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Travel Memories</h2>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Memories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div key={memory.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gray-200 relative">
              {memory.photos.length > 0 ? (
                <img 
                  src={memory.photos[0].url} 
                  alt={memory.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded-full px-2 py-1 text-white text-sm">
                  <Star className="w-3 h-3 fill-current text-yellow-400" />
                  <span>{memory.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{memory.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{memory.destination}</p>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{memory.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{formatDate(memory.date)}</span>
                <div className="flex items-center space-x-2">
                  <span>{memory.photos.length} photos</span>
                  <span>•</span>
                  <span>{memory.likes} likes</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memories.length === 0 && (
        <div className="text-center py-12">
          <CameraIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Travel Memories</h3>
          <p className="text-gray-600 mb-6">Share your travel experiences and photos!</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Add Your First Memory
          </button>
        </div>
      )}
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={profile.phone || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
      </div>

      {/* Travel Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Travel Style</label>
            <div className="grid grid-cols-3 gap-2">
              {['budget', 'mid_range', 'luxury'].map((style) => (
                <label key={style} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="travelStyle"
                    value={style}
                    checked={profile.preferences.travelStyle === style}
                    className="text-blue-600"
                  />
                  <span className="capitalize">{style.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (INR)</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Min budget"
                value={profile.preferences.budgetRange.min}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="Max budget"
                value={profile.preferences.budgetRange.max}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {Object.entries(profile.preferences.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <input
                type="checkbox"
                checked={value}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            <span>Export My Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'itineraries', label: 'Itineraries', icon: BookOpen },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'memories', label: 'Memories', icon: CameraIcon },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'itineraries' && renderItineraries()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'memories' && renderMemories()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  )
}
