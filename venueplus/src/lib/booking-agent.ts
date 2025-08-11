import { geminiTravelAgent } from './gemini-ai';
import { dataAggregator } from './web-scraper';
import axios from 'axios';

export interface BookingRequest {
  type: 'package' | 'flight' | 'hotel' | 'activity' | 'restaurant' | 'transport';
  destination: string;
  startDate: string;
  endDate?: string;
  travelers: number;
  budget?: string;
  preferences?: any;
}

export interface BookingOption {
  id: string;
  name: string;
  provider: string;
  price: number;
  rating: number;
  bookingUrl: string;
  features: string[];
  availability: boolean;
  aiScore: number; // AI-calculated compatibility score
  savings?: number;
  urgent?: boolean;
}

export interface SmartBookingResult {
  recommended: BookingOption[];
  alternatives: BookingOption[];
  packages: BookingOption[];
  individual: {
    flights: BookingOption[];
    hotels: BookingOption[];
    activities: BookingOption[];
    restaurants: BookingOption[];
    transport: BookingOption[];
  };
  insights: {
    bestValue: string;
    priceAlert: string;
    seasonalTips: string[];
    comparisons: Array<{
      option1: string;
      option2: string;
      difference: string;
      recommendation: string;
    }>;
  };
}

class SmartBookingAgent {
  async findBestBookingOptions(request: BookingRequest): Promise<SmartBookingResult> {
    // Get AI recommendations
    const aiRecommendations = await this.getAIRecommendations(request);
    
    // Get real-time data from multiple sources
    const realTimeData = await this.fetchRealTimeBookingData(request);
    
    // Combine and analyze options
    const analysisResult = await this.analyzeBookingOptions(realTimeData, request);
    
    // Generate smart insights
    const insights = await this.generateBookingInsights(analysisResult, request);
    
    return {
      recommended: analysisResult.recommended,
      alternatives: analysisResult.alternatives,
      packages: analysisResult.packages,
      individual: analysisResult.individual,
      insights
    };
  }

  private async getAIRecommendations(request: BookingRequest) {
    const prompt = `
    Find the best ${request.type} options for:
    - Destination: ${request.destination}
    - Dates: ${request.startDate} to ${request.endDate}
    - Travelers: ${request.travelers}
    - Budget: ${request.budget || 'flexible'}
    
    Consider:
    1. Best value for money
    2. Seasonal pricing
    3. User preferences
    4. Hidden costs
    5. Booking timing optimization
    
    Provide recommendations with reasoning.
    `;

    return await geminiTravelAgent.searchAndRecommend(prompt, request.preferences);
  }

  private async fetchRealTimeBookingData(request: BookingRequest) {
    const promises = [];

    // Fetch packages
    promises.push(dataAggregator.getComprehensivePackages(
      request.destination, 
      '7 days', 
      request.travelers
    ));

    // Fetch individual bookings
    promises.push(dataAggregator.getComprehensiveBookings(request));

    // Fetch additional real-time data from APIs
    promises.push(this.fetchAPIData(request));

    const [packages, bookings, apiData] = await Promise.all(promises);

    return { packages, bookings, apiData };
  }

  private async fetchAPIData(request: BookingRequest) {
    // Integrate with real booking APIs
    const data = {
      flights: await this.fetchFlightData(request),
      hotels: await this.fetchHotelData(request),
      activities: await this.fetchActivityData(request),
      priceAlerts: await this.fetchPriceAlerts(request)
    };

    return data;
  }

  private async fetchFlightData(request: BookingRequest) {
    // Mock implementation - replace with real flight APIs
    return [
      {
        id: 'flight_001',
        airline: 'Emirates',
        route: `${request.destination}`,
        price: 750,
        duration: '14h 30m',
        stops: 1,
        bookingUrl: 'https://emirates.com',
        class: 'Economy',
        baggage: '30kg included',
        cancellation: 'Free within 24h'
      }
    ];
  }

  private async fetchHotelData(request: BookingRequest) {
    // Mock implementation - replace with real hotel APIs
    return [
      {
        id: 'hotel_001',
        name: 'Grand Palace Hotel',
        location: request.destination,
        price: 150,
        rating: 4.5,
        amenities: ['Pool', 'Spa', 'WiFi', 'Breakfast'],
        bookingUrl: 'https://booking.com',
        cancellation: 'Free cancellation',
        roomType: 'Deluxe Room'
      }
    ];
  }

  private async fetchActivityData(request: BookingRequest) {
    // Mock implementation - replace with real activity APIs
    return [
      {
        id: 'activity_001',
        name: 'City Walking Tour',
        provider: 'GetYourGuide',
        price: 45,
        duration: '3 hours',
        rating: 4.7,
        bookingUrl: 'https://getyourguide.com',
        included: ['Professional guide', 'Small groups'],
        languages: ['English', 'Spanish']
      }
    ];
  }

  private async fetchPriceAlerts(request: BookingRequest) {
    // Mock price tracking data
    return {
      trend: 'decreasing',
      prediction: 'Prices expected to drop 15% in next 2 weeks',
      bestTimeToBook: '14 days before travel',
      seasonalFactors: ['Peak season', 'Holiday surcharge'],
      savings: [
        { action: 'Book 2 weeks earlier', amount: 120 },
        { action: 'Choose Tuesday departure', amount: 80 },
        { action: 'Book package vs separate', amount: 200 }
      ]
    };
  }

  private async analyzeBookingOptions(data: any, request: BookingRequest) {
    // AI-powered analysis of all booking options
    const allOptions: BookingOption[] = [];

    // Convert packages to booking options
    data.packages.forEach((pkg: any) => {
      allOptions.push({
        id: pkg.id || Math.random().toString(),
        name: pkg.title,
        provider: pkg.provider,
        price: this.parsePrice(pkg.price),
        rating: parseFloat(pkg.rating) || 4.0,
        bookingUrl: pkg.url,
        features: pkg.includes || [],
        availability: true,
        aiScore: this.calculateAIScore(pkg, request),
        savings: this.calculateSavings(pkg, request)
      });
    });

    // Sort by AI score
    allOptions.sort((a, b) => b.aiScore - a.aiScore);

    return {
      recommended: allOptions.slice(0, 3),
      alternatives: allOptions.slice(3, 6),
      packages: allOptions.filter(opt => opt.features.length > 2),
      individual: {
        flights: data.bookings.flights || [],
        hotels: data.bookings.hotels || [],
        activities: data.bookings.activities || [],
        restaurants: [],
        transport: []
      }
    };
  }

  private calculateAIScore(option: any, request: BookingRequest): number {
    let score = 0;

    // Price factor (30%)
    const price = this.parsePrice(option.price);
    const budgetMatch = this.getBudgetScore(price, request.budget);
    score += budgetMatch * 0.3;

    // Rating factor (25%)
    const rating = parseFloat(option.rating) || 4.0;
    score += (rating / 5) * 0.25;

    // Features factor (20%)
    const featureScore = Math.min(option.includes?.length || 0, 5) / 5;
    score += featureScore * 0.2;

    // Provider reputation (15%)
    const providerScore = this.getProviderScore(option.provider);
    score += providerScore * 0.15;

    // Availability and urgency (10%)
    score += option.availability ? 0.1 : 0;

    return Math.round(score * 100);
  }

  private getBudgetScore(price: number, budget?: string): number {
    if (!budget) return 0.8;
    
    const budgetRanges = {
      'budget': [0, 500],
      'mid-range': [500, 1500],
      'luxury': [1500, 5000]
    };

    const range = budgetRanges[budget as keyof typeof budgetRanges];
    if (!range) return 0.5;

    if (price >= range[0] && price <= range[1]) return 1.0;
    if (price < range[0]) return 0.9; // Under budget is good
    return Math.max(0.1, 1 - (price - range[1]) / range[1]); // Over budget penalty
  }

  private getProviderScore(provider: string): number {
    const scores: { [key: string]: number } = {
      'booking.com': 0.9,
      'expedia': 0.85,
      'agoda': 0.8,
      'makemytrip': 0.85,
      'tripadvisor': 0.8,
      'getyourguide': 0.9,
      'viator': 0.85,
      'skyscanner': 0.9,
      'kayak': 0.85
    };

    return scores[provider.toLowerCase()] || 0.7;
  }

  private calculateSavings(option: any, request: BookingRequest): number {
    // Mock savings calculation
    const basePrice = this.parsePrice(option.price);
    return Math.round(basePrice * (0.1 + Math.random() * 0.2)); // 10-30% potential savings
  }

  private async generateBookingInsights(analysis: any, request: BookingRequest) {
    const bestOption = analysis.recommended[0];
    const cheapestOption = analysis.recommended.reduce((min: any, current: any) => 
      current.price < min.price ? current : min
    );

    return {
      bestValue: `${bestOption?.name} offers the best overall value with ${bestOption?.aiScore}% compatibility`,
      priceAlert: `Prices for ${request.destination} are ${Math.random() > 0.5 ? 'trending down' : 'stable'} - good time to book`,
      seasonalTips: [
        'Book flights 6-8 weeks in advance for best prices',
        'Tuesday and Wednesday departures are typically 20% cheaper',
        'Avoid booking during local holidays for better rates'
      ],
      comparisons: [
        {
          option1: bestOption?.name || 'Top Option',
          option2: cheapestOption?.name || 'Budget Option',
          difference: `$${Math.abs((bestOption?.price || 0) - (cheapestOption?.price || 0))}`,
          recommendation: bestOption?.price === cheapestOption?.price ? 
            'Both options offer great value' : 
            'Pay extra for better amenities and flexibility'
        }
      ]
    };
  }

  private parsePrice(priceString: string): number {
    if (typeof priceString === 'number') return priceString;
    const cleanPrice = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice) || 0;
  }

  // Live booking functionality
  async initiateBooking(optionId: string, userDetails: any) {
    // This would integrate with actual booking APIs
    return {
      bookingId: `booking_${Date.now()}`,
      status: 'pending',
      confirmationUrl: `https://venueplus.com/bookings/${optionId}`,
      estimatedConfirmation: '2-5 minutes'
    };
  }

  // Price monitoring
  async setupPriceAlert(request: BookingRequest, targetPrice: number) {
    // This would set up price monitoring
    return {
      alertId: `alert_${Date.now()}`,
      monitoring: true,
      targetPrice,
      currentPrice: 850,
      alertMethods: ['email', 'push'],
      estimatedSavings: targetPrice < 850 ? 850 - targetPrice : 0
    };
  }
}

export const smartBookingAgent = new SmartBookingAgent();
