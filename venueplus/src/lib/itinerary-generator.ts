interface ItineraryDay {
  day: number
  date: Date
  location: string
  activities: Activity[]
  accommodation: string
  meals: Meal[]
  transportation: string
  estimatedCost: number
}

interface Activity {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  duration: number
  category: 'sightseeing' | 'adventure' | 'culture' | 'food' | 'nature' | 'wellness' | 'shopping'
  location: string
  cost: number
  difficulty: 'easy' | 'moderate' | 'hard'
  rating: number
  tips: string[]
}

interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  restaurant: string
  cuisine: string
  cost: number
  rating: number
  location: string
}

interface TripItinerary {
  tripId: string
  destination: string
  totalDays: number
  totalCost: number
  days: ItineraryDay[]
  recommendations: string[]
  packingList: string[]
  weatherInfo: WeatherInfo[]
  transportation: TransportationInfo
}

interface WeatherInfo {
  date: Date
  temperature: { min: number; max: number }
  condition: string
  humidity: number
  rainfall: number
}

interface TransportationInfo {
  arrival: {
    mode: string
    details: string
    cost: number
  }
  local: {
    recommendations: string[]
    estimatedDailyCost: number
  }
  departure: {
    mode: string
    details: string
    cost: number
  }
}

export class ItineraryGenerator {
  static generateItinerary(tripData: any): TripItinerary {
    const { destination, duration, startDate, selectedCities, travelers, fromCity } = tripData
    
    const totalDays = this.getDaysFromDuration(duration)
    const days = this.generateDays(destination, startDate, totalDays, selectedCities, travelers)
    const totalCost = days.reduce((sum, day) => sum + day.estimatedCost, 0)
    
    return {
      tripId: '',
      destination,
      totalDays,
      totalCost,
      days,
      recommendations: this.generateRecommendations(destination, travelers),
      packingList: this.generatePackingList(destination, duration),
      weatherInfo: this.generateWeatherInfo(startDate, totalDays),
      transportation: this.generateTransportationInfo(fromCity, destination)
    }
  }

  private static getDaysFromDuration(duration: string): number {
    switch (duration) {
      case '4-6 Days': return 5
      case '7-9 Days': return 8
      case '10-12 Days': return 11
      case '13-15 Days': return 14
      default: return 7
    }
  }

  private static generateDays(destination: string, startDate: Date, totalDays: number, selectedCities: string[], travelers: string): ItineraryDay[] {
    const days: ItineraryDay[] = []
    const destinationData = this.getDestinationData(destination)
    const cities = selectedCities || [destination]
    
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      
      const cityIndex = Math.floor(i / Math.ceil(totalDays / cities.length))
      const currentCity = cities[cityIndex] || cities[0]
      
      const activities = this.generateActivitiesForDay(i + 1, currentCity, destination, travelers)
      const meals = this.generateMealsForDay(currentCity, destination)
      const accommodation = this.getAccommodation(currentCity, travelers)
      const transportation = this.getLocalTransportation(i + 1, totalDays)
      
      const estimatedCost = activities.reduce((sum, activity) => sum + activity.cost, 0) +
                           meals.reduce((sum, meal) => sum + meal.cost, 0) +
                           (i === 0 ? 150 : 80) // Accommodation cost (first night higher)

      days.push({
        day: i + 1,
        date: currentDate,
        location: currentCity,
        activities,
        accommodation,
        meals,
        transportation,
        estimatedCost
      })
    }
    
    return days
  }

  private static generateActivitiesForDay(day: number, city: string, destination: string, travelers: string): Activity[] {
    const activities: Activity[] = []
    const destinationData = this.getDestinationData(destination)
    
    if (day === 1) {
      // Arrival day - lighter activities
      activities.push({
        id: `day${day}-1`,
        name: 'Airport Transfer & Check-in',
        description: 'Arrive at destination, transfer to accommodation and check-in',
        startTime: '14:00',
        endTime: '16:00',
        duration: 120,
        category: 'transportation' as any,
        location: city,
        cost: 25,
        difficulty: 'easy',
        rating: 4.0,
        tips: ['Keep important documents handy', 'Exchange currency if needed']
      })

      activities.push({
        id: `day${day}-2`,
        name: 'Local Area Exploration',
        description: 'Take a gentle walk around your accommodation area to get familiar with the surroundings',
        startTime: '17:00',
        endTime: '19:00',
        duration: 120,
        category: 'sightseeing',
        location: city,
        cost: 0,
        difficulty: 'easy',
        rating: 4.2,
        tips: ['Ask locals for recommendations', 'Download offline maps']
      })
    } else if (day <= 3) {
      // Main sightseeing days
      activities.push({
        id: `day${day}-1`,
        name: destinationData.mainAttractions[0] || `${city} City Tour`,
        description: `Explore the iconic landmarks and cultural sites of ${city}`,
        startTime: '09:00',
        endTime: '12:00',
        duration: 180,
        category: 'sightseeing',
        location: city,
        cost: 45,
        difficulty: 'moderate',
        rating: 4.7,
        tips: ['Book tickets in advance', 'Bring comfortable walking shoes', 'Stay hydrated']
      })

      activities.push({
        id: `day${day}-2`,
        name: destinationData.culturalExperience || `${city} Cultural Experience`,
        description: 'Immerse yourself in local culture and traditions',
        startTime: '14:00',
        endTime: '17:00',
        duration: 180,
        category: 'culture',
        location: city,
        cost: 35,
        difficulty: 'easy',
        rating: 4.5,
        tips: ['Respect local customs', 'Try local cuisine', 'Interact with locals']
      })
    } else {
      // Adventure/special activities for later days
      activities.push({
        id: `day${day}-1`,
        name: destinationData.adventureActivity || `${city} Adventure Activity`,
        description: 'Exciting outdoor adventure or unique local experience',
        startTime: '08:00',
        endTime: '16:00',
        duration: 480,
        category: 'adventure',
        location: city,
        cost: 75,
        difficulty: 'moderate',
        rating: 4.8,
        tips: ['Check weather conditions', 'Bring necessary gear', 'Follow safety guidelines']
      })
    }
    
    return activities
  }

  private static generateMealsForDay(city: string, destination: string): Meal[] {
    const destinationData = this.getDestinationData(destination)
    
    return [
      {
        type: 'breakfast',
        restaurant: destinationData.breakfastSpot || `${city} Breakfast Café`,
        cuisine: destinationData.localCuisine || 'Local',
        cost: 15,
        rating: 4.3,
        location: city
      },
      {
        type: 'lunch',
        restaurant: destinationData.lunchSpot || `${city} Local Restaurant`,
        cuisine: destinationData.localCuisine || 'Local',
        cost: 25,
        rating: 4.5,
        location: city
      },
      {
        type: 'dinner',
        restaurant: destinationData.dinnerSpot || `${city} Fine Dining`,
        cuisine: destinationData.localCuisine || 'Local',
        cost: 40,
        rating: 4.6,
        location: city
      }
    ]
  }

  private static getAccommodation(city: string, travelers: string): string {
    const type = travelers.includes('family') ? 'Family Resort' : 
                 travelers.includes('couple') ? 'Boutique Hotel' : 
                 'Modern Hotel'
    return `${type} in ${city}`
  }

  private static getLocalTransportation(day: number, totalDays: number): string {
    if (day === 1) return 'Airport transfer included'
    if (day === totalDays) return 'Checkout and departure transfer'
    return 'Local transportation (taxi/bus/walking)'
  }

  private static generateRecommendations(destination: string, travelers: string): string[] {
    const base = [
      'Book accommodations in advance for better rates',
      'Try local street food for authentic flavors',
      'Learn basic local phrases',
      'Respect local customs and dress codes',
      'Keep copies of important documents',
      'Stay hydrated and use sunscreen'
    ]

    if (travelers.includes('family')) {
      base.push('Look for family-friendly activities and restaurants')
      base.push('Pack entertainment for children during travel')
    }

    if (travelers.includes('adventure')) {
      base.push('Check weather conditions for outdoor activities')
      base.push('Bring appropriate gear for adventure sports')
    }

    return base
  }

  private static generatePackingList(destination: string, duration: string): string[] {
    const base = [
      'Passport and visa documents',
      'Travel insurance documents',
      'Comfortable walking shoes',
      'Sunscreen and sunglasses',
      'Personal medications',
      'Portable charger',
      'Camera',
      'Light jacket or sweater'
    ]

    const destinationData = this.getDestinationData(destination)
    if (destinationData.climate === 'tropical') {
      base.push('Light, breathable clothing', 'Insect repellent', 'Hat', 'Swimwear')
    }

    if (destinationData.climate === 'temperate') {
      base.push('Layered clothing', 'Umbrella', 'Warm jacket')
    }

    return base
  }

  private static generateWeatherInfo(startDate: Date, totalDays: number): WeatherInfo[] {
    // This would typically call a weather API
    // For now, generate sample weather data
    const weatherInfo: WeatherInfo[] = []
    
    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      
      weatherInfo.push({
        date,
        temperature: { min: 22 + Math.random() * 5, max: 28 + Math.random() * 8 },
        condition: ['Sunny', 'Partly Cloudy', 'Clear'][Math.floor(Math.random() * 3)],
        humidity: 60 + Math.random() * 30,
        rainfall: Math.random() * 10
      })
    }
    
    return weatherInfo
  }

  private static generateTransportationInfo(fromCity: string, destination: string): TransportationInfo {
    return {
      arrival: {
        mode: 'Flight',
        details: `${fromCity} to ${destination}`,
        cost: 450
      },
      local: {
        recommendations: ['Use ride-sharing apps', 'Public transport is available', 'Walking for short distances'],
        estimatedDailyCost: 15
      },
      departure: {
        mode: 'Flight',
        details: `${destination} to ${fromCity}`,
        cost: 450
      }
    }
  }

  private static getDestinationData(destination: string): any {
    const destinationDatabase: Record<string, any> = {
      'Bali': {
        climate: 'tropical',
        localCuisine: 'Indonesian',
        mainAttractions: ['Tanah Lot Temple', 'Ubud Rice Terraces', 'Mount Batur'],
        culturalExperience: 'Traditional Balinese Dance Performance',
        adventureActivity: 'White Water Rafting & Volcano Trekking',
        breakfastSpot: 'Sari Organik (Ubud)',
        lunchSpot: 'Warung Babi Guling',
        dinnerSpot: 'Mozaic Restaurant Gastronomique'
      },
      'Tokyo': {
        climate: 'temperate',
        localCuisine: 'Japanese',
        mainAttractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Meiji Shrine'],
        culturalExperience: 'Traditional Tea Ceremony',
        adventureActivity: 'Mount Fuji Day Trip',
        breakfastSpot: 'Tsukiji Outer Market',
        lunchSpot: 'Ramen Street',
        dinnerSpot: 'Sukiyabashi Jiro'
      },
      'Paris': {
        climate: 'temperate',
        localCuisine: 'French',
        mainAttractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame'],
        culturalExperience: 'Seine River Cruise',
        adventureActivity: 'Versailles Palace Day Trip',
        breakfastSpot: 'Du Pain et des Idées',
        lunchSpot: 'L\'As du Fallafel',
        dinnerSpot: 'Le Comptoir du Relais'
      }
    }

    return destinationDatabase[destination] || {
      climate: 'temperate',
      localCuisine: 'Local',
      mainAttractions: [`${destination} Main Attractions`],
      culturalExperience: `${destination} Cultural Tour`,
      adventureActivity: `${destination} Adventure Experience`,
      breakfastSpot: `${destination} Breakfast Spot`,
      lunchSpot: `${destination} Local Restaurant`,
      dinnerSpot: `${destination} Fine Dining`
    }
  }
}

export type { TripItinerary, ItineraryDay, Activity, Meal }
