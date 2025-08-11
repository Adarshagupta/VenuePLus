// Production user data service using Prisma database

import { PrismaClient } from '@prisma/client'
import { 
  UserProfile, 
  SavedItinerary, 
  RecentlyViewedItem, 
  BookingHistory, 
  UserActivity, 
  Wishlist, 
  TravelMemory,
  ItineraryFilter,
  BookingFilter,
  UserPreferences,
  UserStats,
  SubscriptionInfo
} from './user-types'

// Initialize Prisma client
const prisma = new PrismaClient()

export class UserDataService {

  // User Profile Management
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          _count: {
            select: {
              trips: true
            }
          }
        }
      })

      if (!user) return null

      // Transform database user to UserProfile type
      return {
        id: user.id,
        email: user.email,
        name: user.name || '',
        phone: (user as any).phone,
        avatar: (user as any).avatar,
        preferences: ((user as any).preferences as UserPreferences) || this.getDefaultPreferences(),
        stats: ((user as any).stats as UserStats) || this.getDefaultStats(user.createdAt),
        subscription: (user as any).subscription as SubscriptionInfo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const updateData: any = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.avatar !== undefined) updateData.avatar = updates.avatar
      if (updates.preferences !== undefined) updateData.preferences = updates.preferences
      if (updates.stats !== undefined) updateData.stats = updates.stats
      if (updates.subscription !== undefined) updateData.subscription = updates.subscription
      
      updateData.updatedAt = new Date()

      await prisma.user.update({
        where: { id: userId },
        data: updateData
      })

      return this.getUserProfile(userId)
    } catch (error) {
      console.error('Error updating user profile:', error)
      return null
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) return null

      const currentPreferences = ((user as any).preferences as UserPreferences) || this.getDefaultPreferences()
      const updatedPreferences = {
        ...currentPreferences,
        ...preferences
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          preferences: updatedPreferences as any,
          updatedAt: new Date()
        } as any
      })

      return this.getUserProfile(userId)
    } catch (error) {
      console.error('Error updating user preferences:', error)
      return null
    }
  }

  // Saved Itineraries Management
  async saveItinerary(userId: string, itineraryData: Partial<SavedItinerary>): Promise<SavedItinerary | null> {
    try {
      const savedItinerary = await (prisma as any).savedItinerary.create({
        data: {
          userId,
          name: itineraryData.name || 'Untitled Trip',
          description: itineraryData.description,
          destination: itineraryData.destination || '',
          duration: itineraryData.duration || '',
          travelers: itineraryData.travelers || 1,
          totalCost: itineraryData.totalCost || 0,
          currency: itineraryData.currency || 'INR',
          startDate: itineraryData.startDate,
          endDate: itineraryData.endDate,
          status: itineraryData.status || 'draft',
          packageId: itineraryData.packageId,
          packageData: itineraryData.packageId ? { packageId: itineraryData.packageId } : null,
          customizations: itineraryData.customizations as any,
          itineraryData: itineraryData as any,
          shareSettings: {
            isPublic: false,
            allowComments: false
          },
          tags: itineraryData.tags || []
        }
      })

      // Update user stats
      await this.updateUserStats(userId, 'itinerary_saved')

      return this.transformSavedItinerary(savedItinerary)
    } catch (error) {
      console.error('Error saving itinerary:', error)
      return null
    }
  }

  async getUserItineraries(userId: string, filter?: ItineraryFilter): Promise<SavedItinerary[]> {
    try {
      const where: any = { userId }

      // Apply filters
      if (filter?.status && filter.status.length > 0) {
        where.status = { in: filter.status }
      }
      if (filter?.destination && filter.destination.length > 0) {
        where.destination = { in: filter.destination }
      }
      if (filter?.dateRange) {
        where.startDate = {
          gte: filter.dateRange.start,
          lte: filter.dateRange.end
        }
      }
      if (filter?.budgetRange) {
        where.totalCost = {
          gte: filter.budgetRange.min,
          lte: filter.budgetRange.max
        }
      }
      if (filter?.tags && filter.tags.length > 0) {
        where.tags = {
          hasSome: filter.tags
        }
      }

      // Apply sorting
      const orderBy: any = {}
      if (filter?.sortBy) {
        switch (filter.sortBy) {
          case 'created':
            orderBy.createdAt = filter.sortOrder || 'desc'
            break
          case 'updated':
            orderBy.updatedAt = filter.sortOrder || 'desc'
            break
          case 'viewed':
            orderBy.lastViewedAt = filter.sortOrder || 'desc'
            break
          case 'cost':
            orderBy.totalCost = filter.sortOrder || 'asc'
            break
          case 'date':
            orderBy.startDate = filter.sortOrder || 'asc'
            break
          default:
            orderBy.updatedAt = 'desc'
        }
      } else {
        orderBy.updatedAt = 'desc'
      }

      const itineraries = await (prisma as any).savedItinerary.findMany({
        where,
        orderBy
      })

      return itineraries.map(this.transformSavedItinerary)
    } catch (error) {
      console.error('Error fetching user itineraries:', error)
      return []
    }
  }

  async updateItinerary(itineraryId: string, updates: Partial<SavedItinerary>): Promise<SavedItinerary | null> {
    try {
      const updateData: any = {}
      
      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.description !== undefined) updateData.description = updates.description
      if (updates.destination !== undefined) updateData.destination = updates.destination
      if (updates.duration !== undefined) updateData.duration = updates.duration
      if (updates.travelers !== undefined) updateData.travelers = updates.travelers
      if (updates.totalCost !== undefined) updateData.totalCost = updates.totalCost
      if (updates.currency !== undefined) updateData.currency = updates.currency
      if (updates.startDate !== undefined) updateData.startDate = updates.startDate
      if (updates.endDate !== undefined) updateData.endDate = updates.endDate
      if (updates.status !== undefined) updateData.status = updates.status
      if (updates.customizations !== undefined) updateData.customizations = updates.customizations
      if (updates.shareSettings !== undefined) updateData.shareSettings = updates.shareSettings
      if (updates.tags !== undefined) updateData.tags = updates.tags
      if (updates.rating !== undefined) updateData.rating = updates.rating
      if (updates.review !== undefined) updateData.review = updates.review
      if (updates.photos !== undefined) updateData.photos = updates.photos
      
      updateData.updatedAt = new Date()

      const updatedItinerary = await (prisma as any).savedItinerary.update({
        where: { id: itineraryId },
        data: updateData
      })

      return this.transformSavedItinerary(updatedItinerary)
    } catch (error) {
      console.error('Error updating itinerary:', error)
      return null
    }
  }

  async deleteItinerary(itineraryId: string, userId: string): Promise<boolean> {
    try {
      await (prisma as any).savedItinerary.deleteMany({
        where: {
          id: itineraryId,
          userId: userId
        }
      })
      return true
    } catch (error) {
      console.error('Error deleting itinerary:', error)
      return false
    }
  }

  // Recently Viewed Items
  async addRecentlyViewed(userId: string, item: Omit<RecentlyViewedItem, 'id' | 'userId' | 'viewedAt'>): Promise<void> {
    try {
      // Remove existing view of the same item
      await (prisma as any).recentView.deleteMany({
        where: {
          userId,
          itemType: item.itemType,
          itemId: item.itemId
        }
      })

      // Add new view
      await (prisma as any).recentView.create({
        data: {
          userId,
          itemType: item.itemType,
          itemId: item.itemId,
          itemData: item.itemData as any,
          viewDuration: item.viewDuration || 0,
          source: item.source || 'direct'
        }
      })

      // Keep only last 50 views
      const recentViews = await (prisma as any).recentView.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        take: 50
      })

      if (recentViews.length === 50) {
        await (prisma as any).recentView.deleteMany({
          where: {
            userId,
            viewedAt: { lt: recentViews[49].viewedAt }
          }
        })
      }
    } catch (error) {
      console.error('Error adding recent view:', error)
    }
  }

  async getRecentlyViewed(userId: string, limit: number = 20): Promise<RecentlyViewedItem[]> {
    try {
      const recentViews = await (prisma as any).recentView.findMany({
        where: { userId },
        orderBy: { viewedAt: 'desc' },
        take: limit
      })

      return recentViews.map((view: any) => ({
        id: view.id,
        userId: view.userId,
        itemType: view.itemType as any,
        itemId: view.itemId,
        itemData: view.itemData as any,
        viewedAt: view.viewedAt,
        viewDuration: view.viewDuration,
        source: view.source as any
      }))
    } catch (error) {
      console.error('Error fetching recent views:', error)
      return []
    }
  }

  // Booking History Management
  async addBooking(userId: string, bookingData: Omit<BookingHistory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<BookingHistory | null> {
    try {
      const booking = await (prisma as any).booking.create({
        data: {
          userId,
          bookingReference: bookingData.bookingReference,
          itineraryId: bookingData.itineraryId,
          packageId: bookingData.packageId,
          status: bookingData.status,
          bookingDate: bookingData.bookingDate,
          travelStartDate: bookingData.travelDates.startDate,
          travelEndDate: bookingData.travelDates.endDate,
          destination: bookingData.destination,
          travelers: bookingData.travelers,
          totalAmount: bookingData.totalAmount,
          paidAmount: bookingData.paidAmount,
          currency: bookingData.currency,
          paymentMethod: bookingData.paymentMethod,
          paymentStatus: bookingData.paymentStatus,
          provider: bookingData.provider,
          contactInfo: bookingData.contactInfo as any,
          bookingData: bookingData as any,
          specialRequests: bookingData.specialRequests,
          documents: bookingData.documents as any,
          notifications: bookingData.notifications as any,
          cancellationPolicy: bookingData.cancellationPolicy,
          cancellationDeadline: bookingData.cancellationDeadline
        }
      })

      // Update user stats
      await this.updateUserStats(userId, 'booking_made', booking.totalAmount)

      return this.transformBooking(booking)
    } catch (error) {
      console.error('Error adding booking:', error)
      return null
    }
  }

  async getUserBookings(userId: string, filter?: BookingFilter): Promise<BookingHistory[]> {
    try {
      const where: any = { userId }

      // Apply filters
      if (filter?.status && filter.status.length > 0) {
        where.status = { in: filter.status }
      }
      if (filter?.destination && filter.destination.length > 0) {
        where.destination = { in: filter.destination }
      }
      if (filter?.dateRange) {
        where.bookingDate = {
          gte: filter.dateRange.start,
          lte: filter.dateRange.end
        }
      }
      if (filter?.amountRange) {
        where.totalAmount = {
          gte: filter.amountRange.min,
          lte: filter.amountRange.max
        }
      }
      if (filter?.paymentStatus && filter.paymentStatus.length > 0) {
        where.paymentStatus = { in: filter.paymentStatus }
      }

      // Apply sorting
      const orderBy: any = {}
      if (filter?.sortBy) {
        switch (filter.sortBy) {
          case 'booking_date':
            orderBy.bookingDate = filter.sortOrder || 'desc'
            break
          case 'travel_date':
            orderBy.travelStartDate = filter.sortOrder || 'desc'
            break
          case 'amount':
            orderBy.totalAmount = filter.sortOrder || 'desc'
            break
          case 'status':
            orderBy.status = filter.sortOrder || 'asc'
            break
          default:
            orderBy.bookingDate = 'desc'
        }
      } else {
        orderBy.bookingDate = 'desc'
      }

      const bookings = await (prisma as any).booking.findMany({
        where,
        orderBy
      })

      return bookings.map(this.transformBooking)
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      return []
    }
  }

  async updateBookingStatus(bookingId: string, userId: string, status: BookingHistory['status']): Promise<BookingHistory | null> {
    try {
      const updatedBooking = await (prisma as any).booking.updateMany({
        where: {
          id: bookingId,
          userId: userId
        },
        data: {
          status,
          updatedAt: new Date()
        }
      })

      if (updatedBooking.count === 0) return null

      const booking = await (prisma as any).booking.findUnique({
        where: { id: bookingId }
      })

      return booking ? this.transformBooking(booking) : null
    } catch (error) {
      console.error('Error updating booking status:', error)
      return null
    }
  }

  // User Activity Tracking
  async logActivity(userId: string, activity: Omit<UserActivity, 'id' | 'userId' | 'timestamp'>): Promise<void> {
    try {
      await (prisma as any).userActivity.create({
        data: {
          userId,
          type: activity.type,
          description: activity.description,
          metadata: activity.metadata as any,
          location: activity.location,
          device: activity.device
        }
      })

      // Keep only last 1000 activities per user
      const activities = await (prisma as any).userActivity.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: 1000
      })

      if (activities.length === 1000) {
        await (prisma as any).userActivity.deleteMany({
          where: {
            userId,
            timestamp: { lt: activities[999].timestamp }
          }
        })
      }
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }

  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const activities = await (prisma as any).userActivity.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit
      })

      return activities.map((activity: any) => ({
        id: activity.id,
        userId: activity.userId,
        type: activity.type as any,
        description: activity.description,
        metadata: activity.metadata as any,
        location: activity.location,
        device: activity.device,
        timestamp: activity.timestamp
      }))
    } catch (error) {
      console.error('Error fetching user activities:', error)
      return []
    }
  }

  // Wishlist Management
  async createWishlist(userId: string, name: string, description?: string): Promise<Wishlist | null> {
    try {
      const wishlist = await (prisma as any).wishlist.create({
        data: {
          userId,
          name,
          description,
          items: { items: [] }
        }
      })

      return {
        id: wishlist.id,
        userId: wishlist.userId,
        name: wishlist.name,
        description: wishlist.description,
        items: ((wishlist as any).items as any)?.items || [],
        isPublic: wishlist.isPublic,
        shareUrl: wishlist.shareUrl,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt
      }
    } catch (error) {
      console.error('Error creating wishlist:', error)
      return null
    }
  }

  async getUserWishlists(userId: string): Promise<Wishlist[]> {
    try {
      const wishlists = await (prisma as any).wishlist.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' }
      })

      return wishlists.map((wishlist: any) => ({
        id: wishlist.id,
        userId: wishlist.userId,
        name: wishlist.name,
        description: wishlist.description,
        items: (wishlist.items as any)?.items || [],
        isPublic: wishlist.isPublic,
        shareUrl: wishlist.shareUrl,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt
      }))
    } catch (error) {
      console.error('Error fetching user wishlists:', error)
      return []
    }
  }

  // Travel Memories
  async addTravelMemory(userId: string, memoryData: Omit<TravelMemory, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'likes'>): Promise<TravelMemory | null> {
    try {
      const memory = await (prisma as any).travelMemory.create({
        data: {
          userId,
          itineraryId: memoryData.itineraryId,
          bookingId: memoryData.bookingId,
          title: memoryData.title,
          description: memoryData.description,
          destination: memoryData.destination,
          date: memoryData.date,
          photos: memoryData.photos as any,
          rating: memoryData.rating,
          highlights: memoryData.highlights,
          recommendations: memoryData.recommendations,
          wouldRecommend: memoryData.wouldRecommend,
          companionType: memoryData.companionType,
          tags: memoryData.tags,
          isPublic: memoryData.isPublic
        }
      })

      return {
        id: memory.id,
        userId: memory.userId,
        itineraryId: memory.itineraryId,
        bookingId: memory.bookingId,
        title: memory.title,
        description: memory.description,
        destination: memory.destination,
        date: memory.date,
        photos: (memory.photos as any) || [],
        rating: memory.rating,
        highlights: memory.highlights,
        recommendations: memory.recommendations,
        wouldRecommend: memory.wouldRecommend,
        companionType: memory.companionType,
        tags: memory.tags,
        isPublic: memory.isPublic,
        likes: memory.likes,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt
      }
    } catch (error) {
      console.error('Error adding travel memory:', error)
      return null
    }
  }

  async getUserMemories(userId: string): Promise<TravelMemory[]> {
    try {
      const memories = await (prisma as any).travelMemory.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      })

      return memories.map((memory: any) => ({
        id: memory.id,
        userId: memory.userId,
        itineraryId: memory.itineraryId,
        bookingId: memory.bookingId,
        title: memory.title,
        description: memory.description,
        destination: memory.destination,
        date: memory.date,
        photos: (memory.photos as any) || [],
        rating: memory.rating,
        highlights: memory.highlights,
        recommendations: memory.recommendations,
        wouldRecommend: memory.wouldRecommend,
        companionType: memory.companionType,
        tags: memory.tags,
        isPublic: memory.isPublic,
        likes: memory.likes,
        createdAt: memory.createdAt,
        updatedAt: memory.updatedAt
      }))
    } catch (error) {
      console.error('Error fetching user memories:', error)
      return []
    }
  }

  // User Statistics
  private async updateUserStats(userId: string, action: string, amount?: number): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) return

      const currentStats = ((user as any).stats as UserStats) || this.getDefaultStats(user.createdAt)

      switch (action) {
        case 'booking_made':
          currentStats.totalTrips += 1
          if (amount) currentStats.totalSpent += amount
          break
        case 'itinerary_saved':
          // Track itinerary creation
          break
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          stats: currentStats as any,
          updatedAt: new Date()
        } as any
      })
    } catch (error) {
      console.error('Error updating user stats:', error)
    }
  }

  // Transform database models to TypeScript types
  private transformSavedItinerary(dbItinerary: any): SavedItinerary {
    return {
      id: dbItinerary.id,
      userId: dbItinerary.userId,
      name: dbItinerary.name,
      description: dbItinerary.description,
      destination: dbItinerary.destination,
      duration: dbItinerary.duration,
      travelers: dbItinerary.travelers,
      totalCost: dbItinerary.totalCost,
      currency: dbItinerary.currency,
      startDate: dbItinerary.startDate,
      endDate: dbItinerary.endDate,
      status: dbItinerary.status as any,
      packageId: dbItinerary.packageId,
      customizations: dbItinerary.customizations || [],
      createdAt: dbItinerary.createdAt,
      updatedAt: dbItinerary.updatedAt,
      lastViewedAt: dbItinerary.lastViewedAt,
      shareSettings: dbItinerary.shareSettings as any || {
        isPublic: false,
        allowComments: false
      },
      tags: dbItinerary.tags,
      rating: dbItinerary.rating,
      review: dbItinerary.review,
      photos: dbItinerary.photos
    }
  }

  private transformBooking(dbBooking: any): BookingHistory {
    return {
      id: dbBooking.id,
      userId: dbBooking.userId,
      bookingReference: dbBooking.bookingReference,
      itineraryId: dbBooking.itineraryId,
      packageId: dbBooking.packageId,
      status: dbBooking.status as any,
      bookingDate: dbBooking.bookingDate,
      travelDates: {
        startDate: dbBooking.travelStartDate,
        endDate: dbBooking.travelEndDate
      },
      destination: dbBooking.destination,
      travelers: dbBooking.travelers,
      totalAmount: dbBooking.totalAmount,
      paidAmount: dbBooking.paidAmount,
      currency: dbBooking.currency,
      paymentMethod: dbBooking.paymentMethod,
      paymentStatus: dbBooking.paymentStatus as any,
      provider: dbBooking.provider,
      contactInfo: dbBooking.contactInfo as any,
      specialRequests: dbBooking.specialRequests,
      documents: dbBooking.documents as any || [],
      notifications: dbBooking.notifications as any || [],
      cancellationPolicy: dbBooking.cancellationPolicy,
      cancellationDeadline: dbBooking.cancellationDeadline,
      createdAt: dbBooking.createdAt,
      updatedAt: dbBooking.updatedAt
    }
  }

  // Utility methods
  private getDefaultPreferences(): UserPreferences {
    return {
      travelStyle: 'mid_range',
      preferredDestinations: [],
      budgetRange: { min: 10000, max: 100000 },
      accommodationType: 'hotel',
      foodPreferences: [],
      activityPreferences: [],
      travelPace: 'moderate',
      groupSize: 2,
      notifications: {
        email: true,
        sms: false,
        push: true,
        deals: true,
        reminders: true
      },
      accessibility: [],
      language: 'en',
      currency: 'INR'
    }
  }

  private getDefaultStats(memberSince: Date): UserStats {
    return {
      totalTrips: 0,
      totalSpent: 0,
      favoriteDestination: '',
      averageTripDuration: 0,
      totalDaysTravel: 0,
      countriesVisited: 0,
      memberSince
    }
  }

  // Data export and management
  async exportUserData(userId: string): Promise<any> {
    try {
      const [profile, itineraries, bookings, recentViews, activities, wishlists, memories] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserItineraries(userId),
        this.getUserBookings(userId),
        this.getRecentlyViewed(userId, 100),
        this.getUserActivities(userId, 500),
        this.getUserWishlists(userId),
        this.getUserMemories(userId)
      ])

      return {
        profile,
        itineraries,
        bookings,
        recentViews,
        activities,
        wishlists,
        memories,
        exportedAt: new Date()
      }
    } catch (error) {
      console.error('Error exporting user data:', error)
      return null
    }
  }

  async deleteUserData(userId: string): Promise<boolean> {
    try {
      // Delete in order due to foreign key constraints
      await prisma.$transaction([
        (prisma as any).userActivity.deleteMany({ where: { userId } }),
        (prisma as any).recentView.deleteMany({ where: { userId } }),
        (prisma as any).travelMemory.deleteMany({ where: { userId } }),
        (prisma as any).wishlist.deleteMany({ where: { userId } }),
        (prisma as any).booking.deleteMany({ where: { userId } }),
        (prisma as any).savedItinerary.deleteMany({ where: { userId } }),
        prisma.trip.deleteMany({ where: { userId } }),
        prisma.session.deleteMany({ where: { userId } }),
        prisma.account.deleteMany({ where: { userId } }),
        prisma.user.delete({ where: { id: userId } })
      ])

      return true
    } catch (error) {
      console.error('Error deleting user data:', error)
      return false
    }
  }

  // Cleanup method to close Prisma connection
  async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }
}

// Export singleton instance
export const userService = new UserDataService()