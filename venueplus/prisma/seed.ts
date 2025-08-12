import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.tripActivity.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.tripStop.deleteMany()
  await prisma.city.deleteMany()

  // Create cities with real data
  const cities = await prisma.city.createMany({
    data: [
      {
        name: "Bali",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.3405,
        longitude: 115.0920,
        costIndex: 2,
        popularity: 95,
        imageUrl: "/images/cities/bali.jpg",
        description: "Tropical paradise with beautiful beaches and rich culture",
        tags: ["Beach", "Culture", "Spiritual", "Budget"]
      },
      {
        name: "Ubud",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.5069,
        longitude: 115.2625,
        costIndex: 2,
        popularity: 85,
        imageUrl: "/images/cities/ubud.jpg",
        description: "The cultural homeland with rice terraces and yoga retreats",
        tags: ["Culture", "Nature", "Spiritual", "Budget"]
      },
      {
        name: "Kuta",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.7226,
        longitude: 115.1691,
        costIndex: 2,
        popularity: 80,
        imageUrl: "/images/cities/kuta.jpg",
        description: "Hotspot for surfers with vibrant nightlife",
        tags: ["Beach", "Surfing", "Nightlife", "Budget"]
      },
      {
        name: "Seminyak",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.6942,
        longitude: 115.1731,
        costIndex: 3,
        popularity: 75,
        imageUrl: "/images/cities/seminyak.jpg",
        description: "Happening heartland of modern Bali",
        tags: ["Beach", "Luxury", "Dining", "Affordable"]
      },
      {
        name: "Nusa Penida",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.7294,
        longitude: 115.5442,
        costIndex: 2,
        popularity: 70,
        imageUrl: "/images/cities/nusa-penida.jpg",
        description: "Broken Beach and stunning cliff views",
        tags: ["Nature", "Adventure", "Scenic", "Affordable"]
      },
      {
        name: "Gili Trawangan",
        country: "Indonesia",
        countryCode: "ID",
        latitude: -8.3500,
        longitude: 116.0333,
        costIndex: 2,
        popularity: 65,
        imageUrl: "/images/cities/gili.jpg",
        description: "Three elusive islands with crystal clear waters",
        tags: ["Island", "Diving", "Paradise", "Affordable"]
      },
      {
        name: "Bangkok",
        country: "Thailand",
        countryCode: "TH",
        latitude: 13.7563,
        longitude: 100.5018,
        costIndex: 2,
        popularity: 90,
        imageUrl: "/images/cities/bangkok.jpg",
        description: "Vibrant capital with temples and street food",
        tags: ["City", "Culture", "Food", "Budget"]
      },
      {
        name: "Phuket",
        country: "Thailand",
        countryCode: "TH",
        latitude: 7.8804,
        longitude: 98.3923,
        costIndex: 3,
        popularity: 85,
        imageUrl: "/images/cities/phuket.jpg",
        description: "Island paradise with stunning beaches",
        tags: ["Beach", "Island", "Tropical", "Budget"]
      },
      {
        name: "Maldives",
        country: "Maldives",
        countryCode: "MV",
        latitude: 3.2028,
        longitude: 73.2207,
        costIndex: 5,
        popularity: 95,
        imageUrl: "/images/cities/maldives.jpg",
        description: "Luxury tropical paradise",
        tags: ["Luxury", "Beach", "Honeymoon", "Paradise"]
      },
      {
        name: "Singapore",
        country: "Singapore",
        countryCode: "SG",
        latitude: 1.3521,
        longitude: 103.8198,
        costIndex: 4,
        popularity: 85,
        imageUrl: "/images/cities/singapore.jpg",
        description: "Modern city-state with incredible food scene",
        tags: ["City", "Modern", "Food", "Family"]
      },
      {
        name: "Dubai",
        country: "UAE",
        countryCode: "AE",
        latitude: 25.2048,
        longitude: 55.2708,
        costIndex: 4,
        popularity: 80,
        imageUrl: "/images/cities/dubai.jpg",
        description: "Futuristic city with luxury shopping and desert adventures",
        tags: ["Luxury", "Modern", "Desert", "Shopping"]
      },
      {
        name: "Abu Dhabi",
        country: "UAE",
        countryCode: "AE",
        latitude: 24.2539,
        longitude: 54.6916,
        costIndex: 4,
        popularity: 70,
        imageUrl: "/images/cities/abu-dhabi.jpg",
        description: "Capital city with cultural attractions",
        tags: ["Culture", "Modern", "Luxury", "Popular"]
      }
    ]
  })

  // Create activities for Bali cities
  const baliCity = await prisma.city.findFirst({ where: { name: "Bali" } })
  const ubudCity = await prisma.city.findFirst({ where: { name: "Ubud" } })

  if (baliCity) {
    await prisma.activity.createMany({
      data: [
        {
          cityId: baliCity.id,
          name: "Tanah Lot Temple Visit",
          description: "Visit the iconic rock formation temple",
          category: "Cultural",
          estimatedCost: 15,
          duration: 180,
          rating: 4.5,
          tags: ["Temple", "Sunset", "Photography"]
        },
        {
          cityId: baliCity.id,
          name: "Uluwatu Cliff Temple",
          description: "Clifftop temple with ocean views",
          category: "Cultural",
          estimatedCost: 10,
          duration: 120,
          rating: 4.7,
          tags: ["Temple", "Cliff", "Ocean"]
        },
        {
          cityId: baliCity.id,
          name: "Bali Swing Experience",
          description: "Swing over the jungle canopy",
          category: "Adventure",
          estimatedCost: 25,
          duration: 90,
          rating: 4.3,
          tags: ["Adventure", "Jungle", "Instagram"]
        },
        {
          cityId: baliCity.id,
          name: "Traditional Balinese Massage",
          description: "Relaxing traditional spa treatment",
          category: "Wellness",
          estimatedCost: 20,
          duration: 60,
          rating: 4.6,
          tags: ["Spa", "Relaxation", "Traditional"]
        }
      ]
    })
  }

  if (ubudCity) {
    await prisma.activity.createMany({
      data: [
        {
          cityId: ubudCity.id,
          name: "Tegallalang Rice Terraces",
          description: "Beautiful layered rice field views",
          category: "Nature",
          estimatedCost: 5,
          duration: 120,
          rating: 4.4,
          tags: ["Nature", "Photography", "Hiking"]
        },
        {
          cityId: ubudCity.id,
          name: "Monkey Forest Sanctuary",
          description: "Sacred monkey forest in central Ubud",
          category: "Nature",
          estimatedCost: 3,
          duration: 60,
          rating: 4.2,
          tags: ["Wildlife", "Forest", "Sacred"]
        },
        {
          cityId: ubudCity.id,
          name: "Yoga Class at Sunrise",
          description: "Morning yoga session with valley views",
          category: "Wellness",
          estimatedCost: 15,
          duration: 90,
          rating: 4.8,
          tags: ["Yoga", "Sunrise", "Wellness"]
        }
      ]
    })
  }

  // Create sample users
  const users = await prisma.user.createMany({
    data: [
      {
        email: 'john.doe@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LH3LJAGjH1Jqz9w.i', // hashed "password123"
        name: 'John Doe',
        phone: '+91-9876543210',
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        stats: {
          totalTrips: 3,
          totalSpent: 45000,
          countriesVisited: 5,
          memberSince: new Date('2023-01-15')
        },
        preferences: {
          budget: 'mid-range',
          travelStyle: 'adventure',
          accommodation: 'hotel'
        }
      },
      {
        email: 'jane.smith@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LH3LJAGjH1Jqz9w.i',
        name: 'Jane Smith',
        phone: '+91-8765432109',
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        stats: {
          totalTrips: 5,
          totalSpent: 78000,
          countriesVisited: 8,
          memberSince: new Date('2022-08-20')
        },
        preferences: {
          budget: 'luxury',
          travelStyle: 'relaxation',
          accommodation: 'resort'
        }
      },
      {
        email: 'alex.johnson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LH3LJAGjH1Jqz9w.i',
        name: 'Alex Johnson',
        phone: '+91-7654321098',
        emailVerified: true,
        lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        stats: {
          totalTrips: 2,
          totalSpent: 23000,
          countriesVisited: 3,
          memberSince: new Date('2023-06-10')
        },
        preferences: {
          budget: 'budget',
          travelStyle: 'cultural',
          accommodation: 'hostel'
        }
      },
      {
        email: 'sarah.wilson@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LH3LJAGjH1Jqz9w.i',
        name: 'Sarah Wilson',
        phone: '+91-6543210987',
        emailVerified: true,
        lastLoginAt: new Date(), // today
        stats: {
          totalTrips: 7,
          totalSpent: 120000,
          countriesVisited: 12,
          memberSince: new Date('2021-12-05')
        },
        preferences: {
          budget: 'luxury',
          travelStyle: 'luxury',
          accommodation: 'resort'
        }
      },
      {
        email: 'mike.brown@example.com',
        password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LH3LJAGjH1Jqz9w.i',
        name: 'Mike Brown',
        phone: '+91-5432109876',
        emailVerified: false,
        lastLoginAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        stats: {
          totalTrips: 1,
          totalSpent: 12000,
          countriesVisited: 1,
          memberSince: new Date('2024-01-20')
        },
        preferences: {
          budget: 'budget',
          travelStyle: 'adventure',
          accommodation: 'hostel'
        }
      }
    ]
  })

  // Get created users to create bookings
  const createdUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' }
  })

  // Create sample bookings
  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i]
    const bookingCount = Math.floor(Math.random() * 3) + 1 // 1-3 bookings per user

    for (let j = 0; j < bookingCount; j++) {
      const destinations = ['Bali, Indonesia', 'Thailand', 'Maldives', 'Singapore', 'Dubai, UAE']
      const providers = ['MakeMyTrip', 'Booking.com', 'Agoda', 'Expedia', 'VenuePlus']
      const statuses = ['confirmed', 'completed', 'pending', 'cancelled']
      
      const startDate = new Date(Date.now() + (Math.random() * 90 - 30) * 24 * 60 * 60 * 1000) // ±30 days
      const endDate = new Date(startDate.getTime() + (Math.random() * 10 + 3) * 24 * 60 * 60 * 1000) // 3-13 days later

      await prisma.booking.create({
        data: {
          userId: user.id,
          bookingReference: `VP${Date.now()}${i}${j}`,
          destination: destinations[Math.floor(Math.random() * destinations.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          bookingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // last 30 days
          travelStartDate: startDate,
          travelEndDate: endDate,
          travelers: Math.floor(Math.random() * 4) + 1, // 1-4 travelers
          totalAmount: Math.floor(Math.random() * 50000) + 10000, // 10k-60k
          paidAmount: Math.floor(Math.random() * 30000) + 5000, // 5k-35k
          provider: providers[Math.floor(Math.random() * providers.length)],
          contactInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone
          },
          bookingData: {
            roomType: 'Deluxe',
            mealPlan: 'All Inclusive',
            flightIncluded: true
          }
        }
      })
    }
  }

  // Create sample saved itineraries
  for (let i = 0; i < createdUsers.length; i++) {
    const user = createdUsers[i]
    const itineraryCount = Math.floor(Math.random() * 2) + 1 // 1-2 itineraries per user

    for (let j = 0; j < itineraryCount; j++) {
      const destinations = ['Bali Adventure', 'Thailand Beach Tour', 'Maldives Honeymoon', 'Singapore City Break', 'Dubai Luxury']
      
      await prisma.savedItinerary.create({
        data: {
          userId: user.id,
          name: destinations[Math.floor(Math.random() * destinations.length)],
          description: 'Amazing travel experience with customized itinerary',
          destination: destinations[Math.floor(Math.random() * destinations.length)].split(' ')[0],
          duration: `${Math.floor(Math.random() * 7) + 3} days`,
          travelers: Math.floor(Math.random() * 4) + 1,
          totalCost: Math.floor(Math.random() * 40000) + 15000,
          status: 'planned',
          itineraryData: {
            days: [
              { day: 1, activities: ['Arrival', 'Hotel Check-in', 'Local Sightseeing'] },
              { day: 2, activities: ['Adventure Activities', 'Cultural Tours'] },
              { day: 3, activities: ['Departure'] }
            ]
          },
          tags: ['adventure', 'culture', 'relaxation']
        }
      })
    }
  }

  console.log('Database seeded successfully with users, bookings, and itineraries!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

