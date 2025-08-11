import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with provided API key
const genAI = new GoogleGenerativeAI('AIzaSyBcTnpoAlQ7kz6CZh7ONr9nSLwYhn4yGi8');

// Use Gemini 1.5 Pro - the most stable and widely available model
const model = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 4096,
  }
});

export interface EnhancedTripData {
  destination: string;
  duration: string;
  startDate: Date;
  travelers: string;
  fromCity: string;
  selectedCities: string[];
  budget: {
    total: number;
    breakdown: {
      accommodation: number;
      transportation: number;
      food: number;
      activities: number;
      shopping: number;
    };
  };
  preferences?: {
    interests: string[];
    travelStyle: 'budget' | 'balanced' | 'luxury';
    accommodation: string;
    transportation: string;
  };
}

export interface DetailedItinerary {
  id: string;
  title: string;
  description: string;
  overview: string;
  totalCost: number;
  currency: string;
  days: DetailedDay[];
  budgetBreakdown: BudgetBreakdown;
  recommendations: TravelRecommendations;
  images: ItineraryImages;
  localInsights: LocalInsights;
  emergencyInfo: EmergencyInfo;
  packingList: PackingItem[];
  weatherInfo: WeatherInfo[];
}

export interface DetailedDay {
  day: number;
  date: string;
  city: string;
  theme: string;
  weather: DayWeather;
  activities: DetailedActivity[];
  meals: DetailedMeal[];
  transport: DetailedTransport[];
  accommodation: DetailedAccommodation;
  estimatedCost: number;
  tips: string[];
  culturalNotes: string[];
  photos: string[];
  mapCoordinates: { lat: number; lng: number; }[];
}

export interface DetailedActivity {
  time: string;
  title: string;
  description: string;
  duration: string;
  cost: number;
  costBreakdown: { item: string; cost: number; }[];
  location: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  category: string;
  difficulty: string;
  ageRecommendation: string;
  bookingInfo: BookingInfo;
  alternatives: string[];
  photos: string[];
  reviews: { rating: number; comment: string; }[];
  tips: string[];
  culturalSignificance: string;
}

export interface DetailedMeal {
  time: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  restaurant: string;
  cuisine: string;
  cost: number;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  bookingInfo: BookingInfo;
  rating: number;
  specialties: string[];
  dietaryOptions: string[];
  ambiance: string;
  photos: string[];
  reviews: { rating: number; comment: string; }[];
}

export interface DetailedTransport {
  from: string;
  to: string;
  mode: string;
  provider: string;
  duration: string;
  cost: number;
  bookingInfo: BookingInfo;
  alternatives: TransportAlternative[];
  tips: string[];
  comfort: string;
  accessibility: string[];
}

export interface DetailedAccommodation {
  name: string;
  type: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number; };
  rating: number;
  amenities: string[];
  pricePerNight: number;
  totalCost: number;
  bookingInfo: BookingInfo;
  photos: string[];
  reviews: { rating: number; comment: string; }[];
  neighborhood: string;
  accessibility: string[];
  policies: string[];
}

export interface BookingInfo {
  url?: string;
  phone?: string;
  email?: string;
  provider: string;
  advanceBooking: boolean;
  cancellationPolicy: string;
  paymentMethods: string[];
}

export interface TransportAlternative {
  mode: string;
  duration: string;
  cost: number;
  pros: string[];
  cons: string[];
}

export interface BudgetBreakdown {
  total: number;
  categories: {
    accommodation: CategoryBreakdown;
    transportation: CategoryBreakdown;
    food: CategoryBreakdown;
    activities: CategoryBreakdown;
    shopping: CategoryBreakdown;
    miscellaneous: CategoryBreakdown;
  };
  dailyCosts: { day: number; cost: number; breakdown: any; }[];
  savingTips: string[];
  costOptimizations: string[];
}

export interface CategoryBreakdown {
  budgeted: number;
  estimated: number;
  items: { name: string; cost: number; day: number; }[];
  percentage: number;
  notes: string[];
}

export interface TravelRecommendations {
  bestTimeToVisit: string;
  seasonalHighlights: string[];
  localEvents: LocalEvent[];
  hiddenGems: HiddenGem[];
  foodRecommendations: FoodRecommendation[];
  shoppingRecommendations: ShoppingRecommendation[];
  safetyTips: string[];
  culturalEtiquette: string[];
  languageTips: LanguageTip[];
  currencyInfo: CurrencyInfo;
  tippingGuide: TippingGuide;
}

export interface LocalEvent {
  name: string;
  date: string;
  description: string;
  location: string;
  cost: number;
  bookingRequired: boolean;
}

export interface HiddenGem {
  name: string;
  description: string;
  location: string;
  cost: number;
  bestTimeToVisit: string;
  difficulty: string;
  photos: string[];
}

export interface FoodRecommendation {
  dish: string;
  description: string;
  whereToFind: string[];
  averageCost: number;
  dietary: string[];
}

export interface ShoppingRecommendation {
  item: string;
  description: string;
  whereToFind: string[];
  priceRange: string;
  bargaining: boolean;
}

export interface LanguageTip {
  phrase: string;
  pronunciation: string;
  meaning: string;
  whenToUse: string;
}

export interface CurrencyInfo {
  currency: string;
  exchangeRate: number;
  whereToExchange: string[];
  paymentMethods: string[];
  tipping: boolean;
}

export interface TippingGuide {
  restaurants: string;
  taxis: string;
  hotels: string;
  activities: string;
  general: string;
}

export interface ItineraryImages {
  coverImage: string;
  destinationImages: string[];
  activityImages: { activity: string; images: string[]; }[];
  foodImages: { dish: string; images: string[]; }[];
  accommodationImages: string[];
  mapImages: string[];
}

export interface LocalInsights {
  history: string;
  culture: string;
  traditions: string[];
  festivals: string[];
  customs: string[];
  donts: string[];
  localSecrets: string[];
  bestPhotoSpots: PhotoSpot[];
}

export interface PhotoSpot {
  name: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number; };
  bestTime: string;
  tips: string[];
}

export interface EmergencyInfo {
  emergencyNumbers: { service: string; number: string; }[];
  hospitals: { name: string; address: string; phone: string; }[];
  embassies: { country: string; address: string; phone: string; }[];
  police: { station: string; address: string; phone: string; }[];
  tourist_helpline: string;
  insurance_contacts: string[];
}

export interface PackingItem {
  item: string;
  category: string;
  essential: boolean;
  seasonal: boolean;
  notes: string;
}

export interface WeatherInfo {
  day: number;
  date: string;
  temperature: { min: number; max: number; };
  condition: string;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  uvIndex: number;
  clothingRecommendation: string[];
}

export interface DayWeather {
  temperature: { min: number; max: number; };
  condition: string;
  precipitation: number;
  clothingRecommendation: string[];
}

class AgenticItineraryGenerator {
  private model = model;

  async generateDetailedItinerary(tripData: EnhancedTripData): Promise<DetailedItinerary> {
    try {
      console.log('🚀 Starting agentic itinerary generation...');
      
      // Step 1: Generate comprehensive itinerary
      const itinerary = await this.generateComprehensiveItinerary(tripData);
      
      // Step 2: Enhance with real-time data
      const enhancedItinerary = await this.enhanceWithRealTimeData(itinerary, tripData);
      
      // Step 3: Generate images and visualizations
      const visualizedItinerary = await this.addVisualizations(enhancedItinerary, tripData);
      
      // Step 4: Add local insights and cultural information
      const culturallyEnhancedItinerary = await this.addCulturalInsights(visualizedItinerary, tripData);
      
      console.log('✅ Agentic itinerary generation completed!');
      return culturallyEnhancedItinerary;
      
    } catch (error) {
      console.error('❌ Error generating detailed itinerary:', error);
      throw new Error('Failed to generate agentic itinerary');
    }
  }

  private async generateComprehensiveItinerary(tripData: EnhancedTripData): Promise<DetailedItinerary> {
    const prompt = this.createDetailedPrompt(tripData);
    
    console.log('🤖 Generating comprehensive itinerary with Gemini 1.5 Pro...');
    
    // Retry logic with exponential backoff for quota errors
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        
        console.log('📝 Parsing AI response...');
        return this.parseDetailedResponse(response, tripData);
        
      } catch (error: any) {
        console.log(`Attempt ${attempt} failed:`, error.message);
        
        // Check if it's a quota error
        if (error.message?.includes('quota') || error.message?.includes('429')) {
          if (attempt < 3) {
            const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
            console.log(`🔄 Quota limit hit. Retrying in ${delay/1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            throw new Error('Gemini API quota exceeded. Please wait a few minutes and try again. Consider upgrading to a paid plan for higher limits.');
          }
        }
        
        // For other errors, throw immediately
        throw error;
      }
    }
    
    throw new Error('Failed to generate itinerary after 3 attempts');
  }

  private createDetailedPrompt(tripData: EnhancedTripData): string {
    const { destination, duration, startDate, travelers, fromCity, selectedCities, budget, preferences } = tripData;
    
    return `
You are the world's most experienced luxury travel consultant with 20+ years of expertise in ${destination}. You have insider connections, local partnerships, and exclusive access to premium experiences. Create a PRODUCTION-LEVEL, comprehensive itinerary that rivals professional travel agencies. Use real locations, accurate pricing, and authentic local insights.

TRIP DETAILS:
- Destination: ${destination}
- Duration: ${duration}
- Start Date: ${startDate.toDateString()}
- Travelers: ${travelers}
- Departure City: ${fromCity}
- Cities to Visit: ${selectedCities.join(', ')}
- Total Budget: ₹${budget.total}
- Budget Breakdown: ${JSON.stringify(budget.breakdown)}
- Travel Style: ${preferences?.travelStyle || 'balanced'}
- Interests: ${preferences?.interests?.join(', ') || 'general sightseeing'}

GENERATE A PRODUCTION-LEVEL COMPREHENSIVE ITINERARY INCLUDING:

1. **EXECUTIVE DAY-BY-DAY PLANNING**: Hour-by-hour schedule with GPS coordinates, specific timings, and seamless transitions
2. **PREMIUM CULTURAL IMMERSION**: Authentic local experiences, insider access, traditional ceremonies, and cultural workshops
3. **EXCLUSIVE HIDDEN GEMS**: Secret locations known only to locals, off-limit areas, private venues, and unique experiences
4. **CULINARY EXCELLENCE**: Michelin-starred restaurants, street food gems, cooking classes, wine tastings, and local specialties
5. **LUXURY ACCOMMODATION**: Premium hotels, boutique properties, unique stays with full amenities and services
6. **PREMIUM TRANSPORTATION**: Optimized routes, private transfers, luxury vehicles, and first-class travel options
7. **CURATED ACTIVITIES**: VIP access, skip-the-line tickets, private tours, exclusive experiences, and alternative options
8. **DETAILED FINANCIAL PLANNING**: Precise cost breakdowns, payment methods, currency exchange, and budget optimization
9. **CULTURAL INTELLIGENCE**: Local etiquette, language essentials, cultural sensitivities, and social customs
10. **COMPREHENSIVE LOGISTICS**: Emergency protocols, health requirements, packing essentials, weather forecasts, and travel insurance
11. **PROFESSIONAL PHOTOGRAPHY**: Prime photo locations, golden hour timing, Instagram-worthy spots, and equipment recommendations
12. **SECURITY & WELLNESS**: Health protocols, safety measures, emergency contacts, medical facilities, and risk assessments
13. **REAL-TIME ADAPTABILITY**: Weather contingencies, seasonal variations, local events, and flexible alternatives
14. **SUSTAINABLE TRAVEL**: Eco-friendly options, responsible tourism, local community support, and environmental consciousness

FORMAT AS DETAILED JSON:
{
  "title": "Comprehensive ${destination} Adventure",
  "description": "AI-crafted personalized itinerary",
  "overview": "Detailed overview of the entire trip",
  "totalCost": estimated_total_cost,
  "currency": "INR",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "city": "City Name",
      "theme": "Day Theme (e.g., Cultural Immersion)",
      "weather": {
        "temperature": {"min": 20, "max": 30},
        "condition": "sunny/cloudy/rainy",
        "precipitation": 10,
        "clothingRecommendation": ["light clothing", "umbrella"]
      },
      "activities": [
        {
          "time": "09:00",
          "title": "Specific Activity Name",
          "description": "Detailed 3-4 sentence description",
          "duration": "2 hours",
          "cost": 1500,
          "costBreakdown": [
            {"item": "entrance fee", "cost": 800},
            {"item": "guide", "cost": 700}
          ],
          "location": "Specific Location Name",
          "address": "Complete address",
          "coordinates": {"lat": 28.6139, "lng": 77.2090},
          "category": "culture/adventure/sightseeing/food",
          "difficulty": "easy/moderate/challenging",
          "ageRecommendation": "all ages/adults only/families",
          "bookingInfo": {
            "url": "booking website",
            "phone": "contact number",
            "provider": "booking platform",
            "advanceBooking": true,
            "cancellationPolicy": "24 hours",
            "paymentMethods": ["card", "cash", "upi"]
          },
          "alternatives": ["Alternative option 1", "Alternative option 2"],
          "photos": ["photo_description_1", "photo_description_2"],
          "reviews": [
            {"rating": 4.5, "comment": "Amazing experience"},
            {"rating": 4.2, "comment": "Worth the visit"}
          ],
          "tips": ["Practical tip 1", "Practical tip 2"],
          "culturalSignificance": "Historical/cultural importance"
        }
      ],
      "meals": [
        {
          "time": "12:30",
          "type": "lunch",
          "restaurant": "Specific Restaurant Name",
          "cuisine": "Cuisine Type",
          "cost": 800,
          "location": "Restaurant Location",
          "address": "Complete address",
          "coordinates": {"lat": 28.6139, "lng": 77.2090},
          "bookingInfo": {
            "url": "reservation link",
            "phone": "restaurant phone",
            "provider": "booking platform",
            "advanceBooking": false,
            "cancellationPolicy": "no penalty",
            "paymentMethods": ["card", "cash"]
          },
          "rating": 4.3,
          "specialties": ["signature dish 1", "signature dish 2"],
          "dietaryOptions": ["vegetarian", "vegan", "gluten-free"],
          "ambiance": "casual/fine dining/street food",
          "photos": ["food_photo_1", "restaurant_photo_1"],
          "reviews": [
            {"rating": 4.5, "comment": "Excellent local cuisine"}
          ]
        }
      ],
      "transport": [
        {
          "from": "Hotel",
          "to": "First Attraction",
          "mode": "auto-rickshaw/taxi/metro/bus",
          "provider": "Uber/Ola/Local",
          "duration": "25 minutes",
          "cost": 150,
          "bookingInfo": {
            "url": "app download link",
            "provider": "transport company",
            "advanceBooking": false,
            "cancellationPolicy": "free cancellation",
            "paymentMethods": ["card", "cash", "wallet"]
          },
          "alternatives": [
            {
              "mode": "metro",
              "duration": "35 minutes",
              "cost": 50,
              "pros": ["cheaper", "no traffic"],
              "cons": ["crowded", "walking required"]
            }
          ],
          "tips": ["Traffic tip", "Payment tip"],
          "comfort": "standard/premium/luxury",
          "accessibility": ["wheelchair accessible", "child friendly"]
        }
      ],
      "accommodation": {
        "name": "Specific Hotel Name",
        "type": "Hotel/Guesthouse/Hostel/Apartment",
        "location": "Area/Neighborhood",
        "address": "Complete address",
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
        "rating": 4.2,
        "amenities": ["Free WiFi", "Pool", "Gym", "Spa", "Restaurant"],
        "pricePerNight": 3500,
        "totalCost": 10500,
        "bookingInfo": {
          "url": "booking link",
          "phone": "hotel phone",
          "provider": "booking platform",
          "advanceBooking": true,
          "cancellationPolicy": "free until 24h",
          "paymentMethods": ["card", "cash", "bank transfer"]
        },
        "photos": ["hotel_exterior", "room_interior", "amenities"],
        "reviews": [
          {"rating": 4.5, "comment": "Great location and service"}
        ],
        "neighborhood": "Detailed neighborhood description",
        "accessibility": ["elevator", "wheelchair access"],
        "policies": ["check-in 3pm", "check-out 11am", "no smoking"]
      },
      "estimatedCost": 5000,
      "tips": ["Local tip 1", "Local tip 2", "Cultural tip 1"],
      "culturalNotes": ["Cultural observation 1", "Local custom 1"],
      "photos": ["best_photo_spot_1", "instagram_worthy_location"],
      "mapCoordinates": [
        {"lat": 28.6139, "lng": 77.2090},
        {"lat": 28.6129, "lng": 77.2295}
      ]
    }
  ],
  "budgetBreakdown": {
    "total": ${budget.total},
    "categories": {
      "accommodation": {
        "budgeted": ${(budget.total * budget.breakdown.accommodation) / 100},
        "estimated": calculated_amount,
        "items": [
          {"name": "Hotel Night 1", "cost": 3500, "day": 1}
        ],
        "percentage": ${budget.breakdown.accommodation},
        "notes": ["Budget notes"]
      },
      "transportation": {
        "budgeted": ${(budget.total * budget.breakdown.transportation) / 100},
        "estimated": calculated_amount,
        "items": [
          {"name": "Flight tickets", "cost": 15000, "day": 0}
        ],
        "percentage": ${budget.breakdown.transportation},
        "notes": ["Transport notes"]
      },
      "food": {
        "budgeted": ${(budget.total * budget.breakdown.food) / 100},
        "estimated": calculated_amount,
        "items": [
          {"name": "Lunch Day 1", "cost": 800, "day": 1}
        ],
        "percentage": ${budget.breakdown.food},
        "notes": ["Food notes"]
      },
      "activities": {
        "budgeted": ${(budget.total * budget.breakdown.activities) / 100},
        "estimated": calculated_amount,
        "items": [
          {"name": "Museum entry", "cost": 500, "day": 1}
        ],
        "percentage": ${budget.breakdown.activities},
        "notes": ["Activity notes"]
      },
      "shopping": {
        "budgeted": ${(budget.total * budget.breakdown.shopping) / 100},
        "estimated": calculated_amount,
        "items": [
          {"name": "Souvenirs", "cost": 2000, "day": 2}
        ],
        "percentage": ${budget.breakdown.shopping},
        "notes": ["Shopping notes"]
      },
      "miscellaneous": {
        "budgeted": 2000,
        "estimated": 2500,
        "items": [
          {"name": "Tips and extras", "cost": 500, "day": 1}
        ],
        "percentage": 5,
        "notes": ["Misc expenses"]
      }
    },
    "dailyCosts": [
      {"day": 1, "cost": 5000, "breakdown": {"accommodation": 3500, "food": 1000, "transport": 500}}
    ],
    "savingTips": ["Money saving tip 1", "Money saving tip 2"],
    "costOptimizations": ["Cost optimization 1", "Cost optimization 2"]
  },
  "recommendations": {
    "bestTimeToVisit": "Detailed best time explanation",
    "seasonalHighlights": ["Seasonal highlight 1", "Seasonal highlight 2"],
    "localEvents": [
      {
        "name": "Local Festival",
        "date": "2024-03-15",
        "description": "Festival description",
        "location": "Event location",
        "cost": 0,
        "bookingRequired": false
      }
    ],
    "hiddenGems": [
      {
        "name": "Hidden Location",
        "description": "Detailed description",
        "location": "Specific location",
        "cost": 0,
        "bestTimeToVisit": "early morning",
        "difficulty": "easy",
        "photos": ["hidden_gem_photo_1"]
      }
    ],
    "foodRecommendations": [
      {
        "dish": "Local Dish Name",
        "description": "Dish description",
        "whereToFind": ["Restaurant 1", "Street vendor area"],
        "averageCost": 200,
        "dietary": ["vegetarian", "spicy"]
      }
    ],
    "shoppingRecommendations": [
      {
        "item": "Local Handicraft",
        "description": "Item description",
        "whereToFind": ["Market 1", "Shop area"],
        "priceRange": "₹500-2000",
        "bargaining": true
      }
    ],
    "safetyTips": ["Safety tip 1", "Safety tip 2"],
    "culturalEtiquette": ["Etiquette rule 1", "Etiquette rule 2"],
    "languageTips": [
      {
        "phrase": "Namaste",
        "pronunciation": "nah-mas-tay",
        "meaning": "Hello/Goodbye",
        "whenToUse": "Greeting people"
      }
    ],
    "currencyInfo": {
      "currency": "INR",
      "exchangeRate": 1,
      "whereToExchange": ["Banks", "ATMs"],
      "paymentMethods": ["Cash", "Cards", "UPI"],
      "tipping": true
    },
    "tippingGuide": {
      "restaurants": "10% for good service",
      "taxis": "Round up fare",
      "hotels": "₹50-100 per day for housekeeping",
      "activities": "₹100-200 for guides",
      "general": "Tipping is appreciated but not mandatory"
    }
  },
  "localInsights": {
    "history": "Detailed historical background",
    "culture": "Cultural overview",
    "traditions": ["Tradition 1", "Tradition 2"],
    "festivals": ["Festival 1", "Festival 2"],
    "customs": ["Custom 1", "Custom 2"],
    "donts": ["Don't do this", "Avoid that"],
    "localSecrets": ["Local secret 1", "Local secret 2"],
    "bestPhotoSpots": [
      {
        "name": "Photo Spot Name",
        "description": "Description of the spot",
        "location": "Specific location",
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
        "bestTime": "golden hour",
        "tips": ["Photo tip 1", "Photo tip 2"]
      }
    ]
  },
  "emergencyInfo": {
    "emergencyNumbers": [
      {"service": "Police", "number": "100"},
      {"service": "Fire", "number": "101"},
      {"service": "Ambulance", "number": "102"}
    ],
    "hospitals": [
      {
        "name": "City Hospital",
        "address": "Hospital address",
        "phone": "hospital phone"
      }
    ],
    "embassies": [
      {
        "country": "USA",
        "address": "Embassy address",
        "phone": "embassy phone"
      }
    ],
    "police": [
      {
        "station": "Tourist Police",
        "address": "Station address",
        "phone": "police phone"
      }
    ],
    "tourist_helpline": "1363",
    "insurance_contacts": ["Insurance contact 1"]
  },
  "packingList": [
    {
      "item": "Passport",
      "category": "documents",
      "essential": true,
      "seasonal": false,
      "notes": "Keep copies"
    },
    {
      "item": "Sunscreen",
      "category": "health",
      "essential": true,
      "seasonal": true,
      "notes": "SPF 30+ recommended"
    }
  ],
  "weatherInfo": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "temperature": {"min": 20, "max": 30},
      "condition": "sunny",
      "humidity": 65,
      "precipitation": 10,
      "windSpeed": 15,
      "uvIndex": 7,
      "clothingRecommendation": ["light cotton", "hat", "sunglasses"]
    }
  ]
}

IMPORTANT: Make this the most comprehensive, detailed, and personalized itinerary possible. Include specific names, addresses, exact costs, cultural insights, and practical information. Be creative with hidden gems and local experiences while ensuring everything is realistic and actionable.
`;
  }

  private parseDetailedResponse(response: string, tripData: EnhancedTripData): DetailedItinerary {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Ensure we have a valid structure with fallbacks
      return {
        id: `itinerary_${Date.now()}`,
        title: parsed.title || `${tripData.destination} Adventure`,
        description: parsed.description || 'AI-generated personalized itinerary',
        overview: parsed.overview || 'Comprehensive travel itinerary',
        totalCost: parsed.totalCost || tripData.budget.total,
        currency: parsed.currency || 'INR',
        days: parsed.days || [],
        budgetBreakdown: parsed.budgetBreakdown || this.createDefaultBudgetBreakdown(tripData),
        recommendations: parsed.recommendations || {},
        images: { 
          coverImage: '', 
          destinationImages: [], 
          activityImages: [], 
          foodImages: [], 
          accommodationImages: [], 
          mapImages: [] 
        },
        localInsights: parsed.localInsights || {},
        emergencyInfo: parsed.emergencyInfo || {},
        packingList: parsed.packingList || [],
        weatherInfo: parsed.weatherInfo || []
      };
    } catch (error) {
      console.error('Error parsing detailed response:', error);
      return this.createFallbackItinerary(tripData);
    }
  }

  private createDefaultBudgetBreakdown(tripData: EnhancedTripData): BudgetBreakdown {
    const { total, breakdown } = tripData.budget;
    
    return {
      total,
      categories: {
        accommodation: {
          budgeted: (total * breakdown.accommodation) / 100,
          estimated: (total * breakdown.accommodation) / 100,
          items: [],
          percentage: breakdown.accommodation,
          notes: []
        },
        transportation: {
          budgeted: (total * breakdown.transportation) / 100,
          estimated: (total * breakdown.transportation) / 100,
          items: [],
          percentage: breakdown.transportation,
          notes: []
        },
        food: {
          budgeted: (total * breakdown.food) / 100,
          estimated: (total * breakdown.food) / 100,
          items: [],
          percentage: breakdown.food,
          notes: []
        },
        activities: {
          budgeted: (total * breakdown.activities) / 100,
          estimated: (total * breakdown.activities) / 100,
          items: [],
          percentage: breakdown.activities,
          notes: []
        },
        shopping: {
          budgeted: (total * breakdown.shopping) / 100,
          estimated: (total * breakdown.shopping) / 100,
          items: [],
          percentage: breakdown.shopping,
          notes: []
        },
        miscellaneous: {
          budgeted: total * 0.05,
          estimated: total * 0.05,
          items: [],
          percentage: 5,
          notes: []
        }
      },
      dailyCosts: [],
      savingTips: [],
      costOptimizations: []
    };
  }

  private createFallbackItinerary(tripData: EnhancedTripData): DetailedItinerary {
    return {
      id: `itinerary_${Date.now()}`,
      title: `${tripData.destination} Adventure`,
      description: 'AI-generated personalized itinerary',
      overview: 'Comprehensive travel itinerary',
      totalCost: tripData.budget.total,
      currency: 'INR',
      days: [],
      budgetBreakdown: this.createDefaultBudgetBreakdown(tripData),
      recommendations: {
        bestTimeToVisit: '',
        seasonalHighlights: [],
        localEvents: [],
        hiddenGems: [],
        foodRecommendations: [],
        shoppingRecommendations: [],
        safetyTips: [],
        culturalEtiquette: [],
        languageTips: [],
        currencyInfo: {
          currency: 'INR',
          exchangeRate: 1,
          whereToExchange: [],
          paymentMethods: [],
          tipping: true
        },
        tippingGuide: {
          restaurants: '',
          taxis: '',
          hotels: '',
          activities: '',
          general: ''
        }
      },
      images: {
        coverImage: '',
        destinationImages: [],
        activityImages: [],
        foodImages: [],
        accommodationImages: [],
        mapImages: []
      },
      localInsights: {
        history: '',
        culture: '',
        traditions: [],
        festivals: [],
        customs: [],
        donts: [],
        localSecrets: [],
        bestPhotoSpots: []
      },
      emergencyInfo: {
        emergencyNumbers: [],
        hospitals: [],
        embassies: [],
        police: [],
        tourist_helpline: '',
        insurance_contacts: []
      },
      packingList: [],
      weatherInfo: []
    };
  }

  private async enhanceWithRealTimeData(itinerary: DetailedItinerary, tripData: EnhancedTripData): Promise<DetailedItinerary> {
    console.log('🔄 Enhancing with real-time data...');
    
    // This would integrate with real APIs for:
    // - Weather data
    // - Current prices
    // - Event calendars
    // - Booking availability
    // - Reviews and ratings
    
    // For now, we'll simulate this enhancement
    return itinerary;
  }

  private async addVisualizations(itinerary: DetailedItinerary, tripData: EnhancedTripData): Promise<DetailedItinerary> {
    console.log('🎨 Adding visualizations and images...');
    
    // Generate images using AI (this would integrate with image generation APIs)
    const images = await this.generateItineraryImages(itinerary, tripData);
    
    return {
      ...itinerary,
      images
    };
  }

  private async generateItineraryImages(itinerary: DetailedItinerary, tripData: EnhancedTripData): Promise<ItineraryImages> {
    // This would integrate with image generation APIs like DALL-E, Midjourney, or Stable Diffusion
    // For now, we'll use placeholder images
    
    return {
      coverImage: `https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80`,
      destinationImages: [
        `https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
        `https://images.unsplash.com/photo-1539650116574-75c0c6d73d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`
      ],
      activityImages: [],
      foodImages: [],
      accommodationImages: [],
      mapImages: []
    };
  }

  private async addCulturalInsights(itinerary: DetailedItinerary, tripData: EnhancedTripData): Promise<DetailedItinerary> {
    console.log('🏛️ Adding cultural insights...');
    
    // This would enhance the itinerary with deep cultural information
    return itinerary;
  }

  // File generation methods using simple file generator
  async generateTextItinerary(itinerary: DetailedItinerary): Promise<string> {
    const { simpleFileGenerator } = await import('./simple-file-generator');
    return simpleFileGenerator.generateTextItinerary(itinerary);
  }

  async generateCSVBudget(itinerary: DetailedItinerary): Promise<string> {
    const { simpleFileGenerator } = await import('./simple-file-generator');
    return simpleFileGenerator.generateCSVBudget(itinerary);
  }

  async generateItineraryJSON(itinerary: DetailedItinerary): Promise<string> {
    const { simpleFileGenerator } = await import('./simple-file-generator');
    return simpleFileGenerator.generateJSONBackup(itinerary);
  }

  async downloadAllFiles(itinerary: DetailedItinerary): Promise<void> {
    console.log('📥 Preparing all downloads...');
    
    try {
      const { simpleFileGenerator } = await import('./simple-file-generator');
      simpleFileGenerator.downloadAllFiles(itinerary);
      console.log('✅ All files downloaded successfully!');
    } catch (error) {
      console.error('❌ Error downloading files:', error);
      throw error;
    }
  }
}

export const agenticItineraryGenerator = new AgenticItineraryGenerator();
