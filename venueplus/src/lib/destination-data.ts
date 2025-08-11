// Real destination data for accurate travel information
export interface DestinationInfo {
  name: string
  airportCode: string
  airportName: string
  coordinates: { lat: number; lng: number }
  timezone: string
  realHotels: HotelInfo[]
  realActivities: ActivityInfo[]
  realRestaurants: RestaurantInfo[]
  transportation: TransportationInfo
  weather: WeatherPatterns
}

export interface HotelInfo {
  name: string
  category: 'budget' | 'mid_range' | 'luxury'
  location: string
  address: string
  rating: number
  amenities: string[]
  priceRange: { min: number; max: number }
  coordinates: { lat: number; lng: number }
}

export interface ActivityInfo {
  name: string
  category: string
  duration: string
  location: string
  address: string
  description: string
  priceRange: { min: number; max: number }
  timings: string
  bestTimeToVisit: string
  difficulty: 'easy' | 'moderate' | 'challenging'
  coordinates: { lat: number; lng: number }
  ageRecommendation?: string
}

export interface RestaurantInfo {
  name: string
  cuisine: string
  category: 'street_food' | 'casual' | 'fine_dining'
  location: string
  priceRange: { min: number; max: number }
  specialties: string[]
  timings: string
  coordinates: { lat: number; lng: number }
}

export interface TransportationInfo {
  fromDelhi: {
    flight: {
      duration: string
      distance: string
      airlines: string[]
      frequency: string
    }
    train: {
      duration: string
      distance: string
      trains: string[]
      frequency: string
    }
    road: {
      duration: string
      distance: string
      routes: string[]
    }
  }
  localTransport: string[]
  averageCosts: {
    flight: { min: number; max: number }
    train: { min: number; max: number }
    taxi: { min: number; max: number }
    local: { min: number; max: number }
  }
}

export interface WeatherPatterns {
  bestMonths: string[]
  temperature: {
    winter: { min: number; max: number }
    summer: { min: number; max: number }
    monsoon: { min: number; max: number }
  }
  rainfall: string
  clothing: {
    winter: string[]
    summer: string[]
    monsoon: string[]
  }
}

// Real destination database
export const destinationDatabase: { [key: string]: DestinationInfo } = {
  'Goa': {
    name: 'Goa',
    airportCode: 'GOI',
    airportName: 'Goa International Airport (Dabolim)',
    coordinates: { lat: 15.2993, lng: 74.1240 },
    timezone: 'Asia/Kolkata',
    realHotels: [
      {
        name: 'The Leela Goa',
        category: 'luxury',
        location: 'Cavelossim Beach',
        address: 'Cavelossim Beach, Mobor, Goa 403731',
        rating: 4.6,
        amenities: ['Beach Access', 'Spa', 'Pool', 'Golf Course', 'Multiple Restaurants'],
        priceRange: { min: 15000, max: 35000 },
        coordinates: { lat: 15.1598, lng: 73.9364 }
      },
      {
        name: 'Hotel Fidalgo',
        category: 'mid_range',
        location: 'Panaji',
        address: '18th June Road, Panaji, Goa 403001',
        rating: 4.1,
        amenities: ['Restaurant', 'Pool', 'WiFi', 'Room Service', 'Travel Desk'],
        priceRange: { min: 3500, max: 7500 },
        coordinates: { lat: 15.4909, lng: 73.8278 }
      },
      {
        name: 'Zostel Goa',
        category: 'budget',
        location: 'Anjuna',
        address: 'Anjuna Beach Road, Anjuna, Goa 403509',
        rating: 4.2,
        amenities: ['WiFi', 'Common Kitchen', 'Cafe', 'Events', 'Bike Rental'],
        priceRange: { min: 800, max: 2500 },
        coordinates: { lat: 15.5735, lng: 73.7389 }
      }
    ],
    realActivities: [
      {
        name: 'Dudhsagar Waterfalls Trek',
        category: 'adventure',
        duration: '6-8 hours',
        location: 'Bhagwan Mahaveer Sanctuary',
        address: 'Dudhsagar Falls, Goa-Karnataka Border',
        description: 'Spectacular four-tiered waterfall trek through dense forests',
        priceRange: { min: 1500, max: 3000 },
        timings: '6:00 AM - 6:00 PM',
        bestTimeToVisit: 'October to March',
        difficulty: 'moderate',
        coordinates: { lat: 15.3144, lng: 74.3144 }
      },
      {
        name: 'Old Goa Churches Tour',
        category: 'cultural',
        duration: '4-5 hours',
        location: 'Old Goa',
        address: 'Old Goa, Goa 403402',
        description: 'UNESCO World Heritage churches including Basilica of Bom Jesus',
        priceRange: { min: 500, max: 1200 },
        timings: '9:00 AM - 5:00 PM',
        bestTimeToVisit: 'Morning hours',
        difficulty: 'easy',
        coordinates: { lat: 15.5007, lng: 73.9114 }
      },
      {
        name: 'Spice Plantation Tour',
        category: 'cultural',
        duration: '3-4 hours',
        location: 'Ponda',
        address: 'Tropical Spice Plantation, Keri, Ponda, Goa',
        description: 'Organic spice farm tour with traditional lunch',
        priceRange: { min: 800, max: 1500 },
        timings: '9:00 AM - 5:00 PM',
        bestTimeToVisit: 'Morning hours',
        difficulty: 'easy',
        coordinates: { lat: 15.4100, lng: 74.0200 }
      }
    ],
    realRestaurants: [
      {
        name: 'Thalassa',
        cuisine: 'Greek',
        category: 'fine_dining',
        location: 'Vagator Beach',
        priceRange: { min: 1500, max: 3500 },
        specialties: ['Greek Moussaka', 'Fresh Seafood', 'Sunset Views'],
        timings: '12:00 PM - 1:00 AM',
        coordinates: { lat: 15.6094, lng: 73.7269 }
      },
      {
        name: 'Fisherman\'s Wharf',
        cuisine: 'Goan',
        category: 'casual',
        location: 'Cavelossim',
        priceRange: { min: 800, max: 2000 },
        specialties: ['Fish Curry Rice', 'Bebinca', 'Goan Sausage'],
        timings: '12:00 PM - 11:00 PM',
        coordinates: { lat: 15.1598, lng: 73.9364 }
      },
      {
        name: 'Vinayak Family Restaurant',
        cuisine: 'Goan',
        category: 'street_food',
        location: 'Assagao',
        priceRange: { min: 300, max: 800 },
        specialties: ['Goan Fish Curry', 'Pork Vindaloo', 'Sol Kadhi'],
        timings: '11:00 AM - 10:00 PM',
        coordinates: { lat: 15.5947, lng: 73.7758 }
      }
    ],
    transportation: {
      fromDelhi: {
        flight: {
          duration: '2h 45m',
          distance: '1,864 km',
          airlines: ['IndiGo', 'Air India', 'SpiceJet', 'Vistara'],
          frequency: '15-20 flights daily'
        },
        train: {
          duration: '26-28 hours',
          distance: '1,874 km',
          trains: ['Rajdhani Express', 'Goa Express', 'Karnataka Express'],
          frequency: '2-3 trains daily'
        },
        road: {
          duration: '20-22 hours',
          distance: '1,900 km',
          routes: ['NH48 via Mumbai', 'NH52 via Pune']
        }
      },
      localTransport: ['Taxi', 'Auto Rickshaw', 'Motorcycle Taxi', 'Bus', 'Bicycle'],
      averageCosts: {
        flight: { min: 4500, max: 12000 },
        train: { min: 1200, max: 4500 },
        taxi: { min: 300, max: 800 },
        local: { min: 20, max: 200 }
      }
    },
    weather: {
      bestMonths: ['November', 'December', 'January', 'February', 'March'],
      temperature: {
        winter: { min: 20, max: 32 },
        summer: { min: 26, max: 37 },
        monsoon: { min: 24, max: 30 }
      },
      rainfall: 'Heavy during June-September',
      clothing: {
        winter: ['Light cotton clothes', 'Light jacket for evenings'],
        summer: ['Light cotton clothes', 'Sunscreen', 'Hat'],
        monsoon: ['Waterproof clothes', 'Umbrella', 'Quick-dry clothing']
      }
    }
  },
  'Manali': {
    name: 'Manali',
    airportCode: 'KUU',
    airportName: 'Kullu Manali Airport (Bhuntar)',
    coordinates: { lat: 32.2432, lng: 77.1892 },
    timezone: 'Asia/Kolkata',
    realHotels: [
      {
        name: 'The Himalayan',
        category: 'luxury',
        location: 'Hadimba Road',
        address: 'Hadimba Road, Manali, Himachal Pradesh 175131',
        rating: 4.3,
        amenities: ['Mountain Views', 'Spa', 'Restaurant', 'Room Service', 'Travel Desk'],
        priceRange: { min: 8000, max: 18000 },
        coordinates: { lat: 32.2396, lng: 77.1887 }
      },
      {
        name: 'Hotel Snow Valley Resorts',
        category: 'mid_range',
        location: 'Log Huts Area',
        address: 'Log Huts Area, Manali, Himachal Pradesh 175131',
        rating: 4.0,
        amenities: ['Mountain Views', 'Restaurant', 'Room Service', 'Parking'],
        priceRange: { min: 3000, max: 7000 },
        coordinates: { lat: 32.2463, lng: 77.1734 }
      },
      {
        name: 'Zostel Manali',
        category: 'budget',
        location: 'Old Manali',
        address: 'Old Manali Road, Manali, Himachal Pradesh 175131',
        rating: 4.4,
        amenities: ['Common Kitchen', 'Cafe', 'WiFi', 'Mountain Views', 'Bonfire'],
        priceRange: { min: 600, max: 2000 },
        coordinates: { lat: 32.2548, lng: 77.1734 }
      }
    ],
    realActivities: [
      {
        name: 'Rohtang Pass Excursion',
        category: 'adventure',
        duration: '8-10 hours',
        location: 'Rohtang Pass',
        address: 'Rohtang Pass, Himachal Pradesh (51 km from Manali)',
        description: 'Snow-capped mountain pass with adventure activities',
        priceRange: { min: 2000, max: 4000 },
        timings: '6:00 AM - 6:00 PM',
        bestTimeToVisit: 'May to October',
        difficulty: 'moderate',
        coordinates: { lat: 32.3720, lng: 77.2479 }
      },
      {
        name: 'Hadimba Temple Visit',
        category: 'cultural',
        duration: '1-2 hours',
        location: 'Hadimba Road',
        address: 'Hadimba Devi Temple, Manali, Himachal Pradesh',
        description: 'Ancient wooden temple dedicated to Hadimba Devi',
        priceRange: { min: 0, max: 100 },
        timings: '6:00 AM - 8:00 PM',
        bestTimeToVisit: 'Early morning or evening',
        difficulty: 'easy',
        coordinates: { lat: 32.2396, lng: 77.1887 }
      },
      {
        name: 'Solang Valley Adventure',
        category: 'adventure',
        duration: '6-8 hours',
        location: 'Solang Valley',
        address: 'Solang Valley, Manali, Himachal Pradesh',
        description: 'Paragliding, zorbing, and skiing activities',
        priceRange: { min: 1500, max: 5000 },
        timings: '9:00 AM - 6:00 PM',
        bestTimeToVisit: 'October to March',
        difficulty: 'moderate',
        coordinates: { lat: 32.3069, lng: 77.1633 }
      }
    ],
    realRestaurants: [
      {
        name: 'Johnson\'s Cafe',
        cuisine: 'Multi-cuisine',
        category: 'casual',
        location: 'Circuit House Road',
        priceRange: { min: 500, max: 1500 },
        specialties: ['Trout Fish', 'Apple Pie', 'Israeli Cuisine'],
        timings: '8:00 AM - 11:00 PM',
        coordinates: { lat: 32.2463, lng: 77.1734 }
      },
      {
        name: 'Cafe 1947',
        cuisine: 'Continental',
        category: 'casual',
        location: 'Old Manali',
        priceRange: { min: 400, max: 1200 },
        specialties: ['Wood Fired Pizza', 'Pasta', 'Mountain Views'],
        timings: '10:00 AM - 11:00 PM',
        coordinates: { lat: 32.2548, lng: 77.1734 }
      },
      {
        name: 'Chopsticks Restaurant',
        cuisine: 'Tibetan/Chinese',
        category: 'casual',
        location: 'Mall Road',
        priceRange: { min: 300, max: 800 },
        specialties: ['Momos', 'Thukpa', 'Chow Mein'],
        timings: '11:00 AM - 10:00 PM',
        coordinates: { lat: 32.2431, lng: 77.1892 }
      }
    ],
    transportation: {
      fromDelhi: {
        flight: {
          duration: '1h 30m',
          distance: '537 km',
          airlines: ['Alliance Air', 'IndiGo (seasonal)'],
          frequency: '1-2 flights daily (seasonal)'
        },
        train: {
          duration: '12-14 hours to Chandigarh + 8 hours by road',
          distance: '570 km',
          trains: ['Shatabdi Express to Chandigarh'],
          frequency: '1-2 trains daily'
        },
        road: {
          duration: '12-14 hours',
          distance: '570 km',
          routes: ['NH1 to Chandigarh, then NH3 to Manali']
        }
      },
      localTransport: ['Taxi', 'Local Bus', 'Motorcycle', 'Bicycle'],
      averageCosts: {
        flight: { min: 6000, max: 15000 },
        train: { min: 800, max: 2500 },
        taxi: { min: 400, max: 1000 },
        local: { min: 50, max: 300 }
      }
    },
    weather: {
      bestMonths: ['March', 'April', 'May', 'September', 'October', 'November'],
      temperature: {
        winter: { min: -2, max: 15 },
        summer: { min: 15, max: 25 },
        monsoon: { min: 12, max: 20 }
      },
      rainfall: 'Moderate during July-September',
      clothing: {
        winter: ['Heavy woolens', 'Thermal wear', 'Winter jacket', 'Gloves'],
        summer: ['Light woolens', 'Light jacket', 'Cotton clothes'],
        monsoon: ['Waterproof jacket', 'Umbrella', 'Warm clothes']
      }
    }
  }
  // Add more destinations as needed
}

export function getDestinationInfo(destination: string): DestinationInfo | null {
  return destinationDatabase[destination] || null
}

export function getAirportInfo(destination: string): { code: string; name: string; coordinates: { lat: number; lng: number } } | null {
  const info = getDestinationInfo(destination)
  if (!info) return null
  
  return {
    code: info.airportCode,
    name: info.airportName,
    coordinates: info.coordinates
  }
}

export function getRealHotels(destination: string, category?: 'budget' | 'mid_range' | 'luxury'): HotelInfo[] {
  const info = getDestinationInfo(destination)
  if (!info) return []
  
  if (category) {
    return info.realHotels.filter(hotel => hotel.category === category)
  }
  
  return info.realHotels
}

export function getRealActivities(destination: string, category?: string): ActivityInfo[] {
  const info = getDestinationInfo(destination)
  if (!info) return []
  
  if (category) {
    return info.realActivities.filter(activity => activity.category === category)
  }
  
  return info.realActivities
}

export function getRealRestaurants(destination: string, type?: 'breakfast' | 'lunch' | 'dinner'): RestaurantInfo[] {
  const info = getDestinationInfo(destination)
  if (!info) return []
  
  // For now, return all restaurants - can be filtered by type later
  return info.realRestaurants
}

export function getTransportationInfo(destination: string): TransportationInfo | null {
  const info = getDestinationInfo(destination)
  return info?.transportation || null
}

export function getWeatherInfo(destination: string): WeatherPatterns | null {
  const info = getDestinationInfo(destination)
  return info?.weather || null
}
