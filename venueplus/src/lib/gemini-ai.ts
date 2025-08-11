import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with provided API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBcTnpoAlQ7kz6CZh7ONr9nSLwYhn4yGi8');

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface AITravelRequest {
  destination: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  travelers: string;
  rooms: { adults: number; children: number }[];
  fromCity: string;
  selectedCities: string[];
  budget?: string;
  interests?: string[];
  travelStyle?: string;
  accommodation?: string;
  transportation?: string;
}

export interface TravelPackage {
  id: string;
  name: string;
  provider: string;
  price: number;
  currency: string;
  duration: string;
  includes: string[];
  highlights: string[];
  rating: number;
  reviews: number;
  bookingUrl: string;
  imageUrl: string;
  description: string;
}

export interface IndividualBookingOption {
  type: 'flight' | 'hotel' | 'activity' | 'transport' | 'restaurant';
  name: string;
  provider: string;
  price: number;
  currency: string;
  rating: number;
  description: string;
  bookingUrl: string;
  imageUrl?: string;
  availability: boolean;
  features: string[];
}

export interface SmartItinerary {
  id: string;
  overview: string;
  totalCost: number;
  currency: string;
  days: ItineraryDay[];
  packages: TravelPackage[];
  individualBookings: {
    flights: IndividualBookingOption[];
    hotels: IndividualBookingOption[];
    activities: IndividualBookingOption[];
    restaurants: IndividualBookingOption[];
    transport: IndividualBookingOption[];
  };
  recommendations: {
    bestPackage?: TravelPackage;
    alternativeOptions: string[];
    moneySavingTips: string[];
    localInsights: string[];
  };
}

export interface ItineraryDay {
  day: number;
  date: string;
  city: string;
  theme: string;
  activities: DayActivity[];
  meals: DayMeal[];
  transport: DayTransport[];
  accommodation: DayAccommodation;
  estimatedCost: number;
  tips: string[];
}

export interface DayActivity {
  time: string;
  title: string;
  description: string;
  duration: string;
  cost: number;
  location: string;
  bookingOptions: IndividualBookingOption[];
  category: string;
}

export interface DayMeal {
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  cost: number;
  location: string;
  bookingUrl?: string;
  rating?: number;
}

export interface DayTransport {
  from: string;
  to: string;
  mode: string;
  duration: string;
  cost: number;
  bookingOptions: IndividualBookingOption[];
}

export interface DayAccommodation {
  name: string;
  type: string;
  location: string;
  rating: number;
  amenities: string[];
  pricePerNight: number;
  bookingOptions: IndividualBookingOption[];
}

class GeminiTravelAgent {
  private model = model;

  async generateSmartItinerary(request: AITravelRequest): Promise<SmartItinerary> {
    try {
      // Create comprehensive prompt for Gemini
      const prompt = this.createItineraryPrompt(request);
      
      // Get AI response
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Parse AI response and enhance with real data
      const aiItinerary = this.parseAIResponse(text);
      
      // Fetch real packages and booking options
      const enhancedItinerary = await this.enhanceWithRealData(aiItinerary, request);
      
      return enhancedItinerary;
    } catch (error) {
      console.error('Error generating smart itinerary:', error);
      throw new Error('Failed to generate intelligent itinerary');
    }
  }

  private createItineraryPrompt(request: AITravelRequest): string {
    return `
You are an expert travel agent AI. Create a comprehensive, personalized travel itinerary based on the following requirements:

TRAVEL DETAILS:
- Destination: ${request.destination}
- Duration: ${request.duration}
- Start Date: ${request.startDate.toDateString()}
- Travelers: ${request.travelers}
- Departure City: ${request.fromCity}
- Cities to Visit: ${request.selectedCities.join(', ')}
- Room Configuration: ${JSON.stringify(request.rooms)}

PREFERENCES:
- Budget: ${request.budget || 'Not specified'}
- Interests: ${request.interests?.join(', ') || 'General sightseeing'}
- Travel Style: ${request.travelStyle || 'Balanced'}
- Accommodation: ${request.accommodation || 'Mid-range'}
- Transportation: ${request.transportation || 'Mixed'}

REQUIREMENTS:
1. Create a detailed day-by-day itinerary
2. Include specific activities, restaurants, and attractions
3. Provide realistic cost estimates in USD
4. Suggest the best times to visit each place
5. Include transportation between locations
6. Recommend accommodations for each city
7. Add local tips and cultural insights
8. Consider weather and seasonal factors
9. Balance popular attractions with hidden gems
10. Optimize travel routes and timing

FORMAT YOUR RESPONSE AS A JSON OBJECT with the following structure:
{
  "overview": "Brief description of the itinerary",
  "totalCost": estimated_total_cost_number,
  "currency": "USD",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "city": "City Name",
      "theme": "Day theme (e.g., Cultural Exploration)",
      "activities": [
        {
          "time": "09:00",
          "title": "Activity Name",
          "description": "Detailed description",
          "duration": "2 hours",
          "cost": 25,
          "location": "Specific address or area",
          "category": "sightseeing/culture/adventure/food"
        }
      ],
      "meals": [
        {
          "time": "12:00",
          "type": "lunch",
          "restaurant": "Restaurant Name",
          "cuisine": "Cuisine Type",
          "cost": 15,
          "location": "Restaurant location",
          "rating": 4.5
        }
      ],
      "transport": [
        {
          "from": "Location A",
          "to": "Location B", 
          "mode": "taxi/metro/bus/walk",
          "duration": "30 minutes",
          "cost": 10
        }
      ],
      "accommodation": {
        "name": "Hotel/Accommodation Name",
        "type": "Hotel/Hostel/Apartment",
        "location": "Area/District",
        "rating": 4.0,
        "amenities": ["WiFi", "Pool", "Gym"],
        "pricePerNight": 80
      },
      "estimatedCost": 150,
      "tips": ["Local tip 1", "Local tip 2"]
    }
  ],
  "recommendations": {
    "alternativeOptions": ["Alternative suggestion 1", "Alternative suggestion 2"],
    "moneySavingTips": ["Save money tip 1", "Save money tip 2"],
    "localInsights": ["Local insight 1", "Local insight 2"]
  }
}

Make the itinerary detailed, practical, and personalized. Include real place names, specific recommendations, and actionable advice.
`;
  }

  private parseAIResponse(text: string): Partial<SmartItinerary> {
    try {
      // Extract JSON from AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return fallback structure
      return {
        overview: "Custom travel itinerary generated by AI",
        totalCost: 1000,
        currency: "USD",
        days: [],
        recommendations: {
          alternativeOptions: [],
          moneySavingTips: [],
          localInsights: []
        }
      };
    }
  }

  private async enhanceWithRealData(aiItinerary: Partial<SmartItinerary>, request: AITravelRequest): Promise<SmartItinerary> {
    // Fetch real travel packages
    const packages = await this.fetchTravelPackages(request);
    
    // Fetch individual booking options
    const individualBookings = await this.fetchIndividualBookings(aiItinerary, request);
    
    // Determine best package
    const bestPackage = packages.length > 0 ? packages[0] : undefined;
    
    return {
      id: `itinerary_${Date.now()}`,
      overview: aiItinerary.overview || "AI-generated travel itinerary",
      totalCost: aiItinerary.totalCost || 1000,
      currency: aiItinerary.currency || "USD",
      days: aiItinerary.days || [],
      packages,
      individualBookings,
      recommendations: {
        bestPackage,
        alternativeOptions: aiItinerary.recommendations?.alternativeOptions || [],
        moneySavingTips: aiItinerary.recommendations?.moneySavingTips || [],
        localInsights: aiItinerary.recommendations?.localInsights || []
      }
    };
  }

  private async fetchTravelPackages(request: AITravelRequest): Promise<TravelPackage[]> {
    // This would integrate with real travel APIs
    // For now, return mock data that would be replaced with real API calls
    return [
      {
        id: 'package_1',
        name: `${request.destination} Complete Package`,
        provider: 'TravelPro',
        price: 1299,
        currency: 'USD',
        duration: request.duration,
        includes: ['Flights', 'Hotels', 'Breakfast', 'Airport Transfers'],
        highlights: ['City Tours', 'Local Guide', 'Cultural Experiences'],
        rating: 4.5,
        reviews: 1247,
        bookingUrl: 'https://example.com/book',
        imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
        description: `Complete travel package for ${request.destination} including all essentials for a memorable trip.`
      }
    ];
  }

  private async fetchIndividualBookings(aiItinerary: Partial<SmartItinerary>, request: AITravelRequest): Promise<SmartItinerary['individualBookings']> {
    // This would integrate with multiple booking APIs
    return {
      flights: await this.fetchFlights(request),
      hotels: await this.fetchHotels(request),
      activities: await this.fetchActivities(request),
      restaurants: await this.fetchRestaurants(request),
      transport: await this.fetchTransport(request)
    };
  }

  private async fetchFlights(request: AITravelRequest): Promise<IndividualBookingOption[]> {
    // Integration with flight APIs (Amadeus, Skyscanner, etc.)
    return [
      {
        type: 'flight',
        name: `${request.fromCity} to ${request.destination}`,
        provider: 'Airlines Direct',
        price: 450,
        currency: 'USD',
        rating: 4.2,
        description: 'Round-trip flight with good timing',
        bookingUrl: 'https://flights.example.com',
        availability: true,
        features: ['Carry-on included', 'Seat selection', 'Meals']
      }
    ];
  }

  private async fetchHotels(request: AITravelRequest): Promise<IndividualBookingOption[]> {
    // Integration with hotel APIs (Booking.com, Expedia, etc.)
    return [
      {
        type: 'hotel',
        name: 'Grand City Hotel',
        provider: 'Booking.com',
        price: 120,
        currency: 'USD',
        rating: 4.3,
        description: 'Centrally located 4-star hotel',
        bookingUrl: 'https://booking.example.com',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        availability: true,
        features: ['Free WiFi', 'Breakfast included', 'Gym', 'Pool']
      }
    ];
  }

  private async fetchActivities(request: AITravelRequest): Promise<IndividualBookingOption[]> {
    // Integration with activity APIs (GetYourGuide, Viator, etc.)
    return [
      {
        type: 'activity',
        name: 'City Walking Tour',
        provider: 'GetYourGuide',
        price: 35,
        currency: 'USD',
        rating: 4.7,
        description: '3-hour guided walking tour of historic city center',
        bookingUrl: 'https://activities.example.com',
        availability: true,
        features: ['Professional guide', 'Small groups', 'Photo stops']
      }
    ];
  }

  private async fetchRestaurants(request: AITravelRequest): Promise<IndividualBookingOption[]> {
    // Integration with restaurant APIs (OpenTable, Resy, etc.)
    return [
      {
        type: 'restaurant',
        name: 'Local Cuisine Restaurant',
        provider: 'OpenTable',
        price: 45,
        currency: 'USD',
        rating: 4.4,
        description: 'Authentic local cuisine in the heart of the city',
        bookingUrl: 'https://restaurants.example.com',
        availability: true,
        features: ['Reservation required', 'Local specialties', 'Wine pairing']
      }
    ];
  }

  private async fetchTransport(request: AITravelRequest): Promise<IndividualBookingOption[]> {
    // Integration with transport APIs (Uber, local transport, etc.)
    return [
      {
        type: 'transport',
        name: 'Airport Transfer',
        provider: 'Local Transfers',
        price: 25,
        currency: 'USD',
        rating: 4.1,
        description: 'Private transfer from airport to hotel',
        bookingUrl: 'https://transport.example.com',
        availability: true,
        features: ['Door-to-door', 'Professional driver', 'Flight tracking']
      }
    ];
  }

  async searchAndRecommend(query: string, preferences: any): Promise<any> {
    const prompt = `
    As a travel AI agent, search and recommend options for: "${query}"
    
    User preferences: ${JSON.stringify(preferences)}
    
    Provide intelligent recommendations with:
    1. Multiple options with different price points
    2. Pros and cons of each option
    3. Best value recommendations
    4. Alternative suggestions
    5. Money-saving tips
    
    Format as JSON with structured recommendations.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('Error in search and recommend:', error);
      return { recommendations: [] };
    }
  }
}

export const geminiTravelAgent = new GeminiTravelAgent();
