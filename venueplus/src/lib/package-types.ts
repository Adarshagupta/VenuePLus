// Package system types for VenuePlus
// Supports both scraped packages from internet and AI-generated packages

export type PackageSource = 'scraped' | 'ai_generated'
export type PackageType = 'accommodation' | 'flight' | 'complete_package' | 'activity' | 'transport'
export type PackageCategory = 'budget' | 'mid_range' | 'luxury' | 'adventure' | 'cultural' | 'family' | 'romantic'

export interface BasePackage {
  id: string
  name: string
  description: string
  destination: string
  duration: string // e.g., "5 days 4 nights"
  price: number
  currency: string
  source: PackageSource
  type: PackageType
  category: PackageCategory
  rating: number
  reviewCount: number
  imageUrl: string
  provider: string
  createdAt: Date
  updatedAt: Date
  itinerary?: PackageItinerary
  summary: {
    totalDays: number
    cities: string[]
    totalActivities: number
    totalMeals: number
    accommodationType: string
    transportModes: string[]
  }
}

export interface ScrapedPackage extends BasePackage {
  source: 'scraped'
  originalUrl: string
  scrapedAt: Date
  availability: 'available' | 'limited' | 'sold_out' | 'unknown'
  bookingUrl: string
  terms: string[]
  aiAnalysis?: AIPackageAnalysis // Added by AI after scraping
}

export interface AIGeneratedPackage extends BasePackage {
  source: 'ai_generated'
  prompt: string
  generationModel: string
  confidence: number // 0-1, how confident AI is about this package
  aiFeatures: AIFeature[]
  customizations: Customization[]
  realTimeData?: RealTimeData
}

export interface AIPackageAnalysis {
  qualityScore: number // 1-10
  priceValue: 'excellent' | 'good' | 'fair' | 'poor'
  highlights: string[]
  potentialIssues: string[]
  recommendations: string[]
  competitorComparison: CompetitorComparison[]
  trustScore: number // 1-10 based on provider reputation
}

export interface AIFeature {
  name: string
  description: string
  category: 'personalization' | 'optimization' | 'insights' | 'automation'
  benefit: string
}

export interface Customization {
  type: 'dietary' | 'accessibility' | 'interest' | 'budget' | 'pace' | 'group_size'
  value: string
  impact: string
}

export interface RealTimeData {
  weatherForecast: WeatherInfo[]
  currentEvents: LocalEvent[]
  priceFluctuations: PriceHistory[]
  crowdLevels: CrowdInfo[]
  lastUpdated: Date
}

export interface WeatherInfo {
  date: string
  temperature: { min: number; max: number }
  condition: string
  recommendation: string
}

export interface LocalEvent {
  name: string
  date: string
  description: string
  impact: 'positive' | 'neutral' | 'negative'
  recommendation: string
}

export interface PriceHistory {
  date: string
  price: number
  trend: 'increasing' | 'decreasing' | 'stable'
}

export interface CrowdInfo {
  location: string
  level: 'low' | 'medium' | 'high' | 'very_high'
  timeOfDay: string
  recommendation: string
}

export interface CompetitorComparison {
  competitor: string
  price: number
  rating: number
  advantages: string[]
  disadvantages: string[]
}

export interface PackageItinerary {
  days: PackageDay[]
  totalCost: number
  included: string[]
  excluded: string[]
  cancellationPolicy: string
  bookingDeadline?: Date
  highlights: string[]
  overview: string
  bestTimeToVisit: string
  difficulty: 'easy' | 'moderate' | 'challenging'
  groupSize: { min: number; max: number }
}

export interface PackageDay {
  day: number
  date: string
  city: string
  theme: string
  weather: {
    condition: string
    temperature: { min: number; max: number }
    recommendation: string
  }
  activities: PackageActivity[]
  meals: PackageMeal[]
  accommodation: PackageAccommodation
  transport: PackageTransport[]
  freeTime: string
  notes: string[]
  estimatedCost: number
  walkingDistance: string
  highlights: string[]
  photos: string[]
  timeline: DayTimeline[]
}

export interface DayTimeline {
  time: string
  activity: string
  type: 'activity' | 'meal' | 'transport' | 'free_time' | 'check_in' | 'check_out'
  location: string
  duration: string
  cost?: number
  icon: string
  description: string
}

export interface PackageActivity {
  name: string
  description: string
  duration: string
  location: string
  address: string
  coordinates: { lat: number; lng: number }
  included: boolean
  optional: boolean
  additionalCost?: number
  bookingRequired: boolean
  category: string
  difficulty: 'easy' | 'moderate' | 'challenging'
  ageRecommendation: string
  photos: string[]
  tips: string[]
  bestTimeToVisit: string
  crowdLevel: 'low' | 'medium' | 'high'
  accessibility: string[]
}

export interface PackageMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  venue: string
  cuisine: string
  included: boolean
  cost?: number
  description: string
}

export interface PackageAccommodation {
  name: string
  type: string
  location: string
  rating: number
  amenities: string[]
  roomType: string
  checkIn: string
  checkOut: string
  included: boolean
  costPerNight?: number
}

export interface PackageTransport {
  mode: 'flight' | 'train' | 'bus' | 'car' | 'boat' | 'metro' | 'taxi'
  from: string
  to: string
  duration: string
  included: boolean
  cost?: number
  provider: string
  class: string
  departure: string
  arrival: string
  detailedSchedule?: TravelSchedule
  connections?: PackageTransport[]
  baggageInfo?: BaggageInfo
  checkInInfo?: CheckInInfo
}

export interface TravelSchedule {
  departureLocation: LocationDetails
  arrivalLocation: LocationDetails
  hourlyBreakdown: TravelTimelineItem[]
  totalJourneyTime: string
  distanceCovered: string
  recommendations: TravelRecommendation[]
  journeyType: 'direct' | 'connecting' | 'multi_modal'
}

export interface LocationDetails {
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  type: 'airport' | 'railway_station' | 'bus_terminal' | 'hotel' | 'landmark'
  code?: string // Airport/station code
  terminal?: string
  gate?: string
  contactInfo?: string
  facilities: string[]
  transportOptions: string[]
  nearbyAmenities: string[]
}

export interface TravelTimelineItem {
  time: string
  duration: string
  activity: string
  location: string
  type: 'departure_prep' | 'check_in' | 'security' | 'boarding' | 'travel' | 'layover' | 'arrival' | 'baggage' | 'customs' | 'ground_transport' | 'hotel_transfer'
  description: string
  requirements?: string[]
  tips?: string[]
  cost?: number
  status: 'required' | 'optional' | 'recommended'
  icon: string
  estimatedTime?: string
  alternatives?: string[]
}

export interface TravelRecommendation {
  type: 'timing' | 'documentation' | 'comfort' | 'cost' | 'safety' | 'logistics'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  applicableSteps: string[]
  timeRelevant?: string
}

export interface BaggageInfo {
  allowance: {
    checkedBags: { weight: string; dimensions: string; count: number }
    carryOn: { weight: string; dimensions: string; count: number }
    personalItem: { weight: string; dimensions: string; count: number }
  }
  restrictions: string[]
  additionalCosts: { weight: string; cost: number }[]
  tips: string[]
  checkInProcess: string[]
}

export interface CheckInInfo {
  onlineCheckIn: {
    available: boolean
    opensHoursBefore: number
    closesHoursBefore: number
    website?: string
    mobileApp?: string
  }
  airportCheckIn: {
    opensHoursBefore: number
    closesMinutesBefore: number
    recommendedArrival: string
    counters: string[]
  }
  requirements: string[]
  documents: string[]
  specialServices?: string[]
}

export interface PackageFilter {
  source?: PackageSource[]
  type?: PackageType[]
  category?: PackageCategory[]
  priceRange?: { min: number; max: number }
  duration?: string[]
  rating?: { min: number }
  destination?: string
  availability?: string[]
  sortBy?: 'price' | 'rating' | 'duration' | 'popularity' | 'ai_score'
  sortOrder?: 'asc' | 'desc'
}

export interface PackageComparison {
  packages: (ScrapedPackage | AIGeneratedPackage)[]
  criteria: ComparisonCriteria[]
  recommendation: {
    bestOverall: string
    bestValue: string
    bestLuxury: string
    bestBudget: string
    reasoning: string
  }
}

export interface ComparisonCriteria {
  name: string
  weight: number // 0-1
  description: string
}

export interface PackageBookingRequest {
  packageId: string
  travelers: number
  rooms: { adults: number; children: number }[]
  startDate: Date
  specialRequests?: string
  contactInfo: {
    name: string
    email: string
    phone: string
  }
  preferences?: {
    dietary: string[]
    accessibility: string[]
    interests: string[]
  }
}

export interface PackageBookingResponse {
  success: boolean
  bookingId?: string
  confirmation?: string
  totalCost: number
  paymentOptions: PaymentOption[]
  cancellationPolicy: string
  nextSteps: string[]
  error?: string
}

export interface PaymentOption {
  method: 'card' | 'bank_transfer' | 'upi' | 'wallet' | 'installments'
  provider: string
  processingFee: number
  description: string
  available: boolean
}
