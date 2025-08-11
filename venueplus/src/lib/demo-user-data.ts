// Demo data seeder for user profile functionality

import { userService } from './user-service'
import { UserProfile, SavedItinerary, BookingHistory, TravelMemory } from './user-types'

export async function seedDemoUserData(): Promise<string> {
  // Create demo user profile
  const demoUser = await userService.createUserProfile({
    email: 'demo@venueplus.com',
    name: 'Alex Traveler',
    phone: '+91 98765 43210',
    preferences: {
      travelStyle: 'mid_range',
      preferredDestinations: ['Goa', 'Kerala', 'Himachal Pradesh', 'Rajasthan'],
      budgetRange: { min: 25000, max: 75000 },
      accommodationType: 'hotel',
      foodPreferences: ['Vegetarian', 'Local Cuisine', 'Seafood'],
      activityPreferences: ['Adventure Sports', 'Cultural Tours', 'Beach Activities', 'Mountain Trekking'],
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
  })

  const userId = demoUser.id

  // Update user stats
  await userService.updateUserProfile(userId, {
    stats: {
      totalTrips: 8,
      totalSpent: 245000,
      favoriteDestination: 'Goa',
      averageTripDuration: 6,
      totalDaysTravel: 48,
      countriesVisited: 3,
      lastTripDate: new Date('2024-02-15'),
      memberSince: new Date('2023-01-15')
    }
  })

  // Add sample saved itineraries
  const itineraries = [
    {
      name: 'Goa Beach Paradise',
      description: 'A perfect beach vacation with water sports, nightlife, and relaxation',
      destination: 'Goa',
      duration: '5 days 4 nights',
      travelers: 2,
      totalCost: 35000,
      currency: 'INR',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-24'),
      status: 'planned' as const,
      tags: ['beach', 'adventure', 'nightlife', 'couples']
    },
    {
      name: 'Kerala Backwaters & Hills',
      description: 'Explore the serene backwaters of Alleppey and the hills of Munnar',
      destination: 'Kerala',
      duration: '7 days 6 nights',
      travelers: 2,
      totalCost: 52000,
      currency: 'INR',
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-01-16'),
      status: 'draft' as const,
      tags: ['nature', 'backwaters', 'hills', 'romantic']
    },
    {
      name: 'Manali Adventure Trip',
      description: 'Completed adventure trip with trekking, river rafting, and mountain activities',
      destination: 'Manali',
      duration: '6 days 5 nights',
      travelers: 4,
      totalCost: 48000,
      currency: 'INR',
      startDate: new Date('2024-05-15'),
      endDate: new Date('2024-05-20'),
      status: 'completed' as const,
      tags: ['adventure', 'mountains', 'trekking', 'friends'],
      rating: 5,
      review: 'Amazing trip! The adventure activities were thrilling and the mountain views were breathtaking.'
    }
  ]

  for (const itineraryData of itineraries) {
    await userService.saveItinerary(userId, itineraryData)
  }

  // Add sample booking history
  const bookings = [
    {
      bookingReference: 'VP2024001',
      destination: 'Goa',
      status: 'completed' as const,
      bookingDate: new Date('2024-02-01'),
      travelDates: {
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-02-19')
      },
      travelers: 2,
      totalAmount: 28500,
      paidAmount: 28500,
      currency: 'INR',
      paymentMethod: 'Credit Card',
      paymentStatus: 'paid' as const,
      provider: 'VenuePlus Travel',
      contactInfo: {
        name: 'Alex Traveler',
        email: 'demo@venueplus.com',
        phone: '+91 98765 43210'
      },
      specialRequests: ['Sea-facing room', 'Vegetarian meals']
    },
    {
      bookingReference: 'VP2024015',
      destination: 'Himachal Pradesh',
      status: 'completed' as const,
      bookingDate: new Date('2024-05-01'),
      travelDates: {
        startDate: new Date('2024-05-15'),
        endDate: new Date('2024-05-20')
      },
      travelers: 4,
      totalAmount: 48000,
      paidAmount: 48000,
      currency: 'INR',
      paymentMethod: 'UPI',
      paymentStatus: 'paid' as const,
      provider: 'Mountain Adventures',
      contactInfo: {
        name: 'Alex Traveler',
        email: 'demo@venueplus.com',
        phone: '+91 98765 43210'
      },
      specialRequests: ['Adventure insurance', 'Equipment rental']
    },
    {
      bookingReference: 'VP2024032',
      destination: 'Rajasthan',
      status: 'confirmed' as const,
      bookingDate: new Date('2024-10-20'),
      travelDates: {
        startDate: new Date('2024-11-25'),
        endDate: new Date('2024-11-30')
      },
      travelers: 2,
      totalAmount: 42000,
      paidAmount: 21000,
      currency: 'INR',
      paymentMethod: 'Bank Transfer',
      paymentStatus: 'partially_paid' as const,
      provider: 'Royal Rajasthan Tours',
      contactInfo: {
        name: 'Alex Traveler',
        email: 'demo@venueplus.com',
        phone: '+91 98765 43210'
      },
      specialRequests: ['Heritage hotel preference', 'Cultural guide']
    }
  ]

  for (const bookingData of bookings) {
    await userService.addBooking(userId, bookingData)
  }

  // Add recently viewed items
  const recentItems = [
    {
      itemType: 'package' as const,
      itemId: 'pkg_kerala_001',
      itemData: {
        name: 'Kerala God\'s Own Country',
        description: '8 days exploring Kerala\'s backwaters and hill stations',
        imageUrl: '/api/placeholder/300/200',
        price: 45000,
        rating: 4.6,
        location: 'Kerala'
      },
      viewDuration: 185,
      source: 'search' as const
    },
    {
      itemType: 'destination' as const,
      itemId: 'dest_ladakh',
      itemData: {
        name: 'Ladakh Adventure',
        description: 'High altitude desert adventure',
        imageUrl: '/api/placeholder/300/200',
        price: 65000,
        rating: 4.8,
        location: 'Ladakh'
      },
      viewDuration: 120,
      source: 'recommendation' as const
    },
    {
      itemType: 'hotel' as const,
      itemId: 'hotel_leela_goa',
      itemData: {
        name: 'The Leela Goa',
        description: 'Luxury beach resort in South Goa',
        imageUrl: '/api/placeholder/300/200',
        price: 15000,
        rating: 4.7,
        location: 'Goa'
      },
      viewDuration: 95,
      source: 'direct' as const
    }
  ]

  for (const item of recentItems) {
    await userService.addRecentlyViewed(userId, item)
  }

  // Add travel memories
  const memories = [
    {
      title: 'Sunset at Anjuna Beach',
      description: 'One of the most beautiful sunsets I\'ve ever witnessed. The colors were absolutely magical!',
      destination: 'Goa',
      date: new Date('2024-02-17'),
      photos: [
        {
          id: 'photo_1',
          url: '/api/placeholder/400/300',
          caption: 'Golden hour at Anjuna Beach',
          uploadedAt: new Date('2024-02-17')
        }
      ],
      rating: 5,
      highlights: ['Amazing sunset', 'Great atmosphere', 'Perfect weather'],
      recommendations: ['Visit during golden hour', 'Try the beach shacks', 'Bring a camera'],
      wouldRecommend: true,
      companionType: 'couple' as const,
      tags: ['sunset', 'beach', 'romantic', 'photography'],
      isPublic: true
    },
    {
      title: 'Rohtang Pass Adventure',
      description: 'Thrilling drive through the mountains with snow-capped peaks everywhere. Adventure at its best!',
      destination: 'Manali',
      date: new Date('2024-05-18'),
      photos: [
        {
          id: 'photo_2',
          url: '/api/placeholder/400/300',
          caption: 'Snow-covered Rohtang Pass',
          uploadedAt: new Date('2024-05-18')
        }
      ],
      rating: 5,
      highlights: ['Snow activities', 'Mountain views', 'Adventure sports'],
      recommendations: ['Carry warm clothes', 'Book permits in advance', 'Start early'],
      wouldRecommend: true,
      companionType: 'friends' as const,
      tags: ['mountains', 'snow', 'adventure', 'trekking'],
      isPublic: true
    }
  ]

  for (const memoryData of memories) {
    await userService.addTravelMemory(userId, memoryData)
  }

  // Add wishlist
  const wishlist = await userService.createWishlist(
    userId, 
    'Dream Destinations', 
    'Places I want to visit someday'
  )

  // Log some activities
  const activities = [
    {
      type: 'search' as const,
      description: 'Searched for Kerala packages',
      metadata: { query: 'Kerala backwaters', results: 12 }
    },
    {
      type: 'save' as const,
      description: 'Saved Goa Beach Paradise itinerary',
      metadata: { itineraryId: 'itinerary_id_placeholder' }
    },
    {
      type: 'view' as const,
      description: 'Viewed The Leela Goa hotel details',
      metadata: { hotelId: 'hotel_leela_goa', duration: 95 }
    }
  ]

  for (const activity of activities) {
    await userService.logActivity(userId, activity)
  }

  console.log('Demo user data seeded successfully!')
  return userId
}

// Function to create multiple demo users
export async function createMultipleDemoUsers(): Promise<string[]> {
  const userIds: string[] = []

  const users = [
    {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+91 98765 43211',
      travelStyle: 'luxury' as const,
      favoriteDestination: 'Kerala',
      totalTrips: 12,
      totalSpent: 450000
    },
    {
      name: 'Raj Patel',
      email: 'raj.patel@example.com',
      phone: '+91 98765 43212',
      travelStyle: 'budget' as const,
      favoriteDestination: 'Himachal Pradesh',
      totalTrips: 6,
      totalSpent: 125000
    },
    {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43213',
      travelStyle: 'adventure' as const,
      favoriteDestination: 'Ladakh',
      totalTrips: 15,
      totalSpent: 380000
    }
  ]

  for (const userData of users) {
    const user = await userService.createUserProfile({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      preferences: {
        travelStyle: userData.travelStyle,
        preferredDestinations: ['Goa', 'Kerala', 'Himachal Pradesh'],
        budgetRange: 
          userData.travelStyle === 'luxury' ? { min: 50000, max: 200000 } :
          userData.travelStyle === 'budget' ? { min: 5000, max: 30000 } :
          { min: 15000, max: 80000 },
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
    })

    await userService.updateUserProfile(user.id, {
      stats: {
        totalTrips: userData.totalTrips,
        totalSpent: userData.totalSpent,
        favoriteDestination: userData.favoriteDestination,
        averageTripDuration: 6,
        totalDaysTravel: userData.totalTrips * 6,
        countriesVisited: 2,
        memberSince: new Date('2023-01-15')
      }
    })

    userIds.push(user.id)
  }

  return userIds
}
