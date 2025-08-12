'use client'

import { useState, useEffect } from 'react'
import { 
  User, Settings, Calendar, BookOpen, Heart, Activity,
  MapPin, Clock, DollarSign, Star, Edit3, Camera,
  Download, Trash2, Share2, Eye, Filter, Search,
  Plus, ChevronDown, ChevronUp, Award, TrendingUp,
  Globe, Plane, Car, Camera as CameraIcon, Image, X,
  Copy, Mail, Facebook, Twitter, MessageCircle, Check
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
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareBooking, setShareBooking] = useState<BookingHistory | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // Profile editing state
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'en',
    travelStyle: 'mid_range' as 'budget' | 'mid_range' | 'luxury' | 'adventure' | 'cultural' | 'family',
    budgetMin: 10000,
    budgetMax: 100000,
    notifications: {
      email: true,
      sms: false,
      push: true,
      deals: true,
      reminders: true
    }
  })

  useEffect(() => {
    loadUserData()
  }, [userId])

  // Initialize form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        language: profile.preferences?.language || 'en',
        travelStyle: profile.preferences?.travelStyle || 'mid_range',
        budgetMin: profile.preferences?.budgetRange?.min || 10000,
        budgetMax: profile.preferences?.budgetRange?.max || 100000,
        notifications: profile.preferences?.notifications || {
          email: true,
          sms: false,
          push: true,
          deals: true,
          reminders: true
        }
      })
    }
  }, [profile])

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

  const loadUserData = async (retryCount = 0) => {
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
      } else if (profileRes.status === 404 && retryCount < 3) {
        // Profile not found, retry with a short delay (might be initializing)
        setTimeout(() => loadUserData(retryCount + 1), 1000)
        return
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
      if (retryCount < 3) {
        // Retry with exponential backoff
        setTimeout(() => loadUserData(retryCount + 1), Math.pow(2, retryCount) * 1000)
        return
      }
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

  const handleProfileFormChange = (field: string, value: any) => {
    if (field.startsWith('notifications.')) {
      // Handle nested notification preferences
      const notificationKey = field.replace('notifications.', '')
      setProfileForm(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: value
        }
      }))
      return
    }
    
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileForm.name,
          phone: profileForm.phone,
          preferences: {
            ...profile?.preferences,
            language: profileForm.language,
            travelStyle: profileForm.travelStyle,
            budgetRange: {
              min: profileForm.budgetMin,
              max: profileForm.budgetMax
            },
            notifications: profileForm.notifications
          }
        })
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setEditingProfile(false)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    }
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

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) {
        return 'Invalid Date'
      }
      
      return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(dateObj)
    } catch (error) {
      console.warn('Error formatting date:', date, error)
      return 'Invalid Date'
    }
  }

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const handleViewBookingDetails = (booking: BookingHistory) => {
    setSelectedBooking(booking)
    setShowBookingDetails(true)
  }

  const handleShareItinerary = (booking: BookingHistory) => {
    setShareBooking(booking)
    setShowShareModal(true)
  }

  const handleCopyLink = async (booking: BookingHistory) => {
    try {
      const shareUrl = `${window.location.origin}/shared-itinerary/${booking.id}`
      await navigator.clipboard.writeText(shareUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const handleEmailShare = (booking: BookingHistory) => {
    const subject = `Check out my travel itinerary for ${booking.destination}`
    const body = `I wanted to share my travel itinerary for ${booking.destination}!\n\nTravel Dates: ${formatDate(booking.travelDates.startDate)} - ${formatDate(booking.travelDates.endDate)}\nTravelers: ${booking.travelers}\n\nView the full itinerary: ${window.location.origin}/shared-itinerary/${booking.id}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const handleSocialShare = (platform: string, booking: BookingHistory) => {
    const shareUrl = `${window.location.origin}/shared-itinerary/${booking.id}`
    const text = `Check out my travel itinerary for ${booking.destination}!`
    
    let url = ''
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Setting Up Your Profile</h2>
          <p className="text-gray-600 mb-4">We're initializing your profile. This will only take a moment...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300"></div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">{profile.name}</h1>
              <p className="text-gray-600 text-lg mb-1">{profile.email}</p>
              {profile.phone && (
                <p className="text-gray-500">{profile.phone}</p>
              )}
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    Member since {formatDate(profile.stats.memberSince)}
                  </span>
                </div>
                {profile.subscription && (
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${
                    profile.subscription.type === 'pro' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                    profile.subscription.type === 'premium' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                    'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  }`}>
                    {profile.subscription.type.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={() => setEditingProfile(!editingProfile)}
            className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-medium">{editingProfile ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Travel Stats */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Travel Statistics</h2>
          <button
            onClick={() => toggleSection('stats')}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110"
          >
            {expandedSections.includes('stats') ? 
              <ChevronUp className="w-5 h-5" /> : 
              <ChevronDown className="w-5 h-5" />
            }
          </button>
        </div>
        
        {expandedSections.includes('stats') && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{profile.stats.totalTrips}</div>
              <div className="text-sm text-gray-600 font-medium">Total Trips</div>
            </div>
            
            <div className="group text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatCurrency(profile.stats.totalSpent).replace('.00', '')}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Spent</div>
            </div>
            
            <div className="group text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{profile.stats.totalDaysTravel}</div>
              <div className="text-sm text-gray-600 font-medium">Days Traveled</div>
            </div>
            
            <div className="group text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl hover:from-orange-100 hover:to-red-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{profile.stats.countriesVisited}</div>
              <div className="text-sm text-gray-600 font-medium">Countries</div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => setActiveTab('itineraries')}
          className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 text-left transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{itineraries.length}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Saved Itineraries</h3>
          <p className="text-gray-600">Manage your trip plans</p>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 text-left transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{bookings.length}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Bookings</h3>
          <p className="text-gray-600">View booking history</p>
        </button>

        <button
          onClick={() => setActiveTab('memories')}
          className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 text-left transform hover:scale-105 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <CameraIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{memories.length}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Travel Memories</h3>
          <p className="text-gray-600">Photos and reviews</p>
        </button>

        <button className="group bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 text-left transform hover:scale-105 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">{wishlists.reduce((acc, wl) => acc + wl.items.length, 0)}</span>
          </div>
          <h3 className="font-bold text-gray-900 text-lg mb-1">Wishlist</h3>
          <p className="text-gray-600">Dream destinations</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 hover:shadow-3xl transition-all duration-500">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Recently Viewed</h2>
        {recentViews.length > 0 ? (
          <div className="space-y-4">
            {recentViews.slice(0, 5).map((item, index) => (
              <div key={index} className="group flex items-center justify-between p-4 hover:bg-white/50 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.itemData.imageUrl ? (
                      <img src={item.itemData.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">{item.itemData.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-full font-medium capitalize">{item.itemType}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">{formatDate(item.viewedAt)}</p>
                  {item.itemData.price && (
                    <p className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {formatCurrency(item.itemData.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No recent activity</p>
          </div>
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
              <div className="flex flex-wrap items-center gap-2">
                <button 
                  onClick={() => handleViewBookingDetails(booking)}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View Details</span>
                  <span className="sm:hidden">Details</span>
                </button>
                <button 
                  onClick={() => handleShareItinerary(booking)}
                  className="flex items-center space-x-1 px-3 py-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share Itinerary</span>
                  <span className="sm:hidden">Share</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                  <span className="sm:hidden">PDF</span>
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
              value={editingProfile ? profileForm.name : profile.name}
              onChange={(e) => handleProfileFormChange('name', e.target.value)}
              readOnly={!editingProfile}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editingProfile ? 'bg-gray-50' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={editingProfile ? profileForm.phone : (profile.phone || '')}
              onChange={(e) => handleProfileFormChange('phone', e.target.value)}
              readOnly={!editingProfile}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editingProfile ? 'bg-gray-50' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Language</label>
            <select 
              value={editingProfile ? profileForm.language : (profile.preferences?.language || 'en')}
              onChange={(e) => handleProfileFormChange('language', e.target.value)}
              disabled={!editingProfile}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editingProfile ? 'bg-gray-50' : ''}`}
            >
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
                <label key={style} className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${!editingProfile ? 'opacity-60' : ''}`}>
                  <input
                    type="radio"
                    name="travelStyle"
                    value={style}
                    checked={editingProfile ? profileForm.travelStyle === style : profile.preferences.travelStyle === style}
                    onChange={(e) => editingProfile && handleProfileFormChange('travelStyle', e.target.value)}
                    disabled={!editingProfile}
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
                value={editingProfile ? profileForm.budgetMin : profile.preferences.budgetRange.min}
                onChange={(e) => handleProfileFormChange('budgetMin', parseInt(e.target.value) || 0)}
                readOnly={!editingProfile}
                className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editingProfile ? 'bg-gray-50' : ''}`}
              />
              <input
                type="number"
                placeholder="Max budget"
                value={editingProfile ? profileForm.budgetMax : profile.preferences.budgetRange.max}
                onChange={(e) => handleProfileFormChange('budgetMax', parseInt(e.target.value) || 0)}
                readOnly={!editingProfile}
                className={`px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!editingProfile ? 'bg-gray-50' : ''}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-3">
          {Object.entries(editingProfile ? profileForm.notifications : profile.preferences.notifications).map(([key, value]) => (
            <label key={key} className={`flex items-center justify-between ${!editingProfile ? 'opacity-60' : ''}`}>
              <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleProfileFormChange(`notifications.${key}`, e.target.checked)}
                disabled={!editingProfile}
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
      {editingProfile && (
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => setEditingProfile(false)}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveProfile}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )

  const renderBookingDetailsModal = () => {
    if (!selectedBooking || !showBookingDetails) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
            <button
              onClick={() => setShowBookingDetails(false)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Header Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedBooking.destination}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedBooking.travelDates.startDate)} - {formatDate(selectedBooking.travelDates.endDate)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{selectedBooking.travelers} travelers</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(selectedBooking.totalAmount)}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Booking Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium">{selectedBooking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booked on:</span>
                    <span className="font-medium">{formatDate(selectedBooking.bookingDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Provider:</span>
                    <span className="font-medium">{selectedBooking.provider}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedBooking.contactInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{selectedBooking.contactInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedBooking.contactInfo.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Payment Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Status:</span>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 block">Total Amount:</span>
                  <span className="font-semibold">{formatCurrency(selectedBooking.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Itinerary Details */}
            {selectedBooking.itineraryId && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Itinerary</h4>
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">Detailed itinerary available</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      View Full Itinerary
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Special Requests */}
            {selectedBooking.specialRequests && selectedBooking.specialRequests.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Special Requests</h4>
                <div className="space-y-2">
                  {selectedBooking.specialRequests.map((request: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-600">{request}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {selectedBooking.documents && selectedBooking.documents.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Documents</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedBooking.documents.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => handleShareItinerary(selectedBooking)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Itinerary</span>
              </button>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Download PDF
                </button>
                <button
                  onClick={() => setShowBookingDetails(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderShareModal = () => {
    if (!shareBooking || !showShareModal) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Share Itinerary</h3>
            <button
              onClick={() => {
                setShowShareModal(false)
                setCopySuccess(false)
              }}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="text-center mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">{shareBooking.destination}</h4>
              <p className="text-sm text-gray-600">
                {formatDate(shareBooking.travelDates.startDate)} - {formatDate(shareBooking.travelDates.endDate)}
              </p>
            </div>

            {/* Copy Link */}
            <button
              onClick={() => handleCopyLink(shareBooking)}
              className={`w-full flex items-center justify-center space-x-3 p-3 border rounded-lg transition-all ${
                copySuccess 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="font-medium">
                {copySuccess ? 'Link Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* Email Share */}
            <button
              onClick={() => handleEmailShare(shareBooking)}
              className="w-full flex items-center justify-center space-x-3 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-600" />
              <span>Share via Email</span>
            </button>

            {/* Social Media */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleSocialShare('whatsapp', shareBooking)}
                className="flex flex-col items-center space-y-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="text-xs font-medium">WhatsApp</span>
              </button>
              <button
                onClick={() => handleSocialShare('facebook', shareBooking)}
                className="flex flex-col items-center space-y-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Facebook className="w-6 h-6 text-blue-600" />
                <span className="text-xs font-medium">Facebook</span>
              </button>
              <button
                onClick={() => handleSocialShare('twitter', shareBooking)}
                className="flex flex-col items-center space-y-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Twitter className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-medium">Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-lg shadow-xl border-b border-white/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                My Profile
              </h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-300 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/40 backdrop-blur-lg border-b border-white/20 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-4">
            {[
              { id: 'overview', label: 'Overview', icon: User, gradient: 'from-blue-500 to-cyan-500' },
              { id: 'itineraries', label: 'Itineraries', icon: BookOpen, gradient: 'from-emerald-500 to-teal-500' },
              { id: 'bookings', label: 'Bookings', icon: Calendar, gradient: 'from-orange-500 to-red-500' },
              { id: 'memories', label: 'Memories', icon: CameraIcon, gradient: 'from-purple-500 to-pink-500' },
              { id: 'settings', label: 'Settings', icon: Settings, gradient: 'from-gray-500 to-slate-500' }
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`group relative flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isActive ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/20'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'itineraries' && renderItineraries()}
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'memories' && renderMemories()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Modals */}
      {renderBookingDetailsModal()}
      {renderShareModal()}
    </div>
  )
}
