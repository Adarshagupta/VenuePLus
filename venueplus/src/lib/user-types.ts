// User profile and data management types

export interface UserProfile {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  preferences: UserPreferences
  createdAt: Date
  updatedAt: Date
  subscription?: SubscriptionInfo
  stats: UserStats
}

export interface UserPreferences {
  travelStyle: 'budget' | 'mid_range' | 'luxury' | 'adventure' | 'cultural' | 'family'
  preferredDestinations: string[]
  budgetRange: { min: number; max: number }
  accommodationType: 'hotel' | 'resort' | 'homestay' | 'hostel' | 'any'
  foodPreferences: string[]
  activityPreferences: string[]
  travelPace: 'slow' | 'moderate' | 'fast'
  groupSize: number
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
    deals: boolean
    reminders: boolean
  }
  accessibility: string[]
  language: string
  currency: string
}

export interface UserStats {
  totalTrips: number
  totalSpent: number
  favoriteDestination: string
  averageTripDuration: number
  totalDaysTravel: number
  countriesVisited: number
  lastTripDate?: Date
  memberSince: Date
}

export interface SubscriptionInfo {
  type: 'free' | 'premium' | 'pro'
  startDate: Date
  endDate?: Date
  features: string[]
  price: number
}

export interface SavedItinerary {
  id: string
  userId: string
  name: string
  description?: string
  destination: string
  duration: string
  travelers: number
  totalCost: number
  currency: string
  startDate?: Date
  endDate?: Date
  status: 'draft' | 'planned' | 'booked' | 'completed' | 'cancelled'
  packageId?: string
  customizations?: ItineraryCustomization[]
  createdAt: Date
  updatedAt: Date
  lastViewedAt: Date
  shareSettings: {
    isPublic: boolean
    shareUrl?: string
    allowComments: boolean
  }
  tags: string[]
  rating?: number
  review?: string
  photos?: string[]
}

export interface ItineraryCustomization {
  type: 'activity' | 'accommodation' | 'transport' | 'meal'
  originalId: string
  customData: any
  reason: string
  cost: number
}

export interface RecentlyViewedItem {
  id: string
  userId: string
  itemType: 'package' | 'destination' | 'activity' | 'hotel' | 'itinerary'
  itemId: string
  itemData: {
    name: string
    description?: string
    imageUrl?: string
    price?: number
    rating?: number
    location?: string
  }
  viewedAt: Date
  viewDuration: number // in seconds
  source: 'search' | 'recommendation' | 'shared' | 'direct'
}

export interface BookingHistory {
  id: string
  userId: string
  bookingReference: string
  itineraryId?: string
  packageId?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded'
  bookingDate: Date
  travelDates: {
    startDate: Date
    endDate: Date
  }
  destination: string
  travelers: number
  totalAmount: number
  paidAmount: number
  currency: string
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'partially_paid' | 'refunded'
  cancellationPolicy?: string
  cancellationDeadline?: Date
  provider: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  specialRequests?: string[]
  documents?: BookingDocument[]
  notifications: BookingNotification[]
  createdAt: Date
  updatedAt: Date
}

export interface BookingDocument {
  type: 'ticket' | 'voucher' | 'invoice' | 'receipt' | 'confirmation'
  url: string
  name: string
  uploadedAt: Date
}

export interface BookingNotification {
  type: 'confirmation' | 'reminder' | 'update' | 'cancellation'
  message: string
  sentAt: Date
  read: boolean
}

export interface UserActivity {
  id: string
  userId: string
  type: 'view' | 'save' | 'book' | 'share' | 'review' | 'search'
  description: string
  metadata: any
  timestamp: Date
  location?: string
  device?: string
}

export interface Wishlist {
  id: string
  userId: string
  name: string
  description?: string
  items: WishlistItem[]
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  shareUrl?: string
}

export interface WishlistItem {
  id: string
  type: 'destination' | 'package' | 'activity' | 'hotel'
  itemId: string
  itemData: {
    name: string
    description?: string
    imageUrl?: string
    price?: number
    location?: string
  }
  notes?: string
  priority: 'low' | 'medium' | 'high'
  addedAt: Date
  targetDate?: Date
}

export interface TravelMemory {
  id: string
  userId: string
  itineraryId?: string
  bookingId?: string
  title: string
  description: string
  destination: string
  date: Date
  photos: MemoryPhoto[]
  rating: number
  highlights: string[]
  recommendations: string[]
  wouldRecommend: boolean
  companionType: 'solo' | 'couple' | 'family' | 'friends' | 'group'
  tags: string[]
  isPublic: boolean
  likes: number
  createdAt: Date
  updatedAt: Date
}

export interface MemoryPhoto {
  id: string
  url: string
  caption?: string
  location?: string
  uploadedAt: Date
}

// Filter and search types
export interface ItineraryFilter {
  status?: SavedItinerary['status'][]
  destination?: string[]
  dateRange?: { start: Date; end: Date }
  budgetRange?: { min: number; max: number }
  duration?: string[]
  tags?: string[]
  sortBy?: 'created' | 'updated' | 'viewed' | 'cost' | 'date'
  sortOrder?: 'asc' | 'desc'
}

export interface BookingFilter {
  status?: BookingHistory['status'][]
  dateRange?: { start: Date; end: Date }
  destination?: string[]
  amountRange?: { min: number; max: number }
  paymentStatus?: BookingHistory['paymentStatus'][]
  sortBy?: 'booking_date' | 'travel_date' | 'amount' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface ProfileSettings {
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    showTravelHistory: boolean
    showReviews: boolean
    allowMessages: boolean
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    travelReminders: boolean
    priceAlerts: boolean
  }
  dataManagement: {
    exportData: boolean
    deleteAccount: boolean
    dataRetention: number // days
  }
}
