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

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

